// src/app/(public)/join-us/layout.tsx

import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "انضم إلينا",
  description:
    "كن جزءًا من فريق Vitaxir وشارك في تطوير مستقبل الأطراف الصناعية والعلاج الفيزيائي. قدّم طلب التوظيف الآن.",
  path: "/join-us",
});

export default function JoinUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
