// src/app/(public)/contact/layout.tsx

import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "اتصل بنا",
  description:
    "تواصل مع Vitaxir لمناقشة مشروعك أو استفسارك حول تجهيز المراكز والأطراف الصناعية، وسنرد عليك في أقرب وقت.",
  path: "/contact",
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
