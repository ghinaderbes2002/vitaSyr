// src/components/ui/NavigationLoader.tsx

"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export function NavigationLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const previousPathRef = useRef(pathname);

  useEffect(() => {
    setLoading(false);
    previousPathRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    const handleStart = (newPath: string) => {
      // Only show loading if navigating to a different page
      const currentPath = window.location.pathname;
      if (newPath !== currentPath && newPath !== previousPathRef.current) {
        setLoading(true);
      }
    };

    // Listen to route changes
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (...args) {
      const newPath = args[2]?.toString() || '';
      handleStart(newPath);
      originalPushState.apply(window.history, args);
    };

    window.history.replaceState = function (...args) {
      const newPath = args[2]?.toString() || '';
      handleStart(newPath);
      originalReplaceState.apply(window.history, args);
    };

    // Listen to popstate (back/forward)
    window.addEventListener("popstate", () => {
      handleStart(window.location.pathname);
    });

    // Listen to link clicks
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link && link.href) {
        const url = new URL(link.href);
        const currentPath = window.location.pathname;

        // Only show loading if navigating to a different page
        if (url.pathname !== currentPath) {
          handleStart(url.pathname);
        }
      }
    };

    document.addEventListener('click', handleLinkClick);

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener("popstate", () => {});
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  if (!loading) return null;

  return (
    <>
      {/* Top Loading Bar */}
      <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 animate-loading-bar shadow-lg" />

      {/* Overlay with Spinner */}
      <div className="fixed inset-0 z-[9998] bg-white/60 backdrop-blur-sm flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-700 font-semibold text-lg">جاري التحميل...</p>
        </div>
      </div>
    </>
  );
}
