// src/app/layout.tsx

import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-cairo",
});

const siteDescription =
  "Vitaxir شركة متخصصة في تجهيز وتطوير مراكز الأطراف الصناعية وإعادة التأهيل والعلاج الفيزيائي ومراكز صحة القدم، مع تدريب الكوادر وتوريد الأجهزة والأطراف.";

export const metadata: Metadata = {
  metadataBase: new URL("https://vitaxirpro.com"),
  title: {
    default: "VitaXir | تجهيز مراكز الأطراف الصناعية وإعادة التأهيل",
    template: "%s | VitaXir",
  },
  description: siteDescription,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "ar_AR",
    siteName: "VitaXir",
    title: "VitaXir | تجهيز مراكز الأطراف الصناعية وإعادة التأهيل",
    description: siteDescription,
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} font-sans antialiased`}>
        {children}
        <WhatsAppFloat />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              direction: "rtl",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
