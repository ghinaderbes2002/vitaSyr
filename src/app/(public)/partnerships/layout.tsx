// src/app/(public)/partnerships/layout.tsx

import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "شراكات وفرص استثمارية",
  description:
    "كن شريكاً لـ Vitaxir: فرص شراكة واستثمار في تأسيس وتجهيز مراكز الأطراف الصناعية وإعادة التأهيل والعلاج الفيزيائي.",
  path: "/partnerships",
});

export default function PartnershipsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
