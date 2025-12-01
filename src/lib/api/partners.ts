// src/lib/api/partners.ts

import apiClient from "./client";
import type { Partner, CreatePartnerData } from "@/types/partner";

export const partnersApi = {
  // Get all partners
  getAll: async (): Promise<Partner[]> => {
    const { data } = await apiClient.get<Partner[]>("/partners");
    return data;
  },

  // Get single partner
  getOne: async (id: string): Promise<Partner> => {
    const { data } = await apiClient.get<Partner>(`/partners/${id}`);
    return data;
  },

  // Create partner with logo upload
  create: async (partnerData: FormData): Promise<Partner> => {
    const { data } = await apiClient.post<Partner>("/partners", partnerData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  // Update partner (can include new logo)
  update: async (id: string, partnerData: FormData): Promise<Partner> => {
    const { data } = await apiClient.put<Partner>(
      `/partners/${id}`,
      partnerData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  },

  // Delete partner
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/partners/${id}`);
  },
};
