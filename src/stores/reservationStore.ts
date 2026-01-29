import { makeAutoObservable, runInAction } from "mobx";
import type { Reservation, ReservationStatus } from "@/types";

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
      const res = await fetch("/api/reservations/my");
      if (!res.ok) throw new Error(await res.text());
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
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error(await res.text());
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
