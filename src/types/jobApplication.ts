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
  status: JobApplicationStatus;
  reviewedById?: string | null;
  reviewedBy?: {
    id: string;
    name: string;
    email: string;
  } | null;
  reviewNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type JobApplicationStatus = "PENDING" | "REVIEWED" | "ACCEPTED" | "REJECTED";

export interface CreateJobApplicationDto {
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  yearsOfExperience: number;
  education: string;
  cvFileUrl: string;
  coverLetter?: string;
  linkedinUrl?: string;
  status?: JobApplicationStatus;
}

export interface UpdateJobApplicationDto {
  status?: JobApplicationStatus;
  reviewNotes?: string;
  reviewedById?: string;
}
