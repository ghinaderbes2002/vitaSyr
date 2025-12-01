// src/app/(dashboard)/dashboard/services/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { servicesApi } from "@/lib/api/services";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Plus, Edit2, Trash2, Save, Upload, X } from "lucide-react";
import type { Service, ServiceFeature, ServiceBenefit, ServiceImage } from "@/types/service";
import { getImageUrl } from "@/lib/utils/imageUrl";

export default function ServiceEditPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Basic Info State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [serviceType, setServiceType] = useState("PROSTHETICS");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Features State
  const [features, setFeatures] = useState<ServiceFeature[]>([]);
  const [newFeature, setNewFeature] = useState({ title: "", description: "" });
  const [editingFeature, setEditingFeature] = useState<string | null>(null);

  // Benefits State
  const [benefits, setBenefits] = useState<ServiceBenefit[]>([]);
  const [newBenefit, setNewBenefit] = useState("");
  const [editingBenefit, setEditingBenefit] = useState<string | null>(null);

  // Images State
  const [images, setImages] = useState<ServiceImage[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadService();
  }, [serviceId]);

  const loadService = async () => {
    try {
      setIsLoading(true);
      const data = await servicesApi.getOne(serviceId);
      setService(data);

      // Set basic info
      setTitle(data.title);
      setSlug(data.slug);
      setDescription(data.description || "");
      setServiceType(data.serviceType);
      setMetaTitle(data.metaTitle);
      setMetaDescription(data.metaDescription);
      setIsActive(data.isActive);

      // Set features, benefits, images
      setFeatures(data.features || []);
      setBenefits(data.benefits || []);
      setImages(data.images || []);
    } catch (error: any) {
      toast.error("فشل تحميل الخدمة");
      router.push("/dashboard/services");
    } finally {
      setIsLoading(false);
    }
  };

  // Basic Info Functions
  const handleSaveBasicInfo = async () => {
    try {
      setIsSaving(true);

      const updateData: any = {
        title: title.trim(),
        slug: slug.trim(),
        serviceType,
        metaTitle: metaTitle.trim(),
        metaDescription: metaDescription.trim(),
        isActive,
      };

      // Add description only if not empty
      if (description.trim()) {
        updateData.description = description.trim();
      }

      console.log("Updating service with data:", updateData);

      await servicesApi.update(serviceId, updateData);
      toast.success("تم حفظ التعديلات بنجاح");
      loadService();
    } catch (error: any) {
      console.error("Error updating service:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.error || error.response?.data?.message || "فشل حفظ التعديلات");
    } finally {
      setIsSaving(false);
    }
  };

  // Features Functions
  const handleAddFeature = async () => {
    if (!newFeature.title.trim() || !newFeature.description.trim()) {
      toast.error("الرجاء ملء جميع حقول الميزة");
      return;
    }

    try {
      await servicesApi.addFeature(serviceId, {
        ...newFeature,
        orderIndex: features.length,
      });
      toast.success("تمت إضافة الميزة بنجاح");
      setNewFeature({ title: "", description: "" });
      loadService();
    } catch (error: any) {
      toast.error("فشل إضافة الميزة");
    }
  };

  const handleUpdateFeature = async (featureId: string, updates: any) => {
    try {
      await servicesApi.updateFeature(serviceId, featureId, updates);
      toast.success("تم تحديث الميزة بنجاح");
      setEditingFeature(null);
      loadService();
    } catch (error: any) {
      toast.error("فشل تحديث الميزة");
    }
  };

  const handleDeleteFeature = async (featureId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الميزة؟")) return;

    try {
      await servicesApi.deleteFeature(serviceId, featureId);
      toast.success("تم حذف الميزة بنجاح");
      loadService();
    } catch (error: any) {
      toast.error("فشل حذف الميزة");
    }
  };

  // Benefits Functions
  const handleAddBenefit = async () => {
    if (!newBenefit.trim()) {
      toast.error("الرجاء كتابة نص الفائدة");
      return;
    }

    try {
      await servicesApi.addBenefit(serviceId, {
        benefitText: newBenefit,
        orderIndex: benefits.length,
      });
      toast.success("تمت إضافة الفائدة بنجاح");
      setNewBenefit("");
      loadService();
    } catch (error: any) {
      toast.error("فشل إضافة الفائدة");
    }
  };

  const handleUpdateBenefit = async (benefitId: string, benefitText: string) => {
    try {
      await servicesApi.updateBenefit(serviceId, benefitId, { benefitText });
      toast.success("تم تحديث الفائدة بنجاح");
      setEditingBenefit(null);
      loadService();
    } catch (error: any) {
      toast.error("فشل تحديث الفائدة");
    }
  };

  const handleDeleteBenefit = async (benefitId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الفائدة؟")) return;

    try {
      await servicesApi.deleteBenefit(serviceId, benefitId);
      toast.success("تم حذف الفائدة بنجاح");
      loadService();
    } catch (error: any) {
      toast.error("فشل حذف الفائدة");
    }
  };

  // Images Functions
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("الرجاء اختيار صورة صالحة");
      return;
    }

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("image", file);

      await servicesApi.addImage(serviceId, formData);
      toast.success("تم رفع الصورة بنجاح");
      loadService();
    } catch (error: any) {
      toast.error("فشل رفع الصورة");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الصورة؟")) return;

    try {
      await servicesApi.deleteImage(serviceId, imageId);
      toast.success("تم حذف الصورة بنجاح");
      loadService();
    } catch (error: any) {
      toast.error("فشل حذف الصورة");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard/services")}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">تعديل الخدمة</h1>
            <p className="text-gray-600 mt-1">{title}</p>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">المعلومات الأساسية</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                العنوان *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
              />
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
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="PROSTHETICS">الأطراف الصناعية</option>
                <option value="PHYSIOTHERAPY">العلاج الفيزيائي</option>
                <option value="FOOT_BALANCE">تحليل القدم</option>
                <option value="OTHER">أخرى</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-8">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={handleSaveBasicInfo}
              disabled={isSaving}
              variant="primary"
            >
              <Save className="w-4 h-4 ml-2" />
              {isSaving ? "جاري الحفظ..." : "حفظ التعديلات"}
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">الميزات</h2>

        {/* Add New Feature */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-3">إضافة ميزة جديدة</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="عنوان الميزة"
              value={newFeature.title}
              onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <textarea
              placeholder="وصف الميزة"
              value={newFeature.description}
              onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <Button onClick={handleAddFeature} size="sm" variant="primary">
              <Plus className="w-4 h-4 ml-2" />
              إضافة الميزة
            </Button>
          </div>
        </div>

        {/* Features List */}
        <div className="space-y-3">
          {features.length === 0 ? (
            <p className="text-gray-500 text-center py-4">لا توجد ميزات</p>
          ) : (
            features.map((feature) => (
              <div key={feature.id} className="p-4 border border-gray-200 rounded-lg">
                {editingFeature === feature.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      defaultValue={feature.title}
                      id={`feature-title-${feature.id}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <textarea
                      defaultValue={feature.description}
                      id={`feature-desc-${feature.id}`}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          const titleInput = document.getElementById(`feature-title-${feature.id}`) as HTMLInputElement;
                          const descInput = document.getElementById(`feature-desc-${feature.id}`) as HTMLTextAreaElement;
                          handleUpdateFeature(feature.id, {
                            title: titleInput.value,
                            description: descInput.value,
                          });
                        }}
                      >
                        حفظ
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingFeature(null)}
                      >
                        إلغاء
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{feature.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingFeature(feature.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFeature(feature.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">الفوائد</h2>

        {/* Add New Benefit */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-3">إضافة فائدة جديدة</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="نص الفائدة"
              value={newBenefit}
              onChange={(e) => setNewBenefit(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <Button onClick={handleAddBenefit} size="sm" variant="primary">
              <Plus className="w-4 h-4 ml-2" />
              إضافة
            </Button>
          </div>
        </div>

        {/* Benefits List */}
        <div className="space-y-2">
          {benefits.length === 0 ? (
            <p className="text-gray-500 text-center py-4">لا توجد فوائد</p>
          ) : (
            benefits.map((benefit) => (
              <div key={benefit.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                {editingBenefit === benefit.id ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      defaultValue={benefit.benefitText}
                      id={`benefit-${benefit.id}`}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-lg"
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        const input = document.getElementById(`benefit-${benefit.id}`) as HTMLInputElement;
                        handleUpdateBenefit(benefit.id, input.value);
                      }}
                    >
                      حفظ
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingBenefit(null)}
                    >
                      إلغاء
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="text-gray-900">{benefit.benefitText}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingBenefit(benefit.id)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBenefit(benefit.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Images Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">الصور</h2>

        {/* Upload Image */}
        <div className="mb-6">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                {uploadingImage ? "جاري الرفع..." : "اضغط لرفع صورة"}
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
            />
          </label>
        </div>

        {/* Images Grid */}
        {images.length === 0 ? (
          <p className="text-gray-500 text-center py-4">لا توجد صور</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={getImageUrl(image.imageUrl)}
                  alt={image.altText || "Service image"}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => handleDeleteImage(image.id)}
                  className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
