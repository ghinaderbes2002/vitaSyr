// src/app/(dashboard)/dashboard/page.tsx

"use client";

import { useEffect, useState } from "react";
import { statisticsApi, type DashboardStatistics } from "@/lib/api/statistics";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  Users,
  Briefcase,
  Package,
  MessageCircle,
  Calendar,
  FileText,
  Handshake,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setIsLoading(true);
      const data = await statisticsApi.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Error loading statistics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <LoadingSpinner size="lg" className="text-primary-500 mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل الإحصائيات...</p>
        </div>
      </div>
    );
  }

  const statisticsCards = [
    {
      title: "إجمالي الحالات",
      value: stats?.totalCases || 0,
      icon: Users,
      bgColor: "bg-primary-100",
      iconColor: "text-primary-600",
      subtitle: `${stats?.pendingCases || 0} قيد الانتظار`,
    },
    {
      title: "الخدمات",
      value: stats?.totalServices || 0,
      icon: Briefcase,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "المنتجات",
      value: stats?.totalProducts || 0,
      icon: Package,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "الرسائل",
      value: stats?.totalMessages || 0,
      icon: MessageCircle,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "المواعيد",
      value: stats?.totalAppointments || 0,
      icon: Calendar,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
      subtitle: `${stats?.pendingAppointments || 0} قيد الانتظار`,
    },
    {
      title: "طلبات التوظيف",
      value: stats?.totalJobApplications || 0,
      icon: FileText,
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      title: "استفسارات الشراكة",
      value: stats?.totalPartnershipInquiries || 0,
      icon: Handshake,
      bgColor: "bg-pink-100",
      iconColor: "text-pink-600",
    },
    {
      title: "قصص النجاح",
      value: stats?.totalSuccessStories || 0,
      icon: TrendingUp,
      bgColor: "bg-teal-100",
      iconColor: "text-teal-600",
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
        <button
          onClick={loadStatistics}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
        >
          تحديث الإحصائيات
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statisticsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <p className="text-sm text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                  {card.subtitle && (
                    <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
                  )}
                </div>
                <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">مرحباً بك في لوحة التحكم</h2>
        <p className="text-gray-600">
          يمكنك من هنا إدارة جميع محتويات الموقع بسهولة. استخدم القائمة الجانبية للتنقل بين الأقسام المختلفة.
        </p>
      </div>
    </div>
  );
}
