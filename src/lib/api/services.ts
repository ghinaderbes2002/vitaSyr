// src/lib/api/services.ts

import apiClient from "./client";
import type { Service, CreateServiceData } from "@/types/service";

export const servicesApi = {
  // جلب جميع الخدمات
  getAll: async (): Promise<Service[]> => {
    const { data } = await apiClient.get<Service[]>("/services");
    return data;
  },

  // جلب خدمة واحدة
  getOne: async (id: string): Promise<Service> => {
    const { data } = await apiClient.get<Service>(`/services/${id}`);
    return data;
  },

  // إنشاء خدمة جديدة
  create: async (serviceData: CreateServiceData): Promise<Service> => {
    const { data } = await apiClient.post<Service>("/services", serviceData);
    return data;
  },

  // تحديث خدمة
  update: async (
    id: string,
    updates: Partial<CreateServiceData>
  ): Promise<Service> => {
    const { data } = await apiClient.put<Service>(`/services/${id}`, updates);
    return data;
  },

  // حذف خدمة
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/services/${id}`);
  },

  // Features
  addFeature: async (
    serviceId: string,
    feature: { title: string; description: string; orderIndex: number }
  ) => {
    const { data } = await apiClient.post(
      `/services/${serviceId}/features`,
      feature
    );
    return data;
  },

  updateFeature: async (featureId: string, updates: any) => {
    const { data } = await apiClient.put(
      `/services/features/${featureId}`,
      updates
    );
    return data;
  },

  deleteFeature: async (featureId: string) => {
    await apiClient.delete(`/services/features/${featureId}`);
  },

  // Benefits
  addBenefit: async (
    serviceId: string,
    benefit: { benefitText: string; orderIndex: number }
  ) => {
    const { data } = await apiClient.post(
      `/services/${serviceId}/benefits`,
      benefit
    );
    return data;
  },

  updateBenefit: async (benefitId: string, updates: any) => {
    const { data } = await apiClient.put(
      `/services/benefits/${benefitId}`,
      updates
    );
    return data;
  },

  deleteBenefit: async (benefitId: string) => {
    await apiClient.delete(`/services/benefits/${benefitId}`);
  },

  // Images
  addImage: async (serviceId: string, formData: FormData) => {
    const { data } = await apiClient.post(
      `/services/${serviceId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  },

  deleteImage: async (imageId: string) => {
    await apiClient.delete(`/services/images/${imageId}`);
  },
};
