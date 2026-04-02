// src/types/jobApplication.ts

export interface JobApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  yearsOfExperience: number;
  education: string;
  cvFileUrl: string;
  coverLetter?: string | null;
  linkedinUrl?: string | null;

  // المراجع
  ref1Name: string;
  ref1Company: string;
  ref1JobTitle: string;
  ref1Phone: string;
  ref2Name: string;
  ref2Company: string;
  ref2JobTitle: string;
  ref2Phone: string;

  status: JobApplicationStatus;
  reviewedById?: string | null;
  reviewedBy?: {
    id: string;
    name: string;
    email: string;
  } | null;
  reviewNotes?: string | null;
  rejectionNote?: string | null;
  rating?: number | null;
  currentlyEmployed?: boolean | null;
  availabilityToJoin?: "IMMEDIATE" | "WITHIN_ONE_WEEK" | "WITHIN_TWO_WEEKS" | "WITHIN_ONE_MONTH" | null;
  createdAt: string;
  updatedAt: string;
}

export type JobApplicationStatus =
  | "PENDING"
  | "INTERVIEW_READY"
  | "ACCEPTED"
  | "REJECTED"
  | "HIRED";

export interface CreateJobApplicationDto {
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  yearsOfExperience: number;
  education: string;
  coverLetter?: string;
  linkedinUrl?: string;
  ref1Name: string;
  ref1Company: string;
  ref1JobTitle: string;
  ref1Phone: string;
  ref2Name: string;
  ref2Company: string;
  ref2JobTitle: string;
  ref2Phone: string;
  currentlyEmployed?: boolean;
  availabilityToJoin?: "IMMEDIATE" | "WITHIN_ONE_WEEK" | "WITHIN_TWO_WEEKS" | "WITHIN_ONE_MONTH";
}

export interface UpdateJobApplicationDto {
  status?: JobApplicationStatus;
  reviewNotes?: string;
  rejectionNote?: string;
  rating?: number;
  reviewedById?: string;
}
