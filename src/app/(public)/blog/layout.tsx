// src/app/(public)/blog/layout.tsx

import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "المدونة",
  description:
    "آخر الأخبار والمقالات الطبية والصحية من Vitaxir حول الأطراف الصناعية وإعادة التأهيل والعلاج الفيزيائي.",
  path: "/blog",
});

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
