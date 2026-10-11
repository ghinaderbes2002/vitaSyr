// src/app/(public)/products/[slug]/layout.tsx

import type { Metadata } from "next";
import { buildMetadata, decodeParam, toDescription } from "@/lib/seo/metadata";
import { getPublicProducts } from "@/lib/seo/serverData";
import { getImageUrl } from "@/lib/utils/imageUrl";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const path = `/products/${params.slug}`;
  const slug = decodeParam(params.slug);
  const products = await getPublicProducts();
  const product = products.find(
    (p) => p.slug === slug || p.slug === params.slug
  );

  if (!product) {
    return buildMetadata({ title: "منتجاتنا", path });
  }

  const primaryImage =
    product.images?.find((img) => img.isPrimary) || product.images?.[0];

  return buildMetadata({
    title: product.metaTitle || product.name,
    description: toDescription(product.metaDescription || product.description),
    path,
    image: primaryImage ? getImageUrl(primaryImage.imageUrl) : undefined,
  });
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
