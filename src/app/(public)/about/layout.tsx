// src/app/(public)/about/layout.tsx

import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "من نحن",
  description:
    "تعرّف على Vitaxir: شركة متخصصة في تجهيز وتطوير مراكز الأطراف الصناعية وإعادة التأهيل والعلاج الفيزيائي ومراكز صحة القدم، تأسست في تركيا منذ أكثر من 11 عاماً.",
  path: "/about",
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
