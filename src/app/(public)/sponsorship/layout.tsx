// src/app/(public)/sponsorship/layout.tsx

import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "كفالة إنسان",
  description:
    "ساهم في تغيير حياة إنسان.. كن سبباً في إعادة الأمل لمن يحتاج طرفاً صناعياً أو علاجاً تأهيلياً عبر برنامج الكفالة من Vitaxir.",
  path: "/sponsorship",
});

export default function SponsorshipLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
