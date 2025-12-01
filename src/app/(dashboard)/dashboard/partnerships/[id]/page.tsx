// src/app/(dashboard)/dashboard/partnerships/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowRight,
  Save,
  Trash2,
  Mail,
  Phone,
  Building,
  Globe,
  User,
  MessageSquare,
  Calendar,
  FileText,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { partnershipsApi } from "@/lib/api/partnerships";
import { Button } from "@/components/ui/Button";
import type {
  PartnershipInquiry,
  InquiryStatus,
} from "@/types/partnership";

export default function PartnershipDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [inquiry, setInquiry] = useState<PartnershipInquiry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form fields
  const [status, setStatus] = useState<InquiryStatus>("NEW");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (id) {
      loadInquiry();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadInquiry = async () => {
    try {
      setIsLoading(true);
      const data = await partnershipsApi.getOne(id);
      console.log("Loaded inquiry:", data);
      setInquiry(data);
      setStatus(data.status);
      setNotes(data.notes || "");
    } catch (error: any) {
      console.error("Load error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "فشل تحميل بيانات الاستفسار");
      router.push("/dashboard/partnerships");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const updateData: any = {
        status,
      };

      // فقط أضف notes إذا كان فيه قيمة
      if (notes && notes.trim()) {
        updateData.notes = notes;
      }

      console.log("Updating inquiry with data:", updateData);
      await partnershipsApi.update(id, updateData);
      toast.success("تم حفظ التغييرات بنجاح");
      loadInquiry();
    } catch (error: any) {
      console.error("Update error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "فشل حفظ التغييرات");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("هل أنت متأكد من حذف هذا الاستفسار؟")) return;

    try {
      await partnershipsApi.delete(id);
      toast.success("تم حذف الاستفسار بنجاح");
      router.push("/dashboard/partnerships");
    } catch (error) {
      toast.error("فشل حذف الاستفسار");
    }
  };

  const getPartnershipTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      MEDICAL: "شراكة طبية",
      INVESTMENT: "شراكة استثمارية",
      OTHER: "أخرى",
    };
    return labels[type] || type;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">لم يتم العثور على الاستفسار</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/partnerships")}
          >
            <ArrowRight className="w-5 h-5 ml-2" />
            رجوع
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              استفسار شراكة: {inquiry.organizationName}
            </h1>
            <p className="text-gray-600 mt-1">
              {getPartnershipTypeLabel(inquiry.partnershipType)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>
            <Save className="w-5 h-5 ml-2" />
            حفظ التغييرات
          </Button>
          <Button variant="outline" onClick={handleDelete}>
            <Trash2 className="w-5 h-5 text-red-600" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Organization Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building className="w-5 h-5" />
              معلومات المنظمة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  اسم المنظمة
                </label>
                <p className="text-gray-900 mt-1">
                  {inquiry.organizationName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  الدولة
                </label>
                <p className="text-gray-900 mt-1">{inquiry.country}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <User className="w-4 h-4" />
                  الشخص المسؤول
                </label>
                <p className="text-gray-900 mt-1">{inquiry.contactPerson}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  تاريخ الاستفسار
                </label>
                <p className="text-gray-900 mt-1">
                  {new Date(inquiry.createdAt).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              معلومات الاتصال
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  البريد الإلكتروني
                </label>
                <p className="text-gray-900 mt-1" dir="ltr">
                  {inquiry.email}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  رقم الهاتف
                </label>
                <p className="text-gray-900 mt-1" dir="ltr">
                  {inquiry.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Inquiry Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              تفاصيل الاستفسار
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {inquiry.inquiryDetails}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              حالة الاستفسار
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحالة
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as InquiryStatus)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="NEW">جديد</option>
                  <option value="IN_PROGRESS">قيد المعالجة</option>
                </select>
              </div>

              {inquiry.assignedTo && (
                <div className="pt-4 border-t border-gray-200">
                  <label className="text-sm font-medium text-gray-700">
                    مسند إلى
                  </label>
                  <p className="text-gray-900 mt-1">
                    {inquiry.assignedTo.name}
                  </p>
                  <p className="text-sm text-gray-500" dir="ltr">
                    {inquiry.assignedTo.email}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              ملاحظات الإدارة
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              placeholder="أضف ملاحظاتك حول هذا الاستفسار..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
