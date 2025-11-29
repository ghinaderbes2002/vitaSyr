// src/lib/api/auth.ts

import apiClient from "./client";
import type { LoginRequest, LoginResponse, User } from "@/types/auth";

export const authApi = {
  // تسجيل الدخول
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>(
      "/auth/login",
      credentials
    );
    return data;
  },

  // الحصول على بيانات المستخدم الحالي
  getProfile: async (): Promise<User> => {
    const { data } = await apiClient.get<User>("/auth/profile");
    return data;
  },

  // تحديث البروفايل
  updateProfile: async (updates: {
    full_name?: string;
    phone?: string;
    password?: string;
  }): Promise<User> => {
    const { data } = await apiClient.put<User>("/auth/profile", updates);
    return data;
  },
};
