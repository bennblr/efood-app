import { makeAutoObservable, runInAction } from "mobx";
import type { Order } from "@/types";
import { apiFetch } from "@/lib/api";

export class OrderStore {
  list: Order[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setList(list: Order[]) {
    this.list = list;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  async fetchMyOrders() {
    this.loading = true;
    this.error = null;
    try {
      const res = await apiFetch("/api/orders/my");
      const data = await res.json();
      runInAction(() => {
        this.list = data;
      });
    } catch (e) {
      runInAction(() => {
        this.error = e instanceof Error ? e.message : "Ошибка загрузки заказов";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async create(params: {
    restaurantId: string;
    reservationId?: string | null;
    items: { productId: string; quantity: number; comment?: string }[];
  }) {
    this.loading = true;
    this.error = null;
    try {
      const res = await apiFetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      runInAction(() => {
        this.list.unshift(data);
      });
      return data;
    } catch (e) {
      runInAction(() => {
        this.error = e instanceof Error ? e.message : "Ошибка создания заказа";
      });
      throw e;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

export const orderStore = new OrderStore();
