// src/app/(public)/cases/layout.tsx

import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "سجل حالتك",
  description:
    "سجّل حالتك لدى Vitaxir وسيتواصل معك فريقنا المختص لدراسة الحالة وتقديم الحل المناسب.",
  path: "/cases",
});

export default function CasesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
