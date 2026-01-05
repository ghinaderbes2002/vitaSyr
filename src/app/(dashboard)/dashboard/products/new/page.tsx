// src/app/(dashboard)/dashboard/products/new/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { productsApi, categoriesApi } from "@/lib/api/products";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Save, Upload, Play, Star } from "lucide-react";
import type { ProductCategory } from "@/types/product";

export default function NewProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [productType, setProductType] = useState("أطراف صناعية");
  const [description, setDescription] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [price, setPrice] = useState("");
  const [isPriceVisible, setIsPriceVisible] = useState(true);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Video states
  const [videos, setVideos] = useState<Array<{ file: File; isPrimary: boolean }>>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
      if (data.length > 0) {
        setCategoryId(data[0].id);
      }
    } catch (error: any) {
      toast.error("فشل تحميل الفئات");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !slug.trim() || !categoryId) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      setIsSaving(true);

      const productData: any = {
        categoryId,
        name: name.trim(),
        slug: slug.trim(),
        productType,
        metaTitle: metaTitle.trim() || name.trim(),
        metaDescription: metaDescription.trim() || description.trim() || name.trim(),
        isPriceVisible,
        isActive,
      };

      if (description.trim()) {
        productData.description = description.trim();
      }

      if (specifications.trim()) {
        productData.specifications = specifications.trim();
      }

      if (price && !isNaN(Number(price))) {
        productData.price = Number(price);
      }

      console.log("Creating product with data:", productData);

      const newProduct = await productsApi.create(productData);

      // Upload videos if any
      if (videos.length > 0) {
        for (const video of videos) {
          try {
            const formData = new FormData();
            formData.append("video", video.file);
            formData.append("isPrimary", video.isPrimary.toString());

            await productsApi.addVideo(newProduct.id, formData as any);
          } catch (error) {
            console.error("Error uploading video:", error);
            toast.error(`فشل رفع الفيديو: ${video.file.name}`);
          }
        }
      }

      toast.success("تم إنشاء المنتج بنجاح");
      router.push(`/dashboard/products/${newProduct.id}`);
    } catch (error: any) {
      console.error("Error creating product:", error);
      console.error("Error response:", error.response?.data);
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "فشل إنشاء المنتج"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setName(value);
    if (!slug) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\u0600-\u06FFa-z0-9-]/g, "");
      setSlug(generatedSlug);
    }
  };

  // Video management functions
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("الرجاء اختيار ملف فيديو صحيح");
      return;
    }

    setVideos([...videos, { file, isPrimary: videos.length === 0 }]);
    toast.success("تم إضافة الفيديو");
    e.target.value = "";
  };

  const handleRemoveVideo = (index: number) => {
    const updatedVideos = videos.filter((_, i) => i !== index);
    // If we removed the primary video, make the first one primary
    if (updatedVideos.length > 0 && videos[index].isPrimary) {
      updatedVideos[0].isPrimary = true;
    }
    setVideos(updatedVideos);
    toast.success("تم حذف الفيديو");
  };

  const handleSetPrimaryVideo = (index: number) => {
    const updatedVideos = videos.map((v, i) => ({
      ...v,
      isPrimary: i === index
    }));
    setVideos(updatedVideos);
    toast.success("تم تعيين الفيديو كأساسي");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/dashboard/products")}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إضافة منتج جديد</h1>
          <p className="text-gray-600 mt-1">أضف منتج جديد إلى المركز</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم المنتج *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
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
                    مثال: <span className="font-mono bg-blue-100 px-1 rounded">prosthetic-leg-advanced</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الفئة *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">اختر الفئة</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع المنتج *
                </label>

                <input
                  type="text"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  placeholder="اكتب نوع المنتج"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المواصفات
              </label>
              <textarea
                value={specifications}
                onChange={(e) => setSpecifications(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="أدخل المواصفات التقنية للمنتج..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  السعر ($)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div className="flex items-center gap-4 pt-8">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPriceVisible"
                    checked={isPriceVisible}
                    onChange={(e) => setIsPriceVisible(e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label
                    htmlFor="isPriceVisible"
                    className="text-sm font-medium text-gray-700"
                  >
                    عرض السعر
                  </label>
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
                  placeholder={name || "عنوان SEO"}
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

            {/* Video Section */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">الفيديوهات</h3>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  <span className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border bg-white text-gray-700 border-gray-300 hover:bg-gray-50 transition-colors">
                    <Upload className="w-4 h-4 ml-2" />
                    رفع فيديو
                  </span>
                </label>
              </div>

              <div className="space-y-4">
                {/* Videos List */}
                {videos.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      الفيديوهات المضافة ({videos.length})
                    </p>
                    {videos.map((video, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-3 p-3 border rounded-lg ${
                          video.isPrimary ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                        }`}
                      >
                        <Play className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 truncate">
                            {video.file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(video.file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                          {video.isPrimary && (
                            <span className="text-xs text-primary-600 font-medium flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              فيديو أساسي
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {!video.isPrimary && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryVideo(index)}
                              className="px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            >
                              جعله أساسي
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveVideo(index)}
                            className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8 text-sm">
                    لم يتم إضافة فيديوهات بعد
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/products")}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={isSaving} variant="primary">
                <Save className="w-4 h-4 ml-2" />
                {isSaving ? "جاري الحفظ..." : "إنشاء المنتج"}
              </Button>
            </div>
          </div>
        </div>
      </form>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>ملاحظة:</strong> بعد إنشاء المنتج، يمكنك إضافة الميزات والصور
          من صفحة التعديل.
        </p>
      </div>
    </div>
  );
}
