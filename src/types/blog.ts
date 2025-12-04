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

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
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
  tags?: BlogTag[];
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

export interface CreateBlogTagData {
  name: string;
  slug: string;
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
  tags?: string[]; // array of tag IDs
}
