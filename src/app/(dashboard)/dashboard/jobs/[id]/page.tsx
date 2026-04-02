// src/app/(dashboard)/jobs/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowRight,
  Save,
  Trash2,
  FileText,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Calendar,
  ExternalLink,
  User,
  MessageSquare,
  Users,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { jobsApi } from "@/lib/api/jobs";
import { getImageUrl } from "@/lib/utils/imageUrl";
import { Button } from "@/components/ui/Button";
import type {
  JobApplication,
  JobApplicationStatus,
} from "@/types/jobApplication";

export default function JobApplicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [application, setApplication] = useState<JobApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form fields
  const [status, setStatus] = useState<JobApplicationStatus>("PENDING");
  const [reviewNotes, setReviewNotes] = useState("");
  const [rejectionNote, setRejectionNote] = useState("");
  const [rating, setRating] = useState<number | ("")>("");

  useEffect(() => {
    if (id) {
      loadApplication();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadApplication = async () => {
    try {
      setIsLoading(true);
      const data = await jobsApi.getOne(id);
      console.log("Loaded application:", data);
      setApplication(data);
      setStatus(data.status);
      setReviewNotes(data.reviewNotes || "");
    } catch (error: any) {
      console.error("Load error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "فشل تحميل بيانات الطلب");
      router.push("/dashboard/jobs");
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

      // فقط أضف reviewNotes إذا كان فيه قيمة
      if (reviewNotes && reviewNotes.trim()) {
        updateData.reviewNotes = reviewNotes;
      }
      if (status === "REJECTED" && rejectionNote.trim()) {
        updateData.rejectionNote = rejectionNote;
      }
      if (status === "ACCEPTED" && rating !== "") {
        updateData.rating = rating;
      }

      console.log("Updating application with data:", updateData);
      await jobsApi.update(id, updateData);
      toast.success("تم حفظ التغييرات بنجاح");
      loadApplication();
    } catch (error: any) {
      console.error("Update error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "فشل حفظ التغييرات");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("هل أنت متأكد من حذف هذا الطلب؟")) return;

    try {
      await jobsApi.delete(id);
      toast.success("تم حذف الطلب بنجاح");
      router.push("/dashboard/jobs");
    } catch (error) {
      toast.error("فشل حذف الطلب");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">لم يتم العثور على الطلب</p>
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
            onClick={() => router.push("/jobs")}
          >
            <ArrowRight className="w-5 h-5 ml-2" />
            رجوع
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              طلب توظيف: {application.fullName}
            </h1>
            <p className="text-gray-600 mt-1">{application.specialization}</p>
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
          {/* Personal Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              المعلومات الشخصية
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  الاسم الكامل
                </label>
                <p className="text-gray-900 mt-1">{application.fullName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  البريد الإلكتروني
                </label>
                <p className="text-gray-900 mt-1" dir="ltr">
                  {application.email}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  رقم الهاتف
                </label>
                <p className="text-gray-900 mt-1" dir="ltr">
                  {application.phone}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  تاريخ التقديم
                </label>
                <p className="text-gray-900 mt-1">
                  {new Date(application.createdAt).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              المعلومات المهنية
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  التخصص المطلوب
                </label>
                <p className="text-gray-900 mt-1">{application.specialization}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  سنوات الخبرة
                </label>
                <p className="text-gray-900 mt-1">
                  {application.yearsOfExperience} سنة
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <GraduationCap className="w-4 h-4" />
                  المؤهل العلمي
                </label>
                <p className="text-gray-900 mt-1">{application.education}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                <div>
                  <label className="text-sm font-medium text-gray-700">هل يعمل حالياً</label>
                  <p className="text-gray-900 mt-1">
                    {application.currentlyEmployed === true ? "نعم" : application.currentlyEmployed === false ? "لا" : "—"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">إمكانية الالتحاق</label>
                  <p className="text-gray-900 mt-1">
                    {({
                      IMMEDIATE: "فوري",
                      WITHIN_ONE_WEEK: "خلال أسبوع",
                      WITHIN_TWO_WEEKS: "خلال أسبوعين",
                      WITHIN_ONE_MONTH: "خلال شهر",
                    } as Record<string, string>)[application.availabilityToJoin ?? ""] ?? "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          {application.coverLetter && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                رسالة التقديم
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {application.coverLetter}
              </p>
            </div>
          )}

          {/* Links */}
          {(application.linkedinUrl || application.cvFileUrl) && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                الروابط والملفات
              </h2>
              <div className="space-y-3">
                {application.cvFileUrl && (
                  <a
                    href={getImageUrl(application.cvFileUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
                  >
                    <FileText className="w-4 h-4" />
                    السيرة الذاتية (CV)
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {application.linkedinUrl && (
                  <a
                    href={application.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                    LinkedIn Profile
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* References */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              المراجع
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">المرجع الأول</h3>
                <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg">
                  <div><label className="text-sm text-gray-500">الاسم</label><p className="text-gray-900 mt-1">{application.ref1Name}</p></div>
                  <div><label className="text-sm text-gray-500">الشركة</label><p className="text-gray-900 mt-1">{application.ref1Company}</p></div>
                  <div><label className="text-sm text-gray-500">المسمى الوظيفي</label><p className="text-gray-900 mt-1">{application.ref1JobTitle}</p></div>
                  <div><label className="text-sm text-gray-500">رقم التواصل</label><p className="text-gray-900 mt-1" dir="ltr">{application.ref1Phone}</p></div>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">المرجع الثاني</h3>
                <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg">
                  <div><label className="text-sm text-gray-500">الاسم</label><p className="text-gray-900 mt-1">{application.ref2Name}</p></div>
                  <div><label className="text-sm text-gray-500">الشركة</label><p className="text-gray-900 mt-1">{application.ref2Company}</p></div>
                  <div><label className="text-sm text-gray-500">المسمى الوظيفي</label><p className="text-gray-900 mt-1">{application.ref2JobTitle}</p></div>
                  <div><label className="text-sm text-gray-500">رقم التواصل</label><p className="text-gray-900 mt-1" dir="ltr">{application.ref2Phone}</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              حالة الطلب
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحالة
                </label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as JobApplicationStatus)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="PENDING">معلق</option>
                  <option value="INTERVIEW_READY">مؤهل للمقابلة</option>
                  <option value="ACCEPTED">مقبول</option>
                  <option value="REJECTED">مرفوض</option>
                  <option value="HIRED">تم التوظيف</option>
                </select>
              </div>

              {status === "REJECTED" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ملاحظة الرفض <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rejectionNote}
                    onChange={(e) => setRejectionNote(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    rows={3}
                    placeholder="سبب الرفض..."
                  />
                </div>
              )}

              {status === "ACCEPTED" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    درجة التقييم (1-5) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">اختر درجة</option>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              )}

              {application.reviewedBy && (
                <div className="pt-4 border-t border-gray-200">
                  <label className="text-sm font-medium text-gray-700">
                    تمت المراجعة بواسطة
                  </label>
                  <p className="text-gray-900 mt-1">
                    {application.reviewedBy.name}
                  </p>
                  <p className="text-sm text-gray-500" dir="ltr">
                    {application.reviewedBy.email}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Admin Notes */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              ملاحظات الإدارة
            </h2>
            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              rows={6}
              placeholder="أضف ملاحظاتك حول هذا الطلب..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
