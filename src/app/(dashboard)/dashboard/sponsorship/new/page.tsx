// src/app/(dashboard)/dashboard/sponsorship/new/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Upload, X, Save, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { sponsorshipCasesApi } from "@/lib/api/sponsorship";
import { Button } from "@/components/ui/Button";
import type { SponsorshipStatus } from "@/types/sponsorship";

export default function NewSponsorshipPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [caseDescription, setCaseDescription] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [status, setStatus] = useState<SponsorshipStatus>("ONGOING");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  // Image State
  const [caseImage, setCaseImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Video State
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCaseImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setCaseImage(null);
    setImagePreview(null);
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!patientName.trim()) {
      toast.error("يرجى إدخال اسم المريض");
      return;
    }

    if (!age || Number(age) <= 0) {
      toast.error("يرجى إدخال عمر صحيح");
      return;
    }

    if (!caseDescription.trim()) {
      toast.error("يرجى إدخال وصف الحالة");
      return;
    }

    if (!estimatedCost || Number(estimatedCost) <= 0) {
      toast.error("يرجى إدخال التكلفة التقديرية");
      return;
    }

    if (!targetAmount || Number(targetAmount) <= 0) {
      toast.error("يرجى إدخال المبلغ المستهدف");
      return;
    }

    if (!startDate) {
      toast.error("يرجى إدخال تاريخ البداية");
      return;
    }

    if (!endDate) {
      toast.error("يرجى إدخال تاريخ النهاية");
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      toast.error("تاريخ النهاية يجب أن يكون بعد تاريخ البداية");
      return;
    }

    if (!caseImage) {
      toast.error("يرجى اختيار صورة الحالة");
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("patientName", patientName.trim());
      formData.append("age", age);
      formData.append("caseDescription", caseDescription.trim());
      formData.append("estimatedCost", estimatedCost);
      formData.append("targetAmount", targetAmount);
      formData.append("status", status);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      formData.append("isFeatured", String(isFeatured));

      if (caseImage) {
        formData.append("caseImage", caseImage);
      }

      if (videoFile) {
        formData.append("videoUrl", videoFile);
      }

      await sponsorshipCasesApi.create(formData);
      toast.success("تم إضافة الحالة بنجاح");
      router.push("/dashboard/sponsorship");
    } catch (error: any) {
      toast.error(error.message || "فشل إضافة الحالة");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إضافة حالة كفالة جديدة</h1>
          <p className="text-gray-600 mt-1">املأ البيانات لإضافة حالة كفالة جديدة</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Patient Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات المريض</h3>
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
                  placeholder="اسم المريض الكامل"
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
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="العمر بالسنوات"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف الحالة *
              </label>
              <textarea
                value={caseDescription}
                onChange={(e) => setCaseDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="وصف تفصيلي عن حالة المريض..."
              />
            </div>
          </div>

          {/* Financial Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">المعلومات المالية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التكلفة التقديرية *
                </label>
                <input
                  type="number"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المبلغ المستهدف *
                </label>
                <input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Case Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات الحالة</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحالة *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as SponsorshipStatus)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="ONGOING">جارية</option>
                  <option value="COMPLETED">مكتملة</option>
                  <option value="CANCELLED">ملغية</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاريخ البداية *
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاريخ النهاية *
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">حالة مميزة</span>
              </label>
            </div>
          </div>

          {/* Media */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">الوسائط</h3>

            {/* Case Image */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                صورة الحالة *
              </label>
              {imagePreview ? (
                <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200">
                  <Image
                    src={imagePreview}
                    alt="معاينة"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">اضغط لاختيار صورة</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Video (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                فيديو الحالة (اختياري)
              </label>
              {videoPreview ? (
                <div className="relative w-full rounded-lg overflow-hidden border-2 border-gray-200">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full h-64 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeVideo}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">اضغط لاختيار فيديو</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 ml-2" />
                  حفظ الحالة
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              إلغاء
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
