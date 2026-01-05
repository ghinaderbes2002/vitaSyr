// src/types/successStory.ts

export type StoryType = "MEDICAL" | "INSPIRATIONAL";
export type MilestoneType = "BEFORE" | "AFTER" | "OTHER";

export interface StoryMilestone {
  id: string;
  storyId: string;
  milestoneType: MilestoneType;
  title: string;
  description: string;
  date: string;
  imageUrl?: string; // اختياري
  orderIndex: number;
  createdAt: string;
}

export interface SuccessStory {
  id: string;
  storyType: StoryType; // جديد
  patientName: string;
  age?: number; // اختياري
  caseType?: string; // اختياري
  storyTitle: string;
  storyDescription: string;
  patientTestimonial: string;
  beforeImage?: string; // اختياري
  afterImage?: string; // اختياري
  videoUrl?: string;
  isFeatured: boolean;
  isActive: boolean;
  orderIndex: number;
  milestones?: StoryMilestone[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSuccessStoryData {
  storyType: StoryType; // مطلوب
  patientName: string;
  age?: number;
  caseType?: string;
  storyTitle: string;
  storyDescription: string;
  patientTestimonial?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  orderIndex?: number;
}

export interface UpdateSuccessStoryData {
  storyType?: StoryType;
  patientName?: string;
  age?: number;
  caseType?: string;
  storyTitle?: string;
  storyDescription?: string;
  patientTestimonial?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  orderIndex?: number;
}

export interface CreateMilestoneData {
  milestoneType: MilestoneType;
  title: string;
  description: string;
  date: string;
  orderIndex?: number;
}

export interface UpdateMilestoneData {
  milestoneType?: MilestoneType;
  title?: string;
  description?: string;
  date?: string;
  orderIndex?: number;
}
