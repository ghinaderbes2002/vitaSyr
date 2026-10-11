// src/app/(public)/services/[slug]/layout.tsx

import type { Metadata } from "next";
import { buildMetadata, decodeParam, toDescription } from "@/lib/seo/metadata";
import { getPublicServices } from "@/lib/seo/serverData";
import { getImageUrl } from "@/lib/utils/imageUrl";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const path = `/services/${params.slug}`;
  const slug = decodeParam(params.slug);
  const services = await getPublicServices();
  const service = services.find(
    (s) => s.slug === slug || s.slug === params.slug
  );

  if (!service) {
    return buildMetadata({ title: "خدماتنا", path });
  }

  const image = service.images?.[0];

  return buildMetadata({
    title: service.metaTitle || service.title,
    description: toDescription(service.metaDescription || service.description),
    path,
    image: image ? getImageUrl(image.imageUrl) : undefined,
  });
}

export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
