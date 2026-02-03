// src/app/(dashboard)/dashboard/services/new/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { servicesApi } from "@/lib/api/services";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Save } from "lucide-react";

export default function NewServicePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !slug.trim()) {
      toast.error("الرجاء ملء الحقول المطلوبة");
      return;
    }

    try {
      setIsSaving(true);

      const serviceData: any = {
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim(),
        serviceType,
        metaTitle: metaTitle.trim() || title.trim(),
        metaDescription: metaDescription.trim() || description.trim() || title.trim(),
        isActive,
      };

      console.log("Creating service with data:", serviceData);

      const newService = await servicesApi.create(serviceData);

      toast.success("تم إنشاء الخدمة بنجاح");
      router.push(`/dashboard/services/${newService.id}`);
    } catch (error: any) {
      console.error("Error creating service:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.error || error.response?.data?.message || "فشل إنشاء الخدمة");
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\u0600-\u06FFa-z0-9-]/g, "");
      setSlug(generatedSlug);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/dashboard/services")}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إضافة خدمة جديدة</h1>
          <p className="text-gray-600 mt-1">أضف خدمة جديدة إلى المركز</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-900">
                    <strong>ما هو الـ Slug؟</strong> هو اسم مختصر يظهر داخل رابط الصفحة
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    يرجى كتابته باللغة الإنكليزية فقط، وبدون مسافات، واستخدام علامة (-) بين الكلمات.
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    مثال: <span className="font-mono bg-blue-100 px-1 rounded">prosthetic-services</span>
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الوصف
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع الخدمة *
                </label>
                <input
                  type="text"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="مثال: الأطراف الصناعية، العلاج الفيزيائي"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-8">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded-lg focus:ring-primary-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  نشط
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان SEO
                </label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder={title || "عنوان SEO"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف SEO
                </label>
                <input
                  type="text"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder={description || "وصف SEO"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/services")}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={isSaving} variant="primary">
                <Save className="w-4 h-4 ml-2" />
                {isSaving ? "جاري الحفظ..." : "إنشاء الخدمة"}
              </Button>
            </div>
          </div>
        </div>
      </form>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>ملاحظة:</strong> بعد إنشاء الخدمة، يمكنك إضافة الميزات والفوائد والصور من صفحة التعديل.
        </p>
      </div>
    </div>
  );
}
