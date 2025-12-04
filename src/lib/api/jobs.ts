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
      applicationData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  },

  // إنشاء طلب توظيف مع ملف CV
  createWithCV: async (
    applicationData: Omit<CreateJobApplicationDto, "cvFileUrl">,
    cvFile: File
  ): Promise<JobApplication> => {
    const formData = new FormData();

    // إضافة الملف
    formData.append("cvFile", cvFile);

    // إضافة باقي البيانات
    formData.append("fullName", applicationData.fullName);
    formData.append("email", applicationData.email);
    formData.append("phone", applicationData.phone);
    formData.append("specialization", applicationData.specialization);
    formData.append("yearsOfExperience", applicationData.yearsOfExperience.toString());
    formData.append("education", applicationData.education);

    if (applicationData.coverLetter) {
      formData.append("coverLetter", applicationData.coverLetter);
    }
    if (applicationData.linkedinUrl) {
      formData.append("linkedinUrl", applicationData.linkedinUrl);
    }

    const { data } = await apiClient.post<JobApplication>(
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
};
