// src/app/sitemap.ts

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/metadata";
import {
  getPublicBlogPosts,
  getPublicProducts,
  getPublicServices,
  getPublicSponsorshipCases,
  getPublicSuccessStories,
} from "@/lib/seo/serverData";

// Regenerate hourly so new products and posts appear without a redeploy
export const revalidate = 3600;

const staticRoutes = [
  "",
  "/about",
  "/services",
  "/products",
  "/blog",
  "/success-stories",
  "/partnerships",
  "/sponsorship",
  "/appointments",
  "/contact",
  "/join-us",
  "/privacy",
  "/terms",
];

function dynamicEntries(
  basePath: string,
  items: { key: string; updatedAt?: string }[]
): MetadataRoute.Sitemap {
  return items
    .filter((item) => item.key)
    .map((item) => ({
      url: `${SITE_URL}${basePath}/${encodeURIComponent(item.key)}`,
      lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, services, posts, stories, cases] = await Promise.all([
    getPublicProducts(),
    getPublicServices(),
    getPublicBlogPosts(),
    getPublicSuccessStories(),
    getPublicSponsorshipCases(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));

  return [
    ...staticEntries,
    ...dynamicEntries(
      "/products",
      products.map((p) => ({ key: p.slug, updatedAt: p.updatedAt }))
    ),
    ...dynamicEntries(
      "/services",
      services.map((s) => ({ key: s.slug, updatedAt: s.updatedAt }))
    ),
    ...dynamicEntries(
      "/blog",
      posts.map((p) => ({ key: p.slug, updatedAt: p.updatedAt }))
    ),
    ...dynamicEntries(
      "/success-stories",
      stories.map((s) => ({ key: s.id, updatedAt: s.updatedAt }))
    ),
    ...dynamicEntries(
      "/sponsorship",
      cases.map((c) => ({ key: c.id, updatedAt: c.updatedAt }))
    ),
  ];
}
