// src/lib/api/successStories.ts

import apiClient from "./client";
import type {
  SuccessStory,
  CreateSuccessStoryData,
  UpdateSuccessStoryData,
  StoryMilestone,
  CreateMilestoneData,
  UpdateMilestoneData,
} from "@/types/successStory";

export const successStoriesApi = {
  // Get all success stories
  getAll: async (): Promise<SuccessStory[]> => {
    const { data } = await apiClient.get<SuccessStory[]>(
      "/successStories/success-stories"
    );
    return data;
  },

  // Get single success story
  getOne: async (id: string): Promise<SuccessStory> => {
    const { data } = await apiClient.get<SuccessStory>(
      `/successStories/success-stories/${id}`
    );
    return data;
  },

  // Create success story
  create: async (storyData: FormData): Promise<SuccessStory> => {
    const { data } = await apiClient.post<SuccessStory>(
      "/successStories/success-stories",
      storyData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  },

  // Update success story
  update: async (id: string, updates: FormData): Promise<SuccessStory> => {
    const { data } = await apiClient.put<SuccessStory>(
      `/successStories/success-stories/${id}`,
      updates,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  },

  // Delete success story
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/successStories/success-stories/${id}`);
  },

  // Upload before image
  uploadBeforeImage: async (id: string, imageFile: File): Promise<SuccessStory> => {
    const formData = new FormData();
    formData.append("beforeImage", imageFile);

    const { data } = await apiClient.put<SuccessStory>(
      `/successStories/success-stories/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  },

  // Upload after image
  uploadAfterImage: async (id: string, imageFile: File): Promise<SuccessStory> => {
    const formData = new FormData();
    formData.append("afterImage", imageFile);

    const { data } = await apiClient.put<SuccessStory>(
      `/successStories/success-stories/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  },

  // Upload video
  uploadVideo: async (id: string, videoFile: File): Promise<SuccessStory> => {
    const formData = new FormData();
    formData.append("videoUrl", videoFile);

    const { data } = await apiClient.put<SuccessStory>(
      `/successStories/success-stories/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  },

  // Milestones
  milestones: {
    // Create milestone
    create: async (storyId: string, milestoneData: FormData): Promise<StoryMilestone> => {
      const { data } = await apiClient.post<StoryMilestone>(
        `/successStories/success-stories/${storyId}/milestones`,
        milestoneData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    },

    // Update milestone
    update: async (
      storyId: string,
      milestoneId: string,
      updates: FormData
    ): Promise<StoryMilestone> => {
      const { data } = await apiClient.put<StoryMilestone>(
        `/successStories/success-stories/${storyId}/milestones/${milestoneId}`,
        updates,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    },

    // Delete milestone
    delete: async (storyId: string, milestoneId: string): Promise<void> => {
      await apiClient.delete(
        `/successStories/success-stories/${storyId}/milestones/${milestoneId}`
      );
    },
  },
};
