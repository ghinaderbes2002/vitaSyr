// src/lib/seo/metadata.ts

import type { Metadata } from "next";

export const SITE_URL = "https://vitaxirpro.com";
export const SITE_NAME = "VitaXir";

interface PageMetadataOptions {
  title: string;
  description?: string;
  path: string;
  image?: string;
}

// Strip HTML tags and trim to a length suitable for meta description
export function toDescription(text?: string | null, maxLength = 160): string | undefined {
  if (!text) return undefined;
  const clean = text
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!clean) return undefined;
  return clean.length > maxLength ? `${clean.slice(0, maxLength - 1).trim()}…` : clean;
}

// Dynamic route params may arrive URL-encoded (Arabic slugs)
export function decodeParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function buildMetadata({
  title,
  description,
  path,
  image,
}: PageMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      locale: "ar_AR",
      siteName: SITE_NAME,
      url: path,
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [image || "/logo.png"],
    },
  };
}
