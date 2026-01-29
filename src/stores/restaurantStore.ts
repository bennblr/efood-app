import { makeAutoObservable, runInAction } from "mobx";
import type { Restaurant } from "@/types";
import { apiFetch } from "@/lib/api";

export class RestaurantStore {
  list: Restaurant[] = [];
  current: Restaurant | null = null;
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setCurrent(restaurant: Restaurant | null) {
    this.current = restaurant;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  async fetchList() {
    this.loading = true;
    this.error = null;
    try {
      const res = await apiFetch("/api/restaurants");
      const data = await res.json();
      runInAction(() => {
        this.list = Array.isArray(data) ? data : [];
      });
    } catch (e) {
      runInAction(() => {
        this.error = e instanceof Error ? e.message : "Ошибка загрузки ресторанов";
        this.list = [];
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchBySlug(slug: string) {
    this.loading = true;
    this.error = null;
    try {
      const res = await apiFetch(`/api/restaurants/${encodeURIComponent(slug)}`);
      if (!res.ok) {
        runInAction(() => {
          this.current = null;
        });
        return null;
      }
      const data = await res.json();
      runInAction(() => {
        this.current = data;
      });
      return data as Restaurant;
    } catch (e) {
      runInAction(() => {
        this.error = e instanceof Error ? e.message : "Ошибка загрузки ресторана";
        this.current = null;
      });
      return null;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

export const restaurantStore = new RestaurantStore();
