// src/app/(dashboard)/dashboard/products/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { productsApi, categoriesApi } from "@/lib/api/products";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  Save,
  Plus,
  Trash2,
  Upload,
  Star,
  Edit2,
  X,
} from "lucide-react";
import type { Product, ProductCategory } from "@/types/product";
import { getImageUrl } from "@/lib/utils/imageUrl";

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Basic info state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [productType, setProductType] = useState("PROSTHETIC");
  const [description, setDescription] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [price, setPrice] = useState("");
  const [isPriceVisible, setIsPriceVisible] = useState(true);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Features state
  const [showFeatureForm, setShowFeatureForm] = useState(false);
  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null);
  const [featureText, setFeatureText] = useState("");
  const [featureOrder, setFeatureOrder] = useState("0");

  // Images state
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadProduct();
    loadCategories();
  }, [params.id]);

  const loadProduct = async () => {
    try {
      setIsLoading(true);
      const data = await productsApi.getOne(params.id);
      setProduct(data);

      // Populate form fields
      setName(data.name);
      setSlug(data.slug);
      setCategoryId(data.categoryId);
      setProductType(data.productType);
      setDescription(data.description || "");
      setSpecifications(data.specifications || "");
      setPrice(data.price?.toString() || "");
      setIsPriceVisible(data.isPriceVisible);
      setMetaTitle(data.metaTitle || "");
      setMetaDescription(data.metaDescription || "");
      setIsActive(data.isActive);
    } catch (error: any) {
      toast.error("فشل تحميل المنتج");
      router.push("/dashboard/products");
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (error: any) {
      toast.error("فشل تحميل الفئات");
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !slug.trim() || !categoryId) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      setIsSaving(true);

      const updateData: any = {
        categoryId,
        name: name.trim(),
        slug: slug.trim(),
        productType,
        metaTitle: metaTitle.trim() || name.trim(),
        metaDescription:
          metaDescription.trim() || description.trim() || name.trim(),
        isPriceVisible,
        isActive,
      };

      if (description.trim()) {
        updateData.description = description.trim();
      }

      if (specifications.trim()) {
        updateData.specifications = specifications.trim();
      }

      if (price && !isNaN(Number(price))) {
        updateData.price = Number(price);
      }

      await productsApi.update(params.id, updateData);
      toast.success("تم تحديث المنتج بنجاح");
      loadProduct();
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "فشل تحديث المنتج"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // === Features Management ===

  const handleAddFeature = () => {
    setShowFeatureForm(true);
    setEditingFeatureId(null);
    setFeatureText("");
    setFeatureOrder("0");
  };

  const handleEditFeature = (feature: any) => {
    setShowFeatureForm(true);
    setEditingFeatureId(feature.id);
    setFeatureText(feature.featureText);
    setFeatureOrder(feature.orderIndex.toString());
  };

  const handleSaveFeature = async () => {
    if (!featureText.trim()) {
      toast.error("الرجاء إدخال نص الميزة");
      return;
    }

    try {
      const featureData = {
        featureText: featureText.trim(),
        orderIndex: Number(featureOrder),
      };

      if (editingFeatureId) {
        await productsApi.updateFeature(params.id, editingFeatureId, featureData);
        toast.success("تم تحديث الميزة بنجاح");
      } else {
        await productsApi.addFeature(params.id, featureData);
        toast.success("تمت إضافة الميزة بنجاح");
      }

      setShowFeatureForm(false);
      setEditingFeatureId(null);
      setFeatureText("");
      setFeatureOrder("0");
      loadProduct();
    } catch (error: any) {
      toast.error("فشل حفظ الميزة");
    }
  };

  const handleDeleteFeature = async (featureId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الميزة؟")) return;

    try {
      await productsApi.deleteFeature(params.id, featureId);
      toast.success("تم حذف الميزة بنجاح");
      loadProduct();
    } catch (error: any) {
      toast.error("فشل حذف الميزة");
    }
  };

  // === Images Management ===

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("الرجاء اختيار صورة صحيحة");
      return;
    }

    try {
      setUploadingImage(true);

      const formData = new FormData();
      formData.append("image", file);

      await productsApi.addImage(params.id, formData);
      toast.success("تم رفع الصورة بنجاح");
      loadProduct();
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error("فشل رفع الصورة");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الصورة؟")) return;

    try {
      await productsApi.deleteImage(params.id, imageId);
      toast.success("تم حذف الصورة بنجاح");
      loadProduct();
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

  if (!product) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/dashboard/products")}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">تعديل المنتج</h1>
          <p className="text-gray-600 mt-1">{product.name}</p>
        </div>
      </div>

      {/* Basic Info Form */}
      <form onSubmit={handleUpdateProduct}>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            المعلومات الأساسية
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم المنتج *
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
                  Slug *
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
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
                {isSaving ? "جاري الحفظ..." : "حفظ التعديلات"}
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Features Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">الميزات</h2>
          <Button variant="outline" size="sm" onClick={handleAddFeature}>
            <Plus className="w-4 h-4 ml-2" />
            إضافة ميزة
          </Button>
        </div>

        {showFeatureForm && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نص الميزة
                </label>
                <input
                  type="text"
                  value={featureText}
                  onChange={(e) => setFeatureText(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="أدخل نص الميزة..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الترتيب
                </label>
                <input
                  type="number"
                  value={featureOrder}
                  onChange={(e) => setFeatureOrder(e.target.value)}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowFeatureForm(false);
                    setEditingFeatureId(null);
                    setFeatureText("");
                    setFeatureOrder("0");
                  }}
                >
                  <X className="w-4 h-4 ml-2" />
                  إلغاء
                </Button>
                <Button variant="primary" size="sm" onClick={handleSaveFeature}>
                  <Save className="w-4 h-4 ml-2" />
                  حفظ
                </Button>
              </div>
            </div>
          </div>
        )}

        {product.features && product.features.length > 0 ? (
          <div className="space-y-2">
            {product.features
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((feature) => (
                <div
                  key={feature.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                      #{feature.orderIndex}
                    </span>
                    <span className="text-sm text-gray-900">
                      {feature.featureText}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditFeature(feature)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteFeature(feature.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">لا توجد ميزات</p>
        )}
      </div>

      {/* Images Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">الصور</h2>
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

        {product.images && product.images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {product.images.map((image) => (
              <div
                key={image.id}
                className="relative group rounded-lg overflow-hidden border border-gray-200"
              >
                <img
                  src={getImageUrl(image.imageUrl)}
                  alt={image.altText || product.name}
                  className="w-full h-40 object-cover"
                />
                {image.isPrimary && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    رئيسية
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">لا توجد صور</p>
        )}
      </div>
    </div>
  );
}
