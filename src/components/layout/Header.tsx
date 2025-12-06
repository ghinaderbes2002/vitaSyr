// src/components/layout/Header.tsx

"use client";

import { Bell } from "lucide-react";

import { useAuthStore } from "@/store/authStore";

export default function Header() {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          مرحباً، {user?.full_name || "Admin"}
        </h2>

        <p className="text-sm text-gray-500">نتمنى لك يوم سعيد</p>
      </div>

      {/* <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />

          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div> */}
    </header>
  );
}

