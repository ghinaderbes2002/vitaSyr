// src/types/product.ts

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentCategoryId?: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  subCategories?: ProductCategory[];
  parentCategory?: ProductCategory;
  products?: Product[];
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  productType: string;
  description?: string;
  specifications?: string;
  price?: number;
  isPriceVisible: boolean;
  isFeatured?: boolean;
  metaTitle: string;
  metaDescription: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: ProductCategory;
  categoryName?: string;
  images?: ProductImage[];
  features?: ProductFeature[];
  videos?: ProductVideo[];
}

export interface ProductFeature {
  id: string;
  productId: string;
  featureText: string;
  orderIndex: number;
  createdAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  altText?: string;
  orderIndex: number;
  isPrimary: boolean;
  createdAt: string;
}

export interface ProductVideo {
  id: string;
  productId: string;
  videoUrl: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
  parentCategoryId?: string;
  orderIndex?: number;
  isActive?: boolean;
}

export interface CreateProductData {
  categoryId: string;
  name: string;
  slug: string;
  productType: string;
  description?: string;
  specifications?: string;
  price?: number;
  isPriceVisible?: boolean;
  metaTitle: string;
  metaDescription: string;
  isActive?: boolean;
}
