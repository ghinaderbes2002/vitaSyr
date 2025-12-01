// src/lib/api/contact.ts

import apiClient from "./client";
import type {
  ContactMessage,
  CreateContactMessageDto,
  ReplyContactMessageDto,
  UpdateContactMessageDto,
} from "@/types/contactMessage";

export const contactApi = {
  // جلب جميع رسائل التواصل
  getAll: async (): Promise<ContactMessage[]> => {
    const { data } = await apiClient.get<ContactMessage[]>("/contact");
    return data;
  },

  // إنشاء رسالة جديدة (للزائر)
  create: async (
    messageData: CreateContactMessageDto
  ): Promise<ContactMessage> => {
    const { data } = await apiClient.post<ContactMessage>(
      "/contact",
      messageData
    );
    return data;
  },

  // الرد على رسالة
  reply: async (
    id: string,
    replyData: ReplyContactMessageDto
  ): Promise<ContactMessage> => {
    const { data } = await apiClient.put<ContactMessage>(
      `/contact/reply/${id}`,
      replyData
    );
    return data;
  },

  // إغلاق رسالة
  close: async (id: string): Promise<ContactMessage> => {
    const { data } = await apiClient.put<ContactMessage>(
      `/contact/close/${id}`,
      {}
    );
    return data;
  },
};
