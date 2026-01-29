import { makeAutoObservable, runInAction } from "mobx";
import type { Category, Product } from "@/types";

export class MenuStore {
  categories: Category[] = [];
  productsByCategory: Record<string, Product[]> = {};
  selectedCategoryId: string | null = null;
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
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

  async fetchCategories() {
    this.loading = true;
    this.error = null;
    try {
      const res = await fetch("/api/menu/categories");
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      runInAction(() => {
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

  async fetchProducts(categoryId: string) {
    this.loading = true;
    this.error = null;
    try {
      const res = await fetch(`/api/menu/categories/${categoryId}/products`);
      if (!res.ok) throw new Error(await res.text());
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
