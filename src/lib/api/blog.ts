// src/lib/api/blog.ts

import apiClient from "./client";
import type {
  BlogCategory,
  BlogTag,
  BlogPost,
  CreateBlogCategoryData,
  CreateBlogTagData,
  CreateBlogPostData,
} from "@/types/blog";

// =======================
// Blog Categories API
// =======================

export const blogCategoriesApi = {
  getAll: async (): Promise<BlogCategory[]> => {
    const { data } = await apiClient.get<BlogCategory[]>("blog/blog-categories");
    return data;
  },

  create: async (categoryData: CreateBlogCategoryData): Promise<BlogCategory> => {
    const { data } = await apiClient.post<BlogCategory>(
      "blog/blog-categories",
      categoryData
    );
    return data;
  },

  update: async (
    id: string,
    updates: Partial<CreateBlogCategoryData>
  ): Promise<BlogCategory> => {
    const { data } = await apiClient.put<BlogCategory>(
      `blog/blog-categories/${id}`,
      updates
    );
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`blog/blog-categories/${id}`);
  },
};

// =======================
// Blog Tags API
// =======================

export const blogTagsApi = {
  getAll: async (): Promise<BlogTag[]> => {
    const { data } = await apiClient.get<BlogTag[]>("blog/blog-tags");
    return data;
  },

  create: async (tagData: CreateBlogTagData): Promise<BlogTag> => {
    const { data } = await apiClient.post<BlogTag>("blog/blog-tags", tagData);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`blog/blog-tags/${id}`);
  },
};

// =======================
// Blog Posts API
// =======================

export const blogPostsApi = {
  getAll: async (): Promise<BlogPost[]> => {
    const { data } = await apiClient.get<BlogPost[]>("blog/blog-posts");
    return data;
  },

  getOne: async (id: string): Promise<BlogPost> => {
    const { data } = await apiClient.get<BlogPost>(`blog/blog-posts/${id}`);
    return data;
  },

  create: async (postData: CreateBlogPostData): Promise<BlogPost> => {
    const { data } = await apiClient.post<BlogPost>("blog/blog-posts", postData);
    return data;
  },

  update: async (
    id: string,
    updates: Partial<CreateBlogPostData>
  ): Promise<BlogPost> => {
    const { data } = await apiClient.put<BlogPost>(
      `blog/blog-posts/${id}`,
      updates
    );
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`blog/blog-posts/${id}`);
  },
};

// Export alias for backward compatibility
export const blogApi = blogPostsApi;
