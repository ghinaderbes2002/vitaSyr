// src/app/(public)/blog/[slug]/layout.tsx

import type { Metadata } from "next";
import { buildMetadata, decodeParam, toDescription } from "@/lib/seo/metadata";
import { getPublicBlogPosts } from "@/lib/seo/serverData";
import { getImageUrl } from "@/lib/utils/imageUrl";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const path = `/blog/${params.slug}`;
  const slug = decodeParam(params.slug);
  const posts = await getPublicBlogPosts();
  const post = posts.find((p) => p.slug === slug || p.slug === params.slug);

  if (!post) {
    return buildMetadata({ title: "المدونة", path });
  }

  return buildMetadata({
    title: post.metaTitle || post.title,
    description: toDescription(
      post.metaDescription || post.excerpt || post.content
    ),
    path,
    image: post.featuredImage ? getImageUrl(post.featuredImage) : undefined,
  });
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
