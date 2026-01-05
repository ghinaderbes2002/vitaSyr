// src/types/blog.ts

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  categoryId: string;
  category?: BlogCategory;
  categoryName?: string;
  authorId: string;
  author?: {
    id: string;
    full_name: string;
    email: string;
  };
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt?: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogCategoryData {
  name: string;
  slug: string;
  description?: string;
  orderIndex?: number;
  isActive?: boolean;
}

export interface CreateBlogPostData {
  categoryId: string;
  authorId: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt?: string;
  isFeatured?: boolean;
}
