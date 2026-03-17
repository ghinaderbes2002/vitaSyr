// src/app/(dashboard)/dashboard/success-stories/new/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { successStoriesApi } from "@/lib/api/successStories";
import { Button } from "@/components/ui/Button";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { ArrowRight, Save, Upload, X } from "lucide-react";
import type { StoryType } from "@/types/successStory";

export default function NewSuccessStoryPage() {
  const router = useRouter();

  const [storyType, setStoryType] = useState<StoryType>("MEDICAL");
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [caseType, setCaseType] = useState("");
  const [storyTitle, setStoryTitle] = useState("");
  const [storyDescription, setStoryDescription] = useState("");
  const [patientTestimonial, setPatientTestimonial] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [orderIndex, setOrderIndex] = useState("0");

  // Image files
  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [afterImage, setAfterImage] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Previews
  const [beforeImagePreview, setBeforeImagePreview] = useState<string>("");
  const [afterImagePreview, setAfterImagePreview] = useState<string>("");

  const [isSaving, setIsSaving] = useState(false);

  const handleBeforeImageChange = (file: File | null) => {
    setBeforeImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBeforeImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setBeforeImagePreview("");
    }
  };

  const handleAfterImageChange = (file: File | null) => {
    setAfterImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAfterImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAfterImagePreview("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !patientName.trim() ||
      !storyTitle.trim() ||
      !storyDescription.trim()
    ) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    // Validation for MEDICAL stories
    if (storyType === "MEDICAL" && !caseType.trim()) {
      toast.error("الرجاء إدخال نوع الحالة للقصص الطبية");
      return;
    }

    try {
      setIsSaving(true);

      const formData = new FormData();
      formData.append("storyType", storyType);
      formData.append("patientName", patientName.trim());
      formData.append("storyTitle", storyTitle.trim());
      formData.append("storyDescription", storyDescription.trim());
      formData.append("patientTestimonial", patientTestimonial.trim() || "قصة ملهمة");
      formData.append("isFeatured", isFeatured.toString());
      formData.append("isActive", isActive.toString());
      formData.append("orderIndex", orderIndex || "0");

      if (age.trim()) {
        formData.append("age", age);
      }

      if (caseType.trim()) {
        formData.append("caseType", caseType.trim());
      }

      // Add images (optional for INSPIRATIONAL stories)
      if (beforeImage) {
        formData.append("beforeImage", beforeImage);
      }

      if (afterImage) {
        formData.append("afterImage", afterImage);
      }

      if (videoFile) {
        formData.append("videoUrl", videoFile);
      }

      console.log("Sending success story data:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const newStory = await successStoriesApi.create(formData);
      toast.success("تم إنشاء قصة النجاح بنجاح");
      router.push(`/dashboard/success-stories/${newStory.id}`);
    } catch (error: any) {
      console.error("Error creating success story:", error);
      console.error("Error response:", error.response?.data);
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "فشل إنشاء قصة النجاح"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/dashboard/success-stories")}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">قصة نجاح جديدة</h1>
          <p className="text-gray-600 mt-1">إضافة قصة نجاح للمرضى</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Story Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              معلومات القصة
            </h2>

            <div className="space-y-4">
              {/* Story Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع القصة *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStoryType("MEDICAL")}
                    className={`px-4 py-3 border-2 rounded-lg font-medium transition-all ${
                      storyType === "MEDICAL"
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg mb-1">🏥</div>
                      <div>قصة طبية</div>
                      <div className="text-xs text-gray-500 mt-1">
                        مريض - قبل/بعد العلاج
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStoryType("INSPIRATIONAL")}
                    className={`px-4 py-3 border-2 rounded-lg font-medium transition-all ${
                      storyType === "INSPIRATIONAL"
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg mb-1">⭐</div>
                      <div>قصة إلهامية</div>
                      <div className="text-xs text-gray-500 mt-1">
                        طبيب، موظف، متطوع
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {storyType === "MEDICAL" ? "اسم المريض *" : "الاسم *"}
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
                    العمر {storyType === "MEDICAL" ? "" : "(اختياري)"}
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {storyType === "MEDICAL" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع الحالة *
                  </label>
                  <input
                    type="text"
                    value={caseType}
                    onChange={(e) => setCaseType(e.target.value)}
                    placeholder="مثلاً: Surgery, Prosthetic Leg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required={storyType === "MEDICAL"}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان القصة *
                </label>
                <input
                  type="text"
                  value={storyTitle}
                  onChange={(e) => setStoryTitle(e.target.value)}
                  placeholder="مثلاً: Amazing Transformation"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف القصة *
                </label>
                <RichTextEditor
                  value={storyDescription}
                  onChange={setStoryDescription}
                  placeholder="اكتب وصف تفصيلي للقصة..."
                  minHeight="250px"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  شهادة المريض (اختياري)
                </label>
                <textarea
                  value={patientTestimonial}
                  onChange={(e) => setPatientTestimonial(e.target.value)}
                  rows={3}
                  placeholder="شهادة أو رأي المريض عن التجربة..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {storyType === "MEDICAL" ? "الصور (قبل/بعد)" : "الصور (اختياري)"}
              </h2>
              {storyType === "INSPIRATIONAL" && (
                <span className="text-xs text-gray-500">
                  يمكنك إضافة صور توضيحية للقصة
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Before Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {storyType === "MEDICAL" ? "صورة قبل العلاج" : "صورة 1"}
                </label>
                {beforeImagePreview ? (
                  <div className="relative">
                    <img
                      src={beforeImagePreview}
                      alt="قبل"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleBeforeImageChange(null)}
                      className="absolute top-2 left-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">اضغط لرفع صورة</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleBeforeImageChange(e.target.files?.[0] || null)
                      }
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* After Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {storyType === "MEDICAL" ? "صورة بعد العلاج" : "صورة 2"}
                </label>
                {afterImagePreview ? (
                  <div className="relative">
                    <img
                      src={afterImagePreview}
                      alt="بعد"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleAfterImageChange(null)}
                      className="absolute top-2 left-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">اضغط لرفع صورة</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleAfterImageChange(e.target.files?.[0] || null)
                      }
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Video */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              فيديو (اختياري)
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رفع فيديو للقصة
              </label>
              {videoFile ? (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {videoFile.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setVideoFile(null)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      اضغط لرفع فيديو (اختياري)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              إعدادات العرض
            </h2>

            <div className="space-y-4">
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
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/success-stories")}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isSaving} variant="primary">
              <Save className="w-4 h-4 ml-2" />
              {isSaving ? "جاري الحفظ..." : "إنشاء قصة النجاح"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
