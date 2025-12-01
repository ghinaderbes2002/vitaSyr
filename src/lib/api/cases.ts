// src/lib/api/cases.ts

import apiClient from "./client";
import type {
  Case,
  CreateCaseData,
  UpdateCaseData,
  AddCaseNoteData,
  CaseImage,
  CaseNote,
} from "@/types/case";

export const casesApi = {
  // Get all cases
  getAll: async (): Promise<Case[]> => {
    const { data } = await apiClient.get<Case[]>("/cases");
    return data;
  },

  // Get single case
  getOne: async (id: string): Promise<Case> => {
    const { data } = await apiClient.get<Case>(`/cases/${id}`);
    return data;
  },

  // Create case (public - no auth required)
  create: async (caseData: CreateCaseData): Promise<Case> => {
    const { data } = await apiClient.post<Case>("/cases", caseData);
    return data;
  },

  // Update case (admin only)
  update: async (id: string, updates: UpdateCaseData): Promise<Case> => {
    const { data } = await apiClient.put<Case>(`/cases/${id}`, updates);
    return data;
  },

  // Delete case (admin only)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/cases/${id}`);
  },

  // Add image to case
  addImage: async (
    id: string,
    imageFile: File,
    imageType: string
  ): Promise<CaseImage> => {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("imageType", imageType);

    const { data } = await apiClient.post<CaseImage>(
      `/cases/${id}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  },

  // Add note to case
  addNote: async (id: string, noteData: AddCaseNoteData): Promise<CaseNote> => {
    const { data } = await apiClient.post<CaseNote>(
      `/cases/${id}/notes`,
      noteData
    );
    return data;
  },
};
