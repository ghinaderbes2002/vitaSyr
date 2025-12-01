// src/app/(dashboard)/dashboard/partners/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { partnersApi } from "@/lib/api/partners";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Save, Upload } from "lucide-react";
import type { Partner } from "@/types/partner";
import { getImageUrl } from "@/lib/utils/imageUrl";

export default function EditPartnerPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  useEffect(() => {
    loadPartner();
  }, [params.id]);

  const loadPartner = async () => {
    try {
      setIsLoading(true);
      const data = await partnersApi.getOne(params.id);
      setPartner(data);

      // Populate form fields
      setName(data.name);
      setWebsite(data.website || "");
      setIsActive(data.isActive);
      setLogoPreview(getImageUrl(data.logoUrl));
    } catch (error: any) {
      toast.error("فشل تحميل بيانات الشريك");
      router.push("/dashboard/partners");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("الرجاء اختيار صورة صحيحة");
      return;
    }

    setLogoFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("الرجاء إدخال اسم الشريك");
      return;
    }

    try {
      setIsSaving(true);

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("isActive", isActive.toString());

      if (website.trim()) {
        formData.append("website", website.trim());
      }

      // Only append logo if a new file is selected
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      await partnersApi.update(params.id, formData);

      toast.success("تم تحديث الشريك بنجاح");
      router.push("/dashboard/partners");
    } catch (error: any) {
      console.error("Error updating partner:", error);
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "فشل تحديث الشريك"
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
      </div>
    );
  }

  if (!partner) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/dashboard/partners")}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">تعديل الشريك</h1>
          <p className="text-gray-600 mt-1">{partner.name}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم الشريك *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الموقع الإلكتروني
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                شعار الشريك
              </label>

              <div className="space-y-3">
                <div className="relative w-full h-48 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center p-4">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <label className="cursor-pointer block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <span className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Upload className="w-4 h-4 ml-2" />
                    {logoFile ? "تم اختيار صورة جديدة" : "تغيير الشعار"}
                  </span>
                </label>
                {logoFile && (
                  <p className="text-xs text-gray-500">
                    سيتم استبدال الشعار الحالي بالصورة الجديدة
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label
                htmlFor="isActive"
                className="text-sm font-medium text-gray-700"
              >
                نشط
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/partners")}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={isSaving} variant="primary">
                <Save className="w-4 h-4 ml-2" />
                {isSaving ? "جاري الحفظ..." : "حفظ التعديلات"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
