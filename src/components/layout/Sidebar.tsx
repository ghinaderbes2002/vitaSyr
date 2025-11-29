// src/components/layout/Sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  Briefcase,
  Package,
  Heart,
  FileText,
  Handshake,
  Users,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";

const menuItems = [
  {
    title: "لوحة التحكم",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "الحالات",
    href: "/dashboard/cases",
    icon: Users,
  },
  {
    title: "الخدمات",
    href: "/dashboard/services",
    icon: Briefcase,
  },
  {
    title: "المنتجات",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    title: "قصص النجاح",
    href: "/dashboard/success-stories",
    icon: Heart,
  },
  {
    title: "المدونة",
    href: "/dashboard/blog",
    icon: FileText,
  },
  {
    title: "الشراكات",
    href: "/dashboard/partnerships",
    icon: Handshake,
  },
  {
    title: "التوظيف",
    href: "/dashboard/jobs",
    icon: Users,
  },
  {
    title: "الرسائل",
    href: "/dashboard/messages",
    icon: MessageSquare,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuthStore();

  return (
    <aside className="fixed right-0 top-0 z-40 h-screen w-64 bg-white border-l border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-gray-200 px-6">
        <Image
          src="/images/logo.svg"
          alt="VitaXir"
          width={140}
          height={45}
          className="h-12 w-auto"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary-50 text-primary-900 shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 text-primary-900 font-bold">
            {user?.full_name?.charAt(0) || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.full_name || "Admin"}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}



