import { makeAutoObservable, runInAction } from "mobx";
import type {
  Category,
  Product,
  Reservation,
  Order,
  MenuSchedule,
  AuditLog,
  Restaurant,
} from "@/types";
import { apiFetch } from "@/lib/api";

export class AdminStore {
  currentRestaurantId: string | null = null;
  restaurants: Restaurant[] = [];
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

  setCurrentRestaurantId(id: string | null) {
    this.currentRestaurantId = id;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  private adminQuery(): string {
    return this.currentRestaurantId
      ? `?restaurantId=${encodeURIComponent(this.currentRestaurantId)}`
      : "";
  }

  async fetchRestaurants() {
    this.loading = true;
    try {
      const res = await apiFetch("/api/admin/restaurants");
      const data = await res.json();
      runInAction(() => {
        this.restaurants = data;
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

  async fetchCategories() {
    this.loading = true;
    try {
      const res = await apiFetch("/api/admin/categories" + this.adminQuery());
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
      const res = await apiFetch("/api/admin/products" + this.adminQuery());
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
      const res = await apiFetch("/api/admin/reservations" + this.adminQuery());
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
      const res = await apiFetch("/api/admin/orders" + this.adminQuery());
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
      const res = await apiFetch("/api/admin/schedules" + this.adminQuery());
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
      const res = await apiFetch("/api/admin/audit" + this.adminQuery());
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
