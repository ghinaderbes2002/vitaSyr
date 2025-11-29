// src/store/authStore.ts

import { create } from "zustand";
import Cookies from "js-cookie";
import type { User } from "@/types/auth";
import { authApi } from "@/lib/api/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });

      // حفظ التوكن والمستخدم في الكوكيز
      Cookies.set("token", response.token, { expires: 1 }); // يوم واحد
      Cookies.set("user", JSON.stringify(response.user), { expires: 1 });

      set({
        user: response.user as any,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    Cookies.remove("token");
    Cookies.remove("user");

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },

  checkAuth: async () => {
    try {
      const token = Cookies.get("token");
      const userStr = Cookies.get("user");

      if (!token || !userStr) {
        set({ isLoading: false, isAuthenticated: false });
        return;
      }

      const user = JSON.parse(userStr);

      // التحقق من صلاحية التوكن
      await authApi.getProfile();

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      // إذا فشل، نسجل خروج
      Cookies.remove("token");
      Cookies.remove("user");
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  setUser: (user: User) => {
    Cookies.set("user", JSON.stringify(user), { expires: 1 });
    set({ user });
  },
}));
