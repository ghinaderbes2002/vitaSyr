// src/app/(public)/services/layout.tsx

import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "خدماتنا",
  description:
    "خدمات Vitaxir: تجهيز وتأسيس المراكز، تدريب وتأهيل الكوادر، توريد الأجهزة والأطراف الصناعية، والاستشارات الفنية والإدارية والدعم الفني.",
  path: "/services",
});

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
