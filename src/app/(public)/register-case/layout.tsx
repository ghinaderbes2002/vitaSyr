// src/app/(public)/register-case/layout.tsx

import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "تسجيل حالة",
  description:
    "سجّل حالتك لدى Vitaxir وسيتواصل معك فريقنا المختص لدراسة الحالة وتقديم الحل المناسب.",
  path: "/register-case",
});

export default function RegisterCaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
