// src/app/(dashboard)/dashboard/stats/page.tsx

"use client";

import { useState, useEffect } from "react";
import { Save, RotateCcw } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/Button";

interface SiteStats {
  happyPatients: number;
  yearsExperience: number;
  sponsorshipCases: number;
  successRate: number;
}

const DEFAULT_STATS: SiteStats = {
  happyPatients: 500,
  yearsExperience: 15,
  sponsorshipCases: 200,
  successRate: 98,
};

export default function StatsPage() {
  const [stats, setStats] = useState<SiteStats>(DEFAULT_STATS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    try {
      const savedStats = localStorage.getItem("siteStats");
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    try {
      localStorage.setItem("siteStats", JSON.stringify(stats));
      toast.success("تم حفظ الإحصائيات بنجاح");
    } catch (error) {
      toast.error("فشل حفظ الإحصائيات");
    }
  };

  const handleReset = () => {
    if (confirm("هل أنت متأكد من إعادة تعيين الإحصائيات للقيم الافتراضية؟")) {
      setStats(DEFAULT_STATS);
      localStorage.setItem("siteStats", JSON.stringify(DEFAULT_STATS));
      toast.success("تم إعادة تعيين الإحصائيات");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">إحصائيات الموقع</h1>
        <p className="text-gray-600 mt-1">
          تحكم في الأرقام المعروضة في الصفحة الرئيسية
        </p>
      </div>

      {/* Stats Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Happy Patients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عدد المتدربين
            </label>
            <div className="relative">
              <input
                type="number"
                value={stats.happyPatients}
                onChange={(e) =>
                  setStats({ ...stats, happyPatients: Number(e.target.value) })
                }
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg font-bold"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-normal">
                +
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              سيتم عرضها كـ: {stats.happyPatients}+
            </p>
          </div>

          {/* Years Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              سنوات الخبرة
            </label>
            <div className="relative">
              <input
                type="number"
                value={stats.yearsExperience}
                onChange={(e) =>
                  setStats({
                    ...stats,
                    yearsExperience: Number(e.target.value),
                  })
                }
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg font-bold"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-normal">
                +
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              سيتم عرضها كـ: {stats.yearsExperience}+
            </p>
          </div>

          {/* Sponsorship Cases */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الشركات{" "}
            </label>
            <div className="relative">
              <input
                type="number"
                value={stats.sponsorshipCases}
                onChange={(e) =>
                  setStats({
                    ...stats,
                    sponsorshipCases: Number(e.target.value),
                  })
                }
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg font-bold"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-normal">
                +
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              سيتم عرضها كـ: {stats.sponsorshipCases}+
            </p>
          </div>

          {/* Success Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              دول{" "}
            </label>
            <div className="relative">
              <input
                type="number"
                value={stats.successRate}
                onChange={(e) =>
                  setStats({ ...stats, successRate: Number(e.target.value) })
                }
                min="0"
                max="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg font-bold"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-normal">
                %
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              سيتم عرضها كـ: {stats.successRate}%
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
          <Button onClick={handleSave} variant="primary" className="flex-1">
            <Save className="w-5 h-5 ml-2" />
            حفظ التغييرات
          </Button>
          <Button onClick={handleReset} variant="secondary">
            <RotateCcw className="w-5 h-5 ml-2" />
            إعادة تعيين
          </Button>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">معاينة</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50 rounded-lg p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {stats.happyPatients}+
            </div>
            <div className="text-gray-600 font-medium text-sm">متدرب </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {stats.yearsExperience}+
            </div>
            <div className="text-gray-600 font-medium text-sm">سنة خبرة</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {stats.sponsorshipCases}+
            </div>
            <div className="text-gray-600 font-medium text-sm">الشركات </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {stats.successRate}%
            </div>
            <div className="text-gray-600 font-medium text-sm">دول </div>
          </div>
        </div>
      </div>
    </div>
  );
}
