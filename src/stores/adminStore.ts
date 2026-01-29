import { makeAutoObservable, runInAction } from "mobx";
import type {
  Category,
  Product,
  Reservation,
  Order,
  MenuSchedule,
  AuditLog,
} from "@/types";
import { apiFetch } from "@/lib/api";

export class AdminStore {
  categories: Category[] = [];
  products: Product[] = [];
  reservations: Reservation[] = [];
  orders: Order[] = [];
  schedules: MenuSchedule[] = [];
  auditLogs: AuditLog[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  async fetchCategories() {
    this.loading = true;
    try {
      const res = await apiFetch("/api/admin/categories");
      const data = await res.json();
      runInAction(() => {
        this.categories = data;
      });
    } catch (e) {
      runInAction(() => {
        this.error = e instanceof Error ? e.message : "Ошибка";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchProducts() {
    this.loading = true;
    try {
      const res = await apiFetch("/api/admin/products");
      const data = await res.json();
      runInAction(() => {
        this.products = data;
      });
    } catch (e) {
      runInAction(() => {
        this.error = e instanceof Error ? e.message : "Ошибка";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchReservations() {
    this.loading = true;
    try {
      const res = await apiFetch("/api/admin/reservations");
      const data = await res.json();
      runInAction(() => {
        this.reservations = data;
      });
    } catch (e) {
      runInAction(() => {
        this.error = e instanceof Error ? e.message : "Ошибка";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchOrders() {
    this.loading = true;
    try {
      const res = await apiFetch("/api/admin/orders");
      const data = await res.json();
      runInAction(() => {
        this.orders = data;
      });
    } catch (e) {
      runInAction(() => {
        this.error = e instanceof Error ? e.message : "Ошибка";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchSchedules() {
    this.loading = true;
    try {
      const res = await apiFetch("/api/admin/schedules");
      const data = await res.json();
      runInAction(() => {
        this.schedules = data;
      });
    } catch (e) {
      runInAction(() => {
        this.error = e instanceof Error ? e.message : "Ошибка";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchAuditLogs() {
    this.loading = true;
    try {
      const res = await apiFetch("/api/admin/audit");
      const data = await res.json();
      runInAction(() => {
        this.auditLogs = data;
      });
    } catch (e) {
      runInAction(() => {
        this.error = e instanceof Error ? e.message : "Ошибка";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

export const adminStore = new AdminStore();
