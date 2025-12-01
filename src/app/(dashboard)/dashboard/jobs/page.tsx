// src/app/(dashboard)/dashboard/jobs/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { jobsApi } from "@/lib/api/jobs";
import { Button } from "@/components/ui/Button";
import type { JobApplication } from "@/types/jobApplication";

export default function JobApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      const data = await jobsApi.getAll();
      setApplications(data);
    } catch (error: any) {
      toast.error("فشل تحميل طلبات التوظيف");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الطلب؟")) return;

    try {
      await jobsApi.delete(id);
      toast.success("تم حذف الطلب بنجاح");
      loadApplications();
    } catch (error) {
      toast.error("فشل حذف الطلب");
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: "قيد الانتظار",
      REVIEWED: "تمت المراجعة",
      ACCEPTED: "مقبول",
      REJECTED: "مرفوض",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      REVIEWED: "bg-blue-100 text-blue-800",
      ACCEPTED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "REVIEWED":
        return <Eye className="w-4 h-4" />;
      case "ACCEPTED":
        return <CheckCircle className="w-4 h-4" />;
      case "REJECTED":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const filteredApplications =
    filterStatus === "ALL"
      ? applications
      : applications.filter((app) => app.status === filterStatus);

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
          <h1 className="text-2xl font-bold text-gray-900">طلبات التوظيف</h1>
          <p className="text-gray-600 mt-1">
            إدارة طلبات التوظيف المستلمة ({applications.length} طلب)
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filterStatus === "ALL" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("ALL")}
          >
            الكل ({applications.length})
          </Button>
          <Button
            variant={filterStatus === "PENDING" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("PENDING")}
          >
            قيد الانتظار (
            {applications.filter((a) => a.status === "PENDING").length})
          </Button>
          <Button
            variant={filterStatus === "REVIEWED" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("REVIEWED")}
          >
            تمت المراجعة (
            {applications.filter((a) => a.status === "REVIEWED").length})
          </Button>
          <Button
            variant={filterStatus === "ACCEPTED" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("ACCEPTED")}
          >
            مقبول ({applications.filter((a) => a.status === "ACCEPTED").length})
          </Button>
          <Button
            variant={filterStatus === "REJECTED" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("REJECTED")}
          >
            مرفوض ({applications.filter((a) => a.status === "REJECTED").length})
          </Button>
        </div>
      </div>

      {/* Applications Table */}
      {filteredApplications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">لا توجد طلبات توظيف حالياً</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الاسم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التخصص
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    سنوات الخبرة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    البريد الإلكتروني
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    رقم الهاتف
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاريخ التقديم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((application) => (
                  <tr
                    key={application.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {application.fullName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {application.specialization}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {application.yearsOfExperience} سنة
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500" dir="ltr">
                        {application.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500" dir="ltr">
                        {application.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          application.status
                        )}`}
                      >
                        {getStatusIcon(application.status)}
                        {getStatusLabel(application.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(application.createdAt).toLocaleDateString(
                        "ar-EG"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Link href={`/dashboard/jobs/${application.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 ml-1" />
                            عرض
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
