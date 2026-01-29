import { makeAutoObservable } from "mobx";
import type { CartItem, Product } from "@/types";

export class CartStore {
  items: CartItem[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addItem(product: Product, quantity = 1, comment?: string) {
    const existing = this.items.find((i) => i.productId === product.id);
    if (existing) {
      existing.quantity += quantity;
      if (comment !== undefined) existing.comment = comment;
    } else {
      this.items.push({
        productId: product.id,
        product,
        quantity,
        comment,
      });
    }
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

  setComment(productId: string, comment: string) {
    const item = this.items.find((i) => i.productId === productId);
    if (item) item.comment = comment;
  }

  clear() {
    this.items = [];
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
