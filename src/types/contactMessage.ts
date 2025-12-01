// src/types/contactMessage.ts

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: MessageStatus;
  repliedById?: string | null;
  repliedBy?: {
    id: string;
    name: string;
    email: string;
  } | null;
  replyMessage?: string | null;
  repliedAt?: string | null;
  createdAt: string;
}

export type MessageStatus = "NEW" | "REPLIED" | "CLOSED";

export interface CreateContactMessageDto {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status?: MessageStatus;
}

export interface ReplyContactMessageDto {
  replyMessage: string;
  repliedById: string;
}

export interface UpdateContactMessageDto {
  status?: MessageStatus;
}
