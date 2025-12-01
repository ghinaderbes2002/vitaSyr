// src/app/(dashboard)/dashboard/cases/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Eye,
  Trash2,
  Filter,
  User,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { casesApi } from "@/lib/api/cases";
import { Button } from "@/components/ui/Button";
import type { Case } from "@/types/case";

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [filteredCases, setFilteredCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadCases();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [cases, statusFilter, priorityFilter, searchQuery]);

  const loadCases = async () => {
    try {
      setIsLoading(true);
      const data = await casesApi.getAll();
      setCases(data);
    } catch (error: any) {
      toast.error("فشل تحميل الحالات");
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

    // Priority filter
    if (priorityFilter !== "ALL") {
      filtered = filtered.filter((c) => c.priority === priorityFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.fullName.toLowerCase().includes(query) ||
          c.phone.includes(query) ||
          c.email?.toLowerCase().includes(query)
      );
    }

    setFilteredCases(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الحالة؟")) return;

    try {
      await casesApi.delete(id);
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
      NEW: {
        label: "جديدة",
        className: "bg-blue-100 text-blue-800",
        icon: AlertCircle,
      },
      UNDER_REVIEW: {
        label: "قيد المراجعة",
        className: "bg-yellow-100 text-yellow-800",
        icon: Clock,
      },
      APPROVED: {
        label: "معتمدة",
        className: "bg-green-100 text-green-800",
        icon: CheckCircle,
      },
      REJECTED: {
        label: "مرفوضة",
        className: "bg-red-100 text-red-800",
        icon: XCircle,
      },
      COMPLETED: {
        label: "مكتملة",
        className: "bg-gray-100 text-gray-800",
        icon: CheckCircle,
      },
    };
    return badges[status] || badges.NEW;
  };

  const getPriorityBadge = (priority: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      LOW: { label: "منخفضة", className: "bg-gray-100 text-gray-600" },
      MEDIUM: { label: "متوسطة", className: "bg-blue-100 text-blue-700" },
      HIGH: { label: "عالية", className: "bg-red-100 text-red-700" },
    };
    return badges[priority] || badges.LOW;
  };

  const getGenderLabel = (gender: string) => {
    return gender === "MALE" ? "ذكر" : "أنثى";
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
          <h1 className="text-2xl font-bold text-gray-900">الحالات</h1>
          <p className="text-gray-600 mt-1">
            إدارة حالات المرضى المسجلين ({filteredCases.length} من {cases.length})
          </p>
        </div>
        <Link href="/dashboard/cases/new">
          <Button variant="primary">
            <Plus className="w-5 h-5 ml-2" />
            تسجيل حالة جديدة
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
              placeholder="بحث بالاسم، الهاتف، أو البريد..."
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
              <option value="NEW">جديدة</option>
              <option value="UNDER_REVIEW">قيد المراجعة</option>
              <option value="APPROVED">معتمدة</option>
              <option value="REJECTED">مرفوضة</option>
              <option value="COMPLETED">مكتملة</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="ALL">جميع الأولويات</option>
              <option value="HIGH">عالية</option>
              <option value="MEDIUM">متوسطة</option>
              <option value="LOW">منخفضة</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  المريض
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  العمر / الجنس
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  نوع البتر
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  الأولوية
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  المسؤول
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  تاريخ التسجيل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    لا توجد حالات
                  </td>
                </tr>
              ) : (
                filteredCases.map((caseItem) => {
                  const statusBadge = getStatusBadge(caseItem.status);
                  const priorityBadge = getPriorityBadge(caseItem.priority);
                  const StatusIcon = statusBadge.icon;

                  return (
                    <tr key={caseItem.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {caseItem.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {caseItem.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {caseItem.age} سنة / {getGenderLabel(caseItem.gender)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {caseItem.amputationType}
                        </div>
                        <div className="text-xs text-gray-500">
                          {caseItem.amputationLevel}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge.className}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${priorityBadge.className}`}
                        >
                          {priorityBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {caseItem.assignedTo ? (
                          <div className="flex items-center gap-2 text-sm text-gray-900">
                            <User className="w-4 h-4 text-gray-400" />
                            {caseItem.assignedTo.full_name}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">
                            غير معين
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(caseItem.createdAt).toLocaleDateString(
                            "ar-SA"
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/dashboard/cases/${caseItem.id}`}>
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                              <Eye className="w-4 h-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(caseItem.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
