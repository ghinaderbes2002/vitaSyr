// src/lib/utils/imageUrl.ts

/**
 * Convert relative image URL to absolute URL
 * @param imageUrl - The image URL from the API (e.g., "/uploads/image.jpg")
 * @returns Full URL (e.g., "http://localhost:3000/uploads/image.jpg")
 */
export function getImageUrl(imageUrl: string | undefined | null): string {
  if (!imageUrl) return "/placeholder.jpg";

  // If already absolute URL, return as is
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // Otherwise, prepend API base URL
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  return `${baseUrl}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
}
