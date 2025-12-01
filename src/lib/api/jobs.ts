// src/lib/api/jobs.ts

import apiClient from "./client";
import type {
  JobApplication,
  CreateJobApplicationDto,
  UpdateJobApplicationDto,
} from "@/types/jobApplication";

export const jobsApi = {
  // جلب جميع طلبات التوظيف
  getAll: async (): Promise<JobApplication[]> => {
    const { data } = await apiClient.get<JobApplication[]>("/jobs/job-applications");
    return data;
  },

  // جلب طلب توظيف واحد
  getOne: async (id: string): Promise<JobApplication> => {
    const { data } = await apiClient.get<JobApplication>(`/jobs/job-applications/${id}`);
    return data;
  },

  // إنشاء طلب توظيف جديد (للفورم العام في الموقع)
  create: async (applicationData: CreateJobApplicationDto): Promise<JobApplication> => {
    const { data } = await apiClient.post<JobApplication>(
      "/jobs/job-applications",
      applicationData
    );
    return data;
  },

  // تحديث طلب توظيف (للأدمن فقط)
  update: async (
    id: string,
    updates: UpdateJobApplicationDto
  ): Promise<JobApplication> => {
    const { data } = await apiClient.put<JobApplication>(
      `/jobs/job-applications/${id}`,
      updates
    );
    return data;
  },

  // حذف طلب توظيف
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/jobs/job-applications/${id}`);
  },

  // رفع ملف CV
  uploadCV: async (file: File): Promise<{ cvFileUrl: string }> => {
    const formData = new FormData();
    formData.append("cvFile", file);

    const { data } = await apiClient.post<{ cvFileUrl: string }>(
      "/jobs/job-applications",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  },
};
