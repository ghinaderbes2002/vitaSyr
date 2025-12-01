// src/lib/api/partnerships.ts

import apiClient from "./client";
import type {
  PartnershipInquiry,
  CreatePartnershipInquiryDto,
  UpdatePartnershipInquiryDto,
} from "@/types/partnership";

export const partnershipsApi = {
  // جلب جميع استفسارات الشراكات
  getAll: async (): Promise<PartnershipInquiry[]> => {
    const { data } = await apiClient.get<PartnershipInquiry[]>(
      "/partnerships/partnership-inquiries"
    );
    return data;
  },

  // جلب استفسار واحد
  getOne: async (id: string): Promise<PartnershipInquiry> => {
    const { data } = await apiClient.get<PartnershipInquiry>(
      `/partnerships/partnership-inquiries/${id}`
    );
    return data;
  },

  // إنشاء استفسار جديد
  create: async (
    inquiryData: CreatePartnershipInquiryDto
  ): Promise<PartnershipInquiry> => {
    const { data } = await apiClient.post<PartnershipInquiry>(
      "/partnerships/partnership-inquiries",
      inquiryData
    );
    return data;
  },

  // تحديث استفسار
  update: async (
    id: string,
    updates: UpdatePartnershipInquiryDto
  ): Promise<PartnershipInquiry> => {
    const { data } = await apiClient.put<PartnershipInquiry>(
      `/partnerships/partnership-inquiries/${id}`,
      updates
    );
    return data;
  },

  // حذف استفسار
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/partnerships/partnership-inquiries/${id}`);
  },
};
