// src/app/(dashboard)/dashboard/cases/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { casesApi } from "@/lib/api/cases";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Activity,
  AlertCircle,
  Upload,
  Plus,
  Save,
  Edit,
} from "lucide-react";
import type { Case } from "@/types/case";
import { getImageUrl } from "@/lib/utils/imageUrl";
import { useAuthStore } from "@/store/authStore";

export default function CaseDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // State for updates
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<Case["status"]>("NEW");
  const [priority, setPriority] = useState<Case["priority"]>("LOW");
  const [assignedToId, setAssignedToId] = useState("");

  // State for editable fields
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE">("MALE");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [amputationType, setAmputationType] = useState("");
  const [amputationLevel, setAmputationLevel] = useState("");
  const [amputationDate, setAmputationDate] = useState("");
  const [currentCondition, setCurrentCondition] = useState("");
  const [previousProsthetics, setPreviousProsthetics] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState("");

  // State for adding note
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [noteType, setNoteType] = useState("GENERAL");

  // State for adding image
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImageType, setSelectedImageType] = useState("AMPUTATION_SITE");

  useEffect(() => {
    loadCase();
  }, [params.id]);

  const loadCase = async () => {
    try {
      setIsLoading(true);
      const data = await casesApi.getOne(params.id);
      setCaseData(data);

      // Load all fields
      setStatus(data.status);
      setPriority(data.priority);
      setAssignedToId(data.assignedToId || "");
      setFullName(data.fullName);
      setAge(data.age.toString());
      setGender(data.gender);
      setPhone(data.phone);
      setEmail(data.email || "");
      setAddress(data.address);
      setAmputationType(data.amputationType);
      setAmputationLevel(data.amputationLevel);
      setAmputationDate(data.amputationDate.split("T")[0]); // Format date for input
      setCurrentCondition(data.currentCondition);
      setPreviousProsthetics(data.previousProsthetics);
      setAdditionalNotes(data.additionalNotes || "");
    } catch (error: any) {
      toast.error("فشل تحميل الحالة");
      router.push("/dashboard/cases");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCase = async () => {
    if (!fullName.trim() || !age || !phone.trim() || !address.trim()) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      const updateData: any = {
        fullName: fullName.trim(),
        age: Number(age),
        gender,
        phone: phone.trim(),
        address: address.trim(),
        amputationType: amputationType.trim(),
        amputationLevel: amputationLevel.trim(),
        amputationDate,
        currentCondition: currentCondition.trim(),
        previousProsthetics,
        status,
        priority,
        assignedToId: assignedToId || undefined,
      };

      if (email.trim()) {
        updateData.email = email.trim();
      }

      if (additionalNotes.trim()) {
        updateData.additionalNotes = additionalNotes.trim();
      }

      await casesApi.update(params.id, updateData);
      toast.success("تم تحديث الحالة بنجاح");
      setIsEditing(false);
      loadCase();
    } catch (error: any) {
      console.error("Error updating case:", error);
      toast.error("فشل تحديث الحالة");
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim() || !user?.id) {
      toast.error("الرجاء إدخال نص الملاحظة");
      return;
    }

    try {
      await casesApi.addNote(params.id, {
        userId: user.id,
        noteText: noteText.trim(),
        noteType,
      });
      toast.success("تمت إضافة الملاحظة بنجاح");
      setShowNoteForm(false);
      setNoteText("");
      setNoteType("GENERAL");
      loadCase();
    } catch (error: any) {
      toast.error("فشل إضافة الملاحظة");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("الرجاء اختيار صورة صحيحة");
      return;
    }

    try {
      setUploadingImage(true);
      await casesApi.addImage(params.id, file, selectedImageType);
      toast.success("تم رفع الصورة بنجاح");
      loadCase();
    } catch (error: any) {
      toast.error("فشل رفع الصورة");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      NEW: { label: "جديدة", className: "bg-blue-100 text-blue-800" },
      UNDER_REVIEW: {
        label: "قيد المراجعة",
        className: "bg-yellow-100 text-yellow-800",
      },
      APPROVED: { label: "معتمدة", className: "bg-green-100 text-green-800" },
      REJECTED: { label: "مرفوضة", className: "bg-red-100 text-red-800" },
      COMPLETED: { label: "مكتملة", className: "bg-gray-100 text-gray-800" },
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
      </div>
    );
  }

  if (!caseData) {
    return null;
  }

  const statusBadge = getStatusBadge(caseData.status);
  const priorityBadge = getPriorityBadge(caseData.priority);

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard/cases")}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {caseData.fullName}
            </h1>
            <p className="text-gray-600 mt-1">تفاصيل الحالة</p>
          </div>
        </div>
        <Button
          variant={isEditing ? "outline" : "primary"}
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit className="w-4 h-4 ml-2" />
          {isEditing ? "إلغاء التعديل" : "تعديل الحالة"}
        </Button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              المعلومات الشخصية
            </h2>
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الاسم الكامل *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      العمر *
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الجنس *
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as "MALE" | "FEMALE")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="MALE">ذكر</option>
                      <option value="FEMALE">أنثى</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم الهاتف *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العنوان *
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">الاسم الكامل</p>
                    <p className="text-sm font-medium text-gray-900">
                      {caseData.fullName}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">العمر / الجنس</p>
                    <p className="text-sm font-medium text-gray-900">
                      {caseData.age} سنة /{" "}
                      {caseData.gender === "MALE" ? "ذكر" : "أنثى"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">رقم الهاتف</p>
                    <p className="text-sm font-medium text-gray-900">
                      {caseData.phone}
                    </p>
                  </div>
                </div>
                {caseData.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                      <p className="text-sm font-medium text-gray-900">
                        {caseData.email}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3 md:col-span-2">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">العنوان</p>
                    <p className="text-sm font-medium text-gray-900">
                      {caseData.address}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Medical Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              المعلومات الطبية
            </h2>
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نوع البتر *
                    </label>
                    <input
                      type="text"
                      value={amputationType}
                      onChange={(e) => setAmputationType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      مستوى البتر *
                    </label>
                    <input
                      type="text"
                      value={amputationLevel}
                      onChange={(e) => setAmputationLevel(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ البتر *
                  </label>
                  <input
                    type="date"
                    value={amputationDate}
                    onChange={(e) => setAmputationDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحالة الراهنة *
                  </label>
                  <textarea
                    value={currentCondition}
                    onChange={(e) => setCurrentCondition(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="previousProsthetics-edit"
                    checked={previousProsthetics}
                    onChange={(e) => setPreviousProsthetics(e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label
                    htmlFor="previousProsthetics-edit"
                    className="text-sm font-medium text-gray-700"
                  >
                    لديه أطراف صناعية سابقة
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ملاحظات إضافية
                  </label>
                  <textarea
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Save Button */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      loadCase(); // Reset to original values
                    }}
                  >
                    إلغاء
                  </Button>
                  <Button variant="primary" onClick={handleUpdateCase}>
                    <Save className="w-4 h-4 ml-2" />
                    حفظ جميع التعديلات
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">نوع البتر</p>
                  <p className="text-sm font-medium text-gray-900">
                    {caseData.amputationType}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">مستوى البتر</p>
                  <p className="text-sm font-medium text-gray-900">
                    {caseData.amputationLevel}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">تاريخ البتر</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(caseData.amputationDate).toLocaleDateString("ar-SA")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">الحالة الراهنة</p>
                  <p className="text-sm font-medium text-gray-900">
                    {caseData.currentCondition}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">أطراف صناعية سابقة</p>
                  <p className="text-sm font-medium text-gray-900">
                    {caseData.previousProsthetics ? "نعم" : "لا"}
                  </p>
                </div>
                {caseData.additionalNotes && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">ملاحظات إضافية</p>
                    <p className="text-sm font-medium text-gray-900 whitespace-pre-wrap">
                      {caseData.additionalNotes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">الصور</h2>
              <div className="flex items-center gap-2">
                <select
                  value={selectedImageType}
                  onChange={(e) => setSelectedImageType(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
                >
                  <option value="AMPUTATION_SITE">موقع البتر</option>
                  <option value="XRAY">أشعة</option>
                  <option value="MEDICAL_REPORT">تقرير طبي</option>
                  <option value="OTHER">أخرى</option>
                </select>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                  <span
                    className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                      uploadingImage
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <Upload className="w-4 h-4 ml-2" />
                    {uploadingImage ? "جاري الرفع..." : "رفع صورة"}
                  </span>
                </label>
              </div>
            </div>

            {caseData.images && caseData.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {caseData.images.map((image) => (
                  <div
                    key={image.id}
                    className="relative group rounded-lg overflow-hidden border border-gray-200"
                  >
                    <img
                      src={getImageUrl(image.imageUrl)}
                      alt={image.imageType}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white px-2 py-1 text-xs">
                      {image.imageType}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">لا توجد صور</p>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">الملاحظات</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNoteForm(!showNoteForm)}
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة ملاحظة
              </Button>
            </div>

            {showNoteForm && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="space-y-3">
                  <select
                    value={noteType}
                    onChange={(e) => setNoteType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="GENERAL">عامة</option>
                    <option value="MEDICAL">طبية</option>
                    <option value="ADMIN">إدارية</option>
                    <option value="FOLLOWUP">متابعة</option>
                  </select>
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    rows={3}
                    placeholder="اكتب الملاحظة هنا..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowNoteForm(false);
                        setNoteText("");
                      }}
                    >
                      إلغاء
                    </Button>
                    <Button variant="primary" size="sm" onClick={handleAddNote}>
                      <Save className="w-4 h-4 ml-2" />
                      حفظ
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {caseData.notes && caseData.notes.length > 0 ? (
              <div className="space-y-3">
                {caseData.notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {note.user?.full_name || "مستخدم"}
                        </span>
                        <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded">
                          {note.noteType}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(note.createdAt).toLocaleDateString("ar-SA")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {note.noteText}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">لا توجد ملاحظات</p>
            )}
          </div>
        </div>

        {/* Right Column - Status & Actions */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">
              حالة الطلب
            </h3>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحالة
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Case["status"])}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="NEW">جديدة</option>
                    <option value="UNDER_REVIEW">قيد المراجعة</option>
                    <option value="APPROVED">معتمدة</option>
                    <option value="REJECTED">مرفوضة</option>
                    <option value="COMPLETED">مكتملة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الأولوية
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Case["priority"])}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="LOW">منخفضة</option>
                    <option value="MEDIUM">متوسطة</option>
                    <option value="HIGH">عالية</option>
                  </select>
                </div>

                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleUpdateCase}
                >
                  <Save className="w-4 h-4 ml-2" />
                  حفظ التغييرات
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">الحالة:</span>
                  <div className="mt-1">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge.className}`}
                    >
                      {statusBadge.label}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">الأولوية:</span>
                  <div className="mt-1">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${priorityBadge.className}`}
                    >
                      {priorityBadge.label}
                    </span>
                  </div>
                </div>
                {caseData.assignedTo && (
                  <div>
                    <span className="text-sm text-gray-600">المسؤول:</span>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {caseData.assignedTo.full_name}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dates Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">
              التواريخ
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>تاريخ التسجيل</span>
                </div>
                <p className="text-gray-900 mr-6">
                  {new Date(caseData.createdAt).toLocaleDateString("ar-SA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>آخر تحديث</span>
                </div>
                <p className="text-gray-900 mr-6">
                  {new Date(caseData.updatedAt).toLocaleDateString("ar-SA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">
              الإحصائيات
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">عدد الصور</span>
                <span className="text-lg font-bold text-gray-900">
                  {caseData.images?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">عدد الملاحظات</span>
                <span className="text-lg font-bold text-gray-900">
                  {caseData.notes?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
