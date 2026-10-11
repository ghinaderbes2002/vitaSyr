// src/app/(public)/privacy/layout.tsx

import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "سياسة الخصوصية",
  description:
    "سياسة الخصوصية في Vitaxir: نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية.",
  path: "/privacy",
});

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
