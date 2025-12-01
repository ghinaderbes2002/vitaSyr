// src/types/partnership.ts

export interface PartnershipInquiry {
  id: string;
  organizationName: string;
  contactPerson: string;
  email: string;
  phone: string;
  partnershipType: PartnershipType;
  country: string;
  inquiryDetails: string;
  status: InquiryStatus;
  assignedToId?: string | null;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  } | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type PartnershipType = "MEDICAL" | "INVESTMENT" | "OTHER";

export type InquiryStatus = "NEW" | "IN_PROGRESS";

export interface CreatePartnershipInquiryDto {
  organizationName: string;
  contactPerson: string;
  email: string;
  phone: string;
  partnershipType: PartnershipType;
  country: string;
  inquiryDetails: string;
  status?: InquiryStatus;
}

export interface UpdatePartnershipInquiryDto {
  status?: InquiryStatus;
  assignedToId?: string | null;
  notes?: string;
}
