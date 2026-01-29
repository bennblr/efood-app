import { makeAutoObservable, runInAction } from "mobx";
import type {
  Category,
  Product,
  Reservation,
  Order,
  MenuSchedule,
  AuditLog,
} from "@/types";

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
      const res = await fetch("/api/admin/categories");
      if (!res.ok) throw new Error(await res.text());
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
      const res = await fetch("/api/admin/products");
      if (!res.ok) throw new Error(await res.text());
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
      const res = await fetch("/api/admin/reservations");
      if (!res.ok) throw new Error(await res.text());
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
      const res = await fetch("/api/admin/orders");
      if (!res.ok) throw new Error(await res.text());
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
      const res = await fetch("/api/admin/schedules");
      if (!res.ok) throw new Error(await res.text());
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
      const res = await fetch("/api/admin/audit");
      if (!res.ok) throw new Error(await res.text());
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
