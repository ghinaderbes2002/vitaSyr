// src/types/service.ts

export interface Service {
  id: string;
  slug: string;
  title: string;
  description?: string;
  serviceType: "PROSTHETICS" | "PHYSIOTHERAPY" | "FOOT_BALANCE" | "OTHER";
  metaTitle: string;
  metaDescription: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  features?: ServiceFeature[];
  benefits?: ServiceBenefit[];
  images?: ServiceImage[];
}

export interface ServiceFeature {
  id: string;
  serviceId: string;
  title: string;
  description: string;
  orderIndex: number;
  createdAt: string;
}

export interface ServiceBenefit {
  id: string;
  serviceId: string;
  benefitText: string;
  orderIndex: number;
  createdAt: string;
}

export interface ServiceImage {
  id: string;
  serviceId: string;
  imageUrl: string;
  altText?: string;
  orderIndex: number;
  createdAt: string;
}

export interface CreateServiceData {
  slug: string;
  title: string;
  serviceType: string;
  shortDescription?: string;
  fullDescription?: string;
  mainImage?: string;
  metaTitle: string;
  metaDescription: string;
  isActive?: boolean;
}
