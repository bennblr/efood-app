import { makeAutoObservable, runInAction } from "mobx";
import type { Reservation } from "@/types";
import { apiFetch } from "@/lib/api";

export class ReservationStore {
  list: Reservation[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setList(list: Reservation[]) {
    this.list = list;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  async fetchMyReservations() {
    this.loading = true;
    this.error = null;
    try {
      const res = await apiFetch("/api/reservations/my");
      const data = await res.json();
      runInAction(() => {
        this.list = data;
      });
    } catch (e) {
      runInAction(() => {
        this.error = e instanceof Error ? e.message : "Ошибка загрузки броней";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async create(params: {
    startTime: string;
    endTime: string;
    personsCount: number;
  }) {
    this.loading = true;
    this.error = null;
    try {
      const res = await apiFetch("/api/reservations", {
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
        this.error = e instanceof Error ? e.message : "Ошибка создания брони";
      });
      throw e;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

export const reservationStore = new ReservationStore();
