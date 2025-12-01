// src/app/(dashboard)/dashboard/success-stories/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { successStoriesApi } from "@/lib/api/successStories";
import type { SuccessStory, StoryMilestone } from "@/types/successStory";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  Edit2,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  Video,
  Plus,
  Trash2,
  Star,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface PageProps {
  params: {
    id: string;
  };
}

export default function SuccessStoryDetailsPage({ params }: PageProps) {
  const router = useRouter();

  const [story, setStory] = useState<SuccessStory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Editable fields
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [caseType, setCaseType] = useState("");
  const [storyTitle, setStoryTitle] = useState("");
  const [storyDescription, setStoryDescription] = useState("");
  const [patientTestimonial, setPatientTestimonial] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [orderIndex, setOrderIndex] = useState("");

  // Image upload states
  const [uploadingBeforeImage, setUploadingBeforeImage] = useState(false);
  const [uploadingAfterImage, setUploadingAfterImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  // Milestone states
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneDescription, setMilestoneDescription] = useState("");
  const [milestoneDate, setMilestoneDate] = useState("");
  const [milestoneImage, setMilestoneImage] = useState<File | null>(null);

  useEffect(() => {
    loadStory();
  }, [params.id]);

  const loadStory = async () => {
    try {
      setIsLoading(true);
      const data = await successStoriesApi.getOne(params.id);
      setStory(data);

      // Set editable fields
      setPatientName(data.patientName);
      setAge(data.age?.toString() || "");
      setCaseType(data.caseType);
      setStoryTitle(data.storyTitle);
      setStoryDescription(data.storyDescription);
      setPatientTestimonial(data.patientTestimonial || "");
      setIsFeatured(data.isFeatured);
      setIsActive(data.isActive);
      setOrderIndex(data.orderIndex.toString());
    } catch (error: any) {
      console.error("Error loading success story:", error);
      toast.error("فشل تحميل بيانات قصة النجاح");
      router.push("/dashboard/success-stories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (
      !patientName.trim() ||
      !caseType.trim() ||
      !storyTitle.trim() ||
      !storyDescription.trim()
    ) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      setIsSaving(true);

      const formData = new FormData();
      formData.append("patientName", patientName.trim());
      formData.append("caseType", caseType.trim());
      formData.append("storyTitle", storyTitle.trim());
      formData.append("storyDescription", storyDescription.trim());
      formData.append(
        "patientTestimonial",
        patientTestimonial.trim() || "I feel amazing!"
      );
      formData.append("isFeatured", isFeatured.toString());
      formData.append("isActive", isActive.toString());
      formData.append("orderIndex", orderIndex || "0");

      if (age.trim()) {
        formData.append("age", age);
      }

      await successStoriesApi.update(params.id, formData);
      toast.success("تم تحديث قصة النجاح بنجاح");
      setIsEditing(false);
      loadStory();
    } catch (error: any) {
      console.error("Error updating success story:", error);
      toast.error("فشل تحديث قصة النجاح");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (type: "before" | "after", file: File) => {
    try {
      if (type === "before") {
        setUploadingBeforeImage(true);
        await successStoriesApi.uploadBeforeImage(params.id, file);
        toast.success("تم رفع الصورة قبل العلاج بنجاح");
      } else {
        setUploadingAfterImage(true);
        await successStoriesApi.uploadAfterImage(params.id, file);
        toast.success("تم رفع الصورة بعد العلاج بنجاح");
      }
      loadStory();
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error("فشل رفع الصورة");
    } finally {
      setUploadingBeforeImage(false);
      setUploadingAfterImage(false);
    }
  };

  const handleVideoUpload = async (file: File) => {
    try {
      setUploadingVideo(true);
      await successStoriesApi.uploadVideo(params.id, file);
      toast.success("تم رفع الفيديو بنجاح");
      loadStory();
    } catch (error: any) {
      console.error("Error uploading video:", error);
      toast.error("فشل رفع الفيديو");
    } finally {
      setUploadingVideo(false);
    }
  };

const handleAddMilestone = async () => {
  if (!milestoneTitle.trim() || !milestoneDescription.trim()) {
    toast.error("الرجاء ملء عنوان ووصف المرحلة");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("title", milestoneTitle.trim());
    formData.append("description", milestoneDescription.trim());

    if (milestoneDate) formData.append("date", milestoneDate);
    if (milestoneImage) formData.append("imageUrl", milestoneImage);

    // إضافة milestoneType المطلوبة من الـ Prisma
    formData.append("milestoneType", "AFTER"); // أو "BEFORE"

    // إضافة orderIndex لأن Prisma يطلبه
    // لو ما عندك ترتيب محدد ممكن تحط 0 أو عدد المراحل الحالي +1
    formData.append("orderIndex", "0");

    console.log("Creating milestone with FormData:", formData);

    const data = await successStoriesApi.milestones.create(params.id, formData);

    console.log("Milestone created successfully:", data);
    toast.success("تم إضافة المرحلة بنجاح");

    setShowAddMilestone(false);
    setMilestoneTitle("");
    setMilestoneDescription("");
    setMilestoneDate("");
    setMilestoneImage(null);

    loadStory();
  } catch (error: any) {
    console.error(
      "Error adding milestone:",
      error.response?.data || error.message
    );
    toast.error("فشل إضافة المرحلة");
  }
};




  const handleDeleteMilestone = async (milestoneId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه المرحلة؟")) return;

    try {
      await successStoriesApi.milestones.delete(params.id, milestoneId);
      toast.success("تم حذف المرحلة بنجاح");
      loadStory();
    } catch (error: any) {
      console.error("Error deleting milestone:", error);
      toast.error("فشل حذف المرحلة");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard/success-stories")}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {story.patientName}
              {story.isFeatured && (
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              )}
            </h1>
            <p className="text-gray-600 mt-1">{story.storyTitle}</p>
          </div>
        </div>
        {!isEditing && (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit2 className="w-4 h-4 ml-2" />
            تعديل
          </Button>
        )}
      </div>

      {/* Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Before Image */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            صورة قبل العلاج
          </h3>
          {story.beforeImage ? (
            <div className="space-y-4">
              <img
                src={`${API_BASE_URL}${story.beforeImage}`}
                alt="قبل العلاج"
                className="w-full h-64 object-cover rounded-lg"
              />
              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload("before", file);
                  }}
                  className="hidden"
                  disabled={uploadingBeforeImage}
                />
                <span
                  className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                    uploadingBeforeImage
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Upload className="w-4 h-4 ml-2" />
                  {uploadingBeforeImage ? "جاري الرفع..." : "تغيير الصورة"}
                </span>
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-16 h-16 text-gray-400" />
              </div>
              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload("before", file);
                  }}
                  className="hidden"
                  disabled={uploadingBeforeImage}
                />
                <span
                  className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                    uploadingBeforeImage
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Upload className="w-4 h-4 ml-2" />
                  {uploadingBeforeImage ? "جاري الرفع..." : "رفع صورة"}
                </span>
              </label>
            </div>
          )}
        </div>

        {/* After Image */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            صورة بعد العلاج
          </h3>
          {story.afterImage ? (
            <div className="space-y-4">
              <img
                src={`${API_BASE_URL}${story.afterImage}`}
                alt="بعد العلاج"
                className="w-full h-64 object-cover rounded-lg"
              />
              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload("after", file);
                  }}
                  className="hidden"
                  disabled={uploadingAfterImage}
                />
                <span
                  className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                    uploadingAfterImage
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Upload className="w-4 h-4 ml-2" />
                  {uploadingAfterImage ? "جاري الرفع..." : "تغيير الصورة"}
                </span>
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-16 h-16 text-gray-400" />
              </div>
              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload("after", file);
                  }}
                  className="hidden"
                  disabled={uploadingAfterImage}
                />
                <span
                  className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                    uploadingAfterImage
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Upload className="w-4 h-4 ml-2" />
                  {uploadingAfterImage ? "جاري الرفع..." : "رفع صورة"}
                </span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Video */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Video className="w-5 h-5 ml-2" />
          فيديو القصة
        </h3>
        {story.videoUrl ? (
          <div className="space-y-4">
            <video
              src={`${API_BASE_URL}${story.videoUrl}`}
              controls
              className="w-full max-h-96 rounded-lg bg-black"
            />
            <label className="cursor-pointer block">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleVideoUpload(file);
                }}
                className="hidden"
                disabled={uploadingVideo}
              />
              <span
                className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                  uploadingVideo
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Upload className="w-4 h-4 ml-2" />
                {uploadingVideo ? "جاري الرفع..." : "تغيير الفيديو"}
              </span>
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <Video className="w-16 h-16 text-gray-400" />
            </div>
            <label className="cursor-pointer block">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleVideoUpload(file);
                }}
                className="hidden"
                disabled={uploadingVideo}
              />
              <span
                className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                  uploadingVideo
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Upload className="w-4 h-4 ml-2" />
                {uploadingVideo ? "جاري الرفع..." : "رفع فيديو"}
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Story Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          تفاصيل القصة
        </h2>

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم المريض *
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العمر
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع الحالة *
              </label>
              <input
                type="text"
                value={caseType}
                onChange={(e) => setCaseType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان القصة *
              </label>
              <input
                type="text"
                value={storyTitle}
                onChange={(e) => setStoryTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف القصة *
              </label>
              <textarea
                value={storyDescription}
                onChange={(e) => setStoryDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                شهادة المريض
              </label>
              <textarea
                value={patientTestimonial}
                onChange={(e) => setPatientTestimonial(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ترتيب العرض
                </label>
                <input
                  type="number"
                  value={orderIndex}
                  onChange={(e) => setOrderIndex(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center pt-8">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="mr-2 text-sm font-medium text-gray-700">
                    قصة مميزة
                  </span>
                </label>
              </div>

              <div className="flex items-center pt-8">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="mr-2 text-sm font-medium text-gray-700">
                    نشط
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  loadStory();
                }}
                disabled={isSaving}
              >
                <X className="w-4 h-4 ml-2" />
                إلغاء
              </Button>
              <Button
                variant="primary"
                onClick={handleUpdate}
                disabled={isSaving}
              >
                <Save className="w-4 h-4 ml-2" />
                {isSaving ? "جاري الحفظ..." : "حفظ التعديلات"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">اسم المريض</p>
                <p className="text-base font-medium text-gray-900">
                  {story.patientName}
                </p>
              </div>
              {story.age && (
                <div>
                  <p className="text-sm text-gray-600">العمر</p>
                  <p className="text-base font-medium text-gray-900">
                    {story.age} سنة
                  </p>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">نوع الحالة</p>
              <p className="text-base text-gray-900">{story.caseType}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">عنوان القصة</p>
              <p className="text-base font-semibold text-gray-900">
                {story.storyTitle}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">وصف القصة</p>
              <p className="text-base text-gray-900 whitespace-pre-wrap">
                {story.storyDescription}
              </p>
            </div>

            {story.patientTestimonial && (
              <div>
                <p className="text-sm text-gray-600 mb-1">شهادة المريض</p>
                <p className="text-base text-gray-900 whitespace-pre-wrap italic">
                  "{story.patientTestimonial}"
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-600">ترتيب العرض</p>
                <p className="text-base font-medium text-gray-900">
                  {story.orderIndex}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">الحالة</p>
                <span
                  className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                    story.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {story.isActive ? "نشط" : "غير نشط"}
                </span>
              </div>
              {story.isFeatured && (
                <div>
                  <p className="text-sm text-gray-600">مميزة</p>
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Milestones */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            مراحل التعافي ({story.milestones?.length || 0})
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddMilestone(!showAddMilestone)}
          >
            <Plus className="w-4 h-4 ml-2" />
            إضافة مرحلة
          </Button>
        </div>

        {/* Add Milestone Form */}
        {showAddMilestone && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان المرحلة *
              </label>
              <input
                type="text"
                value={milestoneTitle}
                onChange={(e) => setMilestoneTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="مثلاً: أول جلسة علاج طبيعي"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف المرحلة *
              </label>
              <textarea
                value={milestoneDescription}
                onChange={(e) => setMilestoneDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="اكتب وصف تفصيلي للمرحلة..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التاريخ (اختياري)
                </label>
                <input
                  type="date"
                  value={milestoneDate}
                  onChange={(e) => setMilestoneDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  صورة المرحلة (اختياري)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setMilestoneImage(e.target.files?.[0] || null)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowAddMilestone(false);
                  setMilestoneTitle("");
                  setMilestoneDescription("");
                  setMilestoneDate("");
                  setMilestoneImage(null);
                }}
              >
                إلغاء
              </Button>
              <Button variant="primary" size="sm" onClick={handleAddMilestone}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة المرحلة
              </Button>
            </div>
          </div>
        )}

        {/* Milestones List */}
        {story.milestones && story.milestones.length > 0 ? (
          <div className="space-y-4">
            {story.milestones
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((milestone, index) => (
                <div
                  key={milestone.id}
                  className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>

                  {milestone.imageUrl && (
                    <img
                      src={`${API_BASE_URL}${milestone.imageUrl}`}
                      alt={milestone.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}

                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-900 mb-1">
                      {milestone.title}
                    </h4>
                    {milestone.date && (
                      <p className="text-sm text-gray-600 mb-2">
                        {new Date(milestone.date).toLocaleDateString("ar-EG")}
                      </p>
                    )}
                    <p className="text-sm text-gray-700">
                      {milestone.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteMilestone(milestone.id)}
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-8">
            لا توجد مراحل تعافي مضافة بعد
          </p>
        )}
      </div>

      {/* Metadata */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">تاريخ الإنشاء:</span>{" "}
            <span className="text-gray-900">
              {new Date(story.createdAt).toLocaleString("ar-EG")}
            </span>
          </div>
          <div>
            <span className="text-gray-600">آخر تحديث:</span>{" "}
            <span className="text-gray-900">
              {new Date(story.updatedAt).toLocaleString("ar-EG")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
