// src/lib/seo/serverData.ts
// Server-side data fetching for metadata and sitemap (no auth, no axios interceptors)

import type { Product } from "@/types/product";
import type { BlogPost } from "@/types/blog";
import type { Service } from "@/types/service";
import type { SuccessStory } from "@/types/successStory";
import type { SponsorshipCase } from "@/types/sponsorship";

const REVALIDATE_SECONDS = 3600;

// Returns null on any failure so SEO data never breaks a page or the build
async function fetchFromApi<T>(path: string): Promise<T | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) return null;

  try {
    const response = await fetch(`${baseUrl.replace(/\/+$/, "")}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function fetchList<T>(path: string): Promise<T[]> {
  const data = await fetchFromApi<T[]>(path);
  return Array.isArray(data) ? data : [];
}

export async function getPublicProducts(): Promise<Product[]> {
  const products = await fetchList<Product>("/products/products");
  return products.filter((p) => p.isActive);
}

export async function getPublicServices(): Promise<Service[]> {
  const services = await fetchList<Service>("/services");
  return services.filter((s) => s.isActive);
}

export async function getPublicBlogPosts(): Promise<BlogPost[]> {
  const posts = await fetchList<BlogPost>("/blog/blog-posts");
  return posts.filter((p) => p.status === "PUBLISHED");
}

export async function getPublicSuccessStories(): Promise<SuccessStory[]> {
  const stories = await fetchList<SuccessStory>("/successStories/success-stories");
  return stories.filter((s) => s.isActive);
}

export async function getPublicSponsorshipCases(): Promise<SponsorshipCase[]> {
  const cases = await fetchList<SponsorshipCase>("/sponsorship/sponsorship-cases");
  return cases.filter((c) => c.status === "ONGOING");
}
