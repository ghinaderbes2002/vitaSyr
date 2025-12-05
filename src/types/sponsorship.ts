// src/types/sponsorship.ts

export type SponsorshipStatus = "ONGOING" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface SponsorshipCase {
  id: string;
  patientName: string;
  age: number;
  caseDescription: string;
  estimatedCost: number;
  raisedAmount: number;
  targetAmount: number;
  caseImage: string;
  videoUrl: string | null;
  status: SponsorshipStatus;
  startDate: string;
  endDate: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  donations?: SponsorshipDonation[];
}

export interface SponsorshipDonation {
  id: string;
  caseId: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  amount: number;
  paymentMethod: string;
  isAnonymous: boolean;
  message: string | null;
  paymentStatus: PaymentStatus;
  paymentReference: string | null;
  createdAt: string;
  case?: SponsorshipCase;
}

export interface CreateSponsorshipCaseDTO {
  patientName: string;
  age: number;
  caseDescription: string;
  estimatedCost: number;
  targetAmount: number;
  caseImage?: File;
  videoUrl?: File;
  status: SponsorshipStatus;
  startDate: string;
  endDate: string;
  isFeatured?: boolean;
}

export interface UpdateSponsorshipCaseDTO {
  patientName?: string;
  age?: number;
  caseDescription?: string;
  estimatedCost?: number;
  targetAmount?: number;
  caseImage?: File | string;
  videoUrl?: File | string | null;
  status?: SponsorshipStatus;
  startDate?: string;
  endDate?: string;
  isFeatured?: boolean;
}

export interface CreateDonationDTO {
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  amount: number;
  paymentMethod: string;
  isAnonymous?: boolean;
  message?: string;
  paymentStatus?: PaymentStatus;
  paymentReference?: string;
}
