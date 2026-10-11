// src/app/(public)/terms/layout.tsx

import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "الشروط والأحكام",
  description:
    "الشروط والأحكام الخاصة باستخدام موقع وخدمات Vitaxir. يرجى قراءتها بعناية قبل استخدام خدماتنا.",
  path: "/terms",
});

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
