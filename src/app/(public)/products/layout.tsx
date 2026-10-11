// src/app/(public)/products/layout.tsx

import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "منتجاتنا",
  description:
    "تصفح مجموعة Vitaxir المتكاملة من الأطراف الصناعية والأجهزة الطبية وتجهيزات مراكز إعادة التأهيل والعلاج الفيزيائي.",
  path: "/products",
});

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
