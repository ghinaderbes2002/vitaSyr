// src/app/(public)/success-stories/layout.tsx

import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "قصص نجاح",
  description:
    "قصص نجاح حقيقية من Vitaxir: حكايات أناس بدؤوا رحلتهم بالألم والبحث عن حل، واستعادوا حركتهم بالأطراف الصناعية وإعادة التأهيل.",
  path: "/success-stories",
});

export default function SuccessStoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
