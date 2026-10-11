// src/app/(public)/sponsorship/[id]/layout.tsx

import type { Metadata } from "next";
import { buildMetadata, toDescription } from "@/lib/seo/metadata";
import { getPublicSponsorshipCases } from "@/lib/seo/serverData";
import { getImageUrl } from "@/lib/utils/imageUrl";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const path = `/sponsorship/${params.id}`;
  const cases = await getPublicSponsorshipCases();
  const caseData = cases.find((c) => c.id === params.id);

  if (!caseData) {
    return buildMetadata({ title: "كفالة إنسان", path });
  }

  return buildMetadata({
    title: `كفالة ${caseData.patientName}`,
    description: toDescription(caseData.caseDescription),
    path,
    image: caseData.caseImage ? getImageUrl(caseData.caseImage) : undefined,
  });
}

export default function SponsorshipCaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
