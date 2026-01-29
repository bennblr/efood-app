import { makeAutoObservable } from "mobx";
import type { User } from "@/types";

export class UserStore {
  user: User | null = null;
  loading = true;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user: User | null) {
    this.user = user;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  get isAdmin() {
    return this.user?.role === "admin" || this.user?.role === "employee";
  }

  get isAuthenticated() {
    return !!this.user;
  }
}

export const userStore = new UserStore();
