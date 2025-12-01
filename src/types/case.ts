// src/types/case.ts

export interface CaseImage {
  id: string;
  caseId: string;
  imageUrl: string;
  imageType: string;
  createdAt: string;
}

export interface CaseNote {
  id: string;
  caseId: string;
  userId: string;
  user?: {
    id: string;
    full_name: string;
    email: string;
  };
  noteText: string;
  noteType: string;
  createdAt: string;
}

export interface Case {
  id: string;
  fullName: string;
  age: number;
  gender: "MALE" | "FEMALE";
  phone: string;
  email?: string;
  address: string;
  amputationType: string;
  amputationLevel: string;
  amputationDate: string;
  currentCondition: string;
  previousProsthetics: boolean;
  additionalNotes?: string;
  status: "NEW" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  assignedToId?: string;
  assignedTo?: {
    id: string;
    full_name: string;
    email: string;
  };
  images?: CaseImage[];
  notes?: CaseNote[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCaseData {
  fullName: string;
  age: number;
  gender: "MALE" | "FEMALE";
  phone: string;
  email?: string;
  address: string;
  amputationType: string;
  amputationLevel: string;
  amputationDate: string;
  currentCondition: string;
  previousProsthetics: boolean;
  additionalNotes?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH";
}

export interface UpdateCaseData {
  fullName?: string;
  age?: number;
  gender?: "MALE" | "FEMALE";
  phone?: string;
  email?: string;
  address?: string;
  amputationType?: string;
  amputationLevel?: string;
  amputationDate?: string;
  currentCondition?: string;
  previousProsthetics?: boolean;
  additionalNotes?: string;
  status?: "NEW" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "COMPLETED";
  priority?: "LOW" | "MEDIUM" | "HIGH";
  assignedToId?: string;
}

export interface AddCaseNoteData {
  userId: string;
  noteText: string;
  noteType: string;
}
