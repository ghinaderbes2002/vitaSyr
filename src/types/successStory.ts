// src/types/successStory.ts

export interface StoryMilestone {
  id: string;
  storyId: string;
  title: string;
  description: string;
  date?: string;
  imageUrl?: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface SuccessStory {
  id: string;
  patientName: string;
  age?: number;
  caseType: string;
  storyTitle: string;
  storyDescription: string;
  patientTestimonial?: string;
  beforeImage?: string;
  afterImage?: string;
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
  title: string;
  description: string;
  date?: string;
  orderIndex?: number;
}

export interface UpdateMilestoneData {
  title?: string;
  description?: string;
  date?: string;
  orderIndex?: number;
}
