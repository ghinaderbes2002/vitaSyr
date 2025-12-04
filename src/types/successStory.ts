// src/types/successStory.ts

export type MilestoneType = "BEFORE" | "AFTER" | "OTHER";

export interface StoryMilestone {
  id: string;
  storyId: string;
  milestoneType: MilestoneType;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  orderIndex: number;
  createdAt: string;
}

export interface SuccessStory {
  id: string;
  patientName: string;
  age: number;
  caseType: string;
  storyTitle: string;
  storyDescription: string;
  patientTestimonial: string;
  beforeImage: string;
  afterImage: string;
  videoUrl?: string;
  isFeatured: boolean;
  isActive: boolean;
  orderIndex: number;
  milestones?: StoryMilestone[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSuccessStoryData {
  patientName: string;
  age?: number;
  caseType: string;
  storyTitle: string;
  storyDescription: string;
  patientTestimonial?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  orderIndex?: number;
}

export interface UpdateSuccessStoryData {
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
