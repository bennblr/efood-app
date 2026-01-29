import { makeAutoObservable, runInAction } from "mobx";
import type { Category, Product } from "@/types";
import { apiFetch } from "@/lib/api";

export class MenuStore {
  restaurantId: string | null = null;
  categories: Category[] = [];
  productsByCategory: Record<string, Product[]> = {};
  /** Все товары по порядку: сначала по категориям, затем по названию (для режима «Все») */
  allProductsInOrder: Product[] = [];
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
      this.allProductsInOrder = [];
      this.selectedCategoryId = null;
    }
  }

  setCategories(categories: Category[]) {
    this.categories = categories;
  }

  setProductsByCategory(categoryId: string, products: Product[]) {
    this.productsByCategory[categoryId] = products;
  }

  setAllProductsInOrder(products: Product[]) {
    this.allProductsInOrder = products;
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

  /** Товары: при выбранной категории — только её; иначе — все по порядку по категориям */
  get products(): Product[] {
    if (this.selectedCategoryId) {
      return this.productsByCategory[this.selectedCategoryId] ?? [];
    }
    return this.allProductsInOrder;
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

  /** Загрузить все товары ресторана (по категориям) — для режима «Все» и заполнения productsByCategory */
  async fetchAllProducts(restaurantId: string) {
    this.loading = true;
    this.error = null;
    try {
      const res = await apiFetch(`/api/restaurants/${encodeURIComponent(restaurantId)}/products`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      const byCategory: Record<string, Product[]> = {};
      for (const p of list) {
        const catId = p.categoryId;
        if (!byCategory[catId]) byCategory[catId] = [];
        byCategory[catId].push(p);
      }
      runInAction(() => {
        this.allProductsInOrder = list;
        this.productsByCategory = { ...this.productsByCategory, ...byCategory };
      });
    } catch (e) {
      runInAction(() => {
        this.error = e instanceof Error ? e.message : "Ошибка загрузки меню";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

export const menuStore = new MenuStore();
