// src/app/(dashboard)/dashboard/sponsorship/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  Trash2,
  Filter,
  Plus,
  Calendar,
  DollarSign,
  User,
  Target,
  CheckCircle,
  Clock,
  XCircle,
  Star,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { sponsorshipCasesApi } from "@/lib/api/sponsorship";
import { Button } from "@/components/ui/Button";
import type { SponsorshipCase } from "@/types/sponsorship";
import { getImageUrl } from "@/lib/utils/imageUrl";
import { formatPriceWithLabel } from "@/lib/utils/currencyFormatter";

export default function SponsorshipPage() {
  const [cases, setCases] = useState<SponsorshipCase[]>([]);
  const [filteredCases, setFilteredCases] = useState<SponsorshipCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [featuredFilter, setFeaturedFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadCases();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [cases, statusFilter, featuredFilter, searchQuery]);

  const loadCases = async () => {
    try {
      setIsLoading(true);
      const data = await sponsorshipCasesApi.getAll();
      setCases(data);
    } catch (error: any) {
      toast.error("فشل تحميل حالات الكفالة");
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...cases];

    // Status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    // Featured filter
    if (featuredFilter !== "ALL") {
      const isFeatured = featuredFilter === "FEATURED";
      filtered = filtered.filter((c) => c.isFeatured === isFeatured);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((c) =>
        c.patientName.toLowerCase().includes(query)
      );
    }

    setFilteredCases(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الحالة؟")) return;

    try {
      await sponsorshipCasesApi.delete(id);
      toast.success("تم حذف الحالة بنجاح");
      loadCases();
    } catch (error) {
      toast.error("فشل حذف الحالة");
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<
      string,
      { label: string; className: string; icon: any }
    > = {
      ONGOING: {
        label: "جارية",
        className: "bg-blue-100 text-blue-800",
        icon: Clock,
      },
      COMPLETED: {
        label: "مكتملة",
        className: "bg-green-100 text-green-800",
        icon: CheckCircle,
      },
      CANCELLED: {
        label: "ملغية",
        className: "bg-red-100 text-red-800",
        icon: XCircle,
      },
    };
    return badges[status] || badges.ONGOING;
  };

  const calculateProgress = (raised: number, target: number) => {
    return Math.min((raised / target) * 100, 100).toFixed(1);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">حالات الكفالة</h1>
          <p className="text-gray-600 mt-1">
            إدارة حالات كفالة المرضى ({filteredCases.length} من {cases.length})
          </p>
        </div>
        <Link href="/dashboard/sponsorship/new">
          <Button variant="primary">
            <Plus className="w-5 h-5 ml-2" />
            إضافة حالة جديدة
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h2 className="text-sm font-semibold text-gray-900">التصفية والبحث</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="بحث باسم المريض..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="ALL">جميع الحالات</option>
              <option value="ONGOING">جارية</option>
              <option value="COMPLETED">مكتملة</option>
              <option value="CANCELLED">ملغية</option>
            </select>
          </div>

          {/* Featured Filter */}
          <div>
            <select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="ALL">الكل</option>
              <option value="FEATURED">مميزة</option>
              <option value="NOT_FEATURED">غير مميزة</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cases Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">لا توجد حالات كفالة</p>
          </div>
        ) : (
          filteredCases.map((caseItem) => {
            const statusBadge = getStatusBadge(caseItem.status);
            const StatusIcon = statusBadge.icon;
            const progress = calculateProgress(
              caseItem.raisedAmount,
              caseItem.targetAmount
            );

            return (
              <div
                key={caseItem.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="relative h-48">
                  <Image
                    src={getImageUrl(caseItem.caseImage)}
                    alt={caseItem.patientName}
                    fill
                    className="object-cover"
                  />
                  {caseItem.isFeatured && (
                    <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      مميزة
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge.className}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {statusBadge.label}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {caseItem.patientName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    العمر: {caseItem.age} سنة
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {caseItem.caseDescription}
                  </p>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">التقدم</span>
                      <span className="font-semibold text-gray-900">
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-accent-500 to-accent-600 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Amount Info */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="bg-green-50 rounded-lg p-2">
                      <p className="text-gray-600 text-xs mb-1">تم جمعه</p>
                      <p className="font-bold text-green-700">
                        {formatPriceWithLabel(caseItem.raisedAmount)}
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-2">
                      <p className="text-gray-600 text-xs mb-1">المستهدف</p>
                      <p className="font-bold text-blue-700">
                        {formatPriceWithLabel(caseItem.targetAmount)}
                      </p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <Calendar className="w-4 h-4" />
                    {new Date(caseItem.startDate).toLocaleDateString("en-GB")} -{" "}
                    {new Date(caseItem.endDate).toLocaleDateString("en-GB")}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                    <Link
                      href={`/dashboard/sponsorship/${caseItem.id}`}
                      className="flex-1"
                    >
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">عرض</span>
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(caseItem.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm font-medium">حذف</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
