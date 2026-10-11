// src/app/(dashboard)/dashboard/layout.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "لوحة التحكم",
    template: "%s | VitaXir Admin",
  },
  description: "لوحة تحكم إدارة محتوى موقع VitaXir",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
