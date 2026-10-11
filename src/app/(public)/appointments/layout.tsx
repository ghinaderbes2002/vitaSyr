// src/app/(public)/appointments/layout.tsx

import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "احجز موعدك",
  description:
    "احجز موعدك مع Vitaxir: املأ النموذج وسيتواصل معك فريقنا لتأكيد الموعد.",
  path: "/appointments",
});

export default function AppointmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
