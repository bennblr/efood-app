import { makeAutoObservable, runInAction } from "mobx";
import type { Category, Product } from "@/types";
import { apiFetch } from "@/lib/api";

export class MenuStore {
  restaurantId: string | null = null;
  categories: Category[] = [];
  productsByCategory: Record<string, Product[]> = {};
  selectedCategoryId: string | null = null;
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setRestaurantId(id: string | null) {
    this.restaurantId = id;
    if (!id) {
      this.categories = [];
      this.productsByCategory = {};
      this.selectedCategoryId = null;
    }
  }

  setCategories(categories: Category[]) {
    this.categories = categories;
  }

  setProductsByCategory(categoryId: string, products: Product[]) {
    this.productsByCategory[categoryId] = products;
  }

  setSelectedCategoryId(id: string | null) {
    this.selectedCategoryId = id;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  get products(): Product[] {
    if (!this.selectedCategoryId) return [];
    return this.productsByCategory[this.selectedCategoryId] ?? [];
  }

  async fetchCategories(restaurantId: string) {
    this.loading = true;
    this.error = null;
    try {
      const res = await apiFetch(`/api/restaurants/${encodeURIComponent(restaurantId)}/categories`);
      const data = await res.json();
      runInAction(() => {
        this.restaurantId = restaurantId;
        this.categories = data;
      });
    } catch (e) {
      runInAction(() => {
        this.error = e instanceof Error ? e.message : "Ошибка загрузки категорий";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchProducts(restaurantId: string, categoryId: string) {
    this.loading = true;
    this.error = null;
    try {
      const res = await apiFetch(
        `/api/restaurants/${encodeURIComponent(restaurantId)}/categories/${encodeURIComponent(categoryId)}/products`
      );
      const data = await res.json();
      runInAction(() => {
        this.productsByCategory[categoryId] = data;
      });
    } catch (e) {
      runInAction(() => {
        this.error = e instanceof Error ? e.message : "Ошибка загрузки блюд";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

export const menuStore = new MenuStore();
