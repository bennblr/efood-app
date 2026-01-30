import { makeAutoObservable } from "mobx";
import type { CartItem, Product } from "@/types";

export type PendingReplace = {
  product: Product;
  quantity: number;
  restaurantId: string;
  restaurantSlug?: string;
};

export class CartStore {
  restaurantId: string | null = null;
  restaurantSlug: string | null = null;
  items: CartItem[] = [];
  /** Комментарий ко всему заказу/брони (не к каждому товару). */
  orderComment: string = "";
  /** При добавлении из другого ресторана — показываем подтверждение; после подтверждения корзина заменяется. */
  pendingReplace: PendingReplace | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  /** Добавить в корзину. При смене ресторана возвращает "replace_required" и ставит pendingReplace; иначе "added". */
  addItem(
    product: Product,
    quantity = 1,
    _comment?: string,
    restaurantId?: string,
    restaurantSlug?: string
  ): "added" | "replace_required" {
    const rid = restaurantId ?? this.restaurantId;
    const rslug = restaurantSlug ?? this.restaurantSlug;
    if (rid && this.restaurantId !== null && this.restaurantId !== rid) {
      this.pendingReplace = { product, quantity, restaurantId: rid, restaurantSlug: rslug ?? undefined };
      return "replace_required";
    }
    if (rid) this.restaurantId = rid;
    if (rslug) this.restaurantSlug = rslug;

    const existing = this.items.find((i) => i.productId === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({
        productId: product.id,
        product,
        quantity,
      });
    }
    return "added";
  }

  /** Подтвердить замену корзины: удалить текущие товары и добавить pendingReplace. */
  confirmReplace() {
    const p = this.pendingReplace;
    this.pendingReplace = null;
    if (!p) return;
    this.clear();
    this.restaurantId = p.restaurantId;
    this.restaurantSlug = p.restaurantSlug ?? null;
    this.addItem(p.product, p.quantity, undefined, p.restaurantId, p.restaurantSlug);
  }

  cancelReplace() {
    this.pendingReplace = null;
  }

  removeItem(productId: string) {
    this.items = this.items.filter((i) => i.productId !== productId);
  }

  setQuantity(productId: string, quantity: number) {
    const item = this.items.find((i) => i.productId === productId);
    if (item) {
      if (quantity <= 0) this.removeItem(productId);
      else item.quantity = quantity;
    }
  }

  setOrderComment(comment: string) {
    this.orderComment = comment;
  }

  clear() {
    this.items = [];
    this.restaurantId = null;
    this.restaurantSlug = null;
    this.orderComment = "";
  }

  get totalSum() {
    return this.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  }

  get totalCount() {
    return this.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  get isEmpty() {
    return this.items.length === 0;
  }
}

export const cartStore = new CartStore();
