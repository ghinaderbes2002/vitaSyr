// src/components/ui/NavigationLoader.tsx

"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { LoadingSpinner } from "./LoadingSpinner";

export function NavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Navigation completed
    setIsNavigating(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    // Listen for navigation start
    const handleStart = () => setIsNavigating(true);
    const handleComplete = () => setIsNavigating(false);

    // Add event listeners for link clicks
    const links = document.querySelectorAll('a[href^="/"]');
    links.forEach((link) => {
      link.addEventListener("click", handleStart);
    });

    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", handleStart);
      });
    };
  }, [pathname]);

  if (!isNavigating) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999]">
      {/* Progress bar */}
      <div className="h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 animate-pulse" />

      {/* Optional: Full screen overlay with spinner */}
      <div className="fixed inset-0 bg-black/10 backdrop-blur-[2px] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-6 shadow-2xl flex items-center gap-3">
          <LoadingSpinner size="md" className="text-primary-500" />
          <span className="text-gray-700 font-semibold">جاري التحميل...</span>
        </div>
      </div>
    </div>
  );
}
