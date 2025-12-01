// src/lib/api/products.ts

import apiClient from "./client";
import type {
  Product,
  ProductCategory,
  CreateProductData,
  CreateCategoryData,
} from "@/types/product";

// =======================
// Categories API
// =======================

export const categoriesApi = {
  // Get all categories
  getAll: async (): Promise<ProductCategory[]> => {
    const { data } = await apiClient.get<ProductCategory[]>(
      "products/product-categories"
    );
    return data;
  },

  // Get one category
  getOne: async (id: string): Promise<ProductCategory> => {
    const { data } = await apiClient.get<ProductCategory>(
      `products/product-categories/${id}`
    );
    return data;
  },

  // Create category
  create: async (
    categoryData: CreateCategoryData
  ): Promise<ProductCategory> => {
    const { data } = await apiClient.post<ProductCategory>(
      "products/product-categories",
      categoryData
    );
    return data;
  },

  // Update category
  update: async (
    id: string,
    updates: Partial<CreateCategoryData>
  ): Promise<ProductCategory> => {
    const { data } = await apiClient.put<ProductCategory>(
      `products/product-categories/${id}`,
      updates
    );
    return data;
  },

  // Delete category
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`products/product-categories/${id}`);
  },
};

// =======================
// Products API
// =======================

export const productsApi = {
  // Get all products
  getAll: async (): Promise<Product[]> => {
    const { data } = await apiClient.get<Product[]>("/products/products");
    return data;
  },

  // Get one product
  getOne: async (id: string): Promise<Product> => {
    const { data } = await apiClient.get<Product>(`products/products/${id}`);
    return data;
  },

  // Create product
  create: async (productData: CreateProductData): Promise<Product> => {
    const { data } = await apiClient.post<Product>(
      "products/products",
      productData
    );
    return data;
  },

  // Update product
  update: async (
    id: string,
    updates: Partial<CreateProductData>
  ): Promise<Product> => {
    const { data } = await apiClient.put<Product>(
      `products/products/${id}`,
      updates
    );
    return data;
  },

  // Delete product
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`products/products/${id}`);
  },

  // =======================
  // Features
  // =======================

  addFeature: async (
    productId: string,
    feature: { featureText: string; orderIndex: number }
  ) => {
    const { data } = await apiClient.post(
      `products/products/${productId}/features`,
      feature
    );
    return data;
  },

  updateFeature: async (
    productId: string,
    featureId: string,
    updates: { featureText?: string; orderIndex?: number }
  ) => {
    const { data } = await apiClient.put(
      `products/products/${productId}/features/${featureId}`,
      updates
    );
    return data;
  },

  deleteFeature: async (productId: string, featureId: string) => {
    await apiClient.delete(
      `products/products/${productId}/features/${featureId}`
    );
  },

  // =======================
  // Images
  // =======================

  addImage: async (productId: string, formData: FormData) => {
    const { data } = await apiClient.post(
      `products/products/${productId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  },

  deleteImage: async (productId: string, imageId: string) => {
    await apiClient.delete(`products/products/${productId}/images/${imageId}`);
  },
};
