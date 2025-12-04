// src/app/(dashboard)/dashboard/products/[id]/view/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { productsApi } from "@/lib/api/products";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  Edit,
  Package,
  DollarSign,
  Eye,
  EyeOff,
  Star,
  Folder,
  Tag,
} from "lucide-react";
import type { Product } from "@/types/product";
import { getImageUrl } from "@/lib/utils/imageUrl";

export default function ViewProductPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    loadProduct();
  }, [params.id]);

  const loadProduct = async () => {
    try {
      setIsLoading(true);
      const data = await productsApi.getOne(params.id);
      setProduct(data);

      // Set primary image or first image as selected
      const primaryImage = data.images?.find((img) => img.isPrimary);
      const firstImage = data.images?.[0];
      if (primaryImage) {
        setSelectedImage(getImageUrl(primaryImage.imageUrl));
      } else if (firstImage) {
        setSelectedImage(getImageUrl(firstImage.imageUrl));
      }
    } catch (error: any) {
      toast.error("فشل تحميل المنتج");
      router.push("/dashboard/products");
    } finally {
      setIsLoading(false);
    }
  };

  const getProductTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      PROSTHETIC: "طرف صناعي",
      ORTHOTIC: "جهاز تقويمي",
      ACCESSORY: "إكسسوار",
      OTHER: "أخرى",
    };
    return labels[type] || type;
  };

  const formatPrice = (price?: number) => {
    if (!price) return "غير محدد";
    return `${price.toLocaleString("ar-SA")} $`;
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
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard/products")}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600 mt-1">عرض تفاصيل المنتج</p>
          </div>
        </div>
        <Button
          variant="primary"
          onClick={() => router.push(`/dashboard/products/${product.id}`)}
        >
          <Edit className="w-4 h-4 ml-2" />
          تعديل المنتج
        </Button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Images */}
        <div className="lg:col-span-2 space-y-4">
          {/* Main Image */}
          {selectedImage && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          {/* Thumbnail Gallery */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(getImageUrl(image.imageUrl))}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === getImageUrl(image.imageUrl)
                      ? "border-primary-500 ring-2 ring-primary-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={getImageUrl(image.imageUrl)}
                    alt={image.altText || product.name}
                    className="w-full h-24 object-cover"
                  />
                  {image.isPrimary && (
                    <div className="absolute top-1 right-1 bg-yellow-500 text-white p-1 rounded">
                      <Star className="w-3 h-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                الوصف
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          )}

          {/* Specifications */}
          {product.specifications && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                المواصفات التقنية
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {product.specifications}
              </p>
            </div>
          )}

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                الميزات
              </h2>
              <div className="space-y-2">
                {product.features
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map((feature) => (
                    <div
                      key={feature.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                      <span className="text-gray-700 flex-1">
                        {feature.featureText}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Info Cards */}
        <div className="space-y-4">
          {/* Status Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">الحالة</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">الحالة</span>
                {product.isActive ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Eye className="w-3 h-3" />
                    نشط
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    <EyeOff className="w-3 h-3" />
                    غير نشط
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">عرض السعر</span>
                {product.isPriceVisible ? (
                  <span className="text-xs font-medium text-green-600">نعم</span>
                ) : (
                  <span className="text-xs font-medium text-gray-500">لا</span>
                )}
              </div>
            </div>
          </div>

          {/* Product Info Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">
              معلومات المنتج
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Package className="w-4 h-4" />
                  <span className="text-sm">النوع</span>
                </div>
                <p className="text-sm font-medium text-gray-900 mr-6">
                  {getProductTypeLabel(product.productType)}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Folder className="w-4 h-4" />
                  <span className="text-sm">الفئة</span>
                </div>
                <p className="text-sm font-medium text-gray-900 mr-6">
                  {product.category?.name || "غير محدد"}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Tag className="w-4 h-4" />
                  <span className="text-sm">Slug</span>
                </div>
                <p className="text-sm font-mono text-gray-900 mr-6">
                  {product.slug}
                </p>
              </div>

              {product.price && (
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">السعر</span>
                  </div>
                  <p className="text-lg font-bold text-primary-900 mr-6">
                    {formatPrice(product.price)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Statistics Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">
              الإحصائيات
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">عدد الميزات</span>
                <span className="text-lg font-bold text-gray-900">
                  {product.features?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">عدد الصور</span>
                <span className="text-lg font-bold text-gray-900">
                  {product.images?.length || 0}
                </span>
              </div>
            </div>
          </div>

          {/* SEO Info Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">
              معلومات SEO
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-600">العنوان</span>
                <p className="text-sm text-gray-900 mt-1">
                  {product.metaTitle || product.name}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-600">الوصف</span>
                <p className="text-sm text-gray-900 mt-1 line-clamp-3">
                  {product.metaDescription || product.description || "غير محدد"}
                </p>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">التواريخ</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">تاريخ الإنشاء:</span>
                <p className="text-gray-900">
                  {new Date(product.createdAt).toLocaleDateString("ar-SA")}
                </p>
              </div>
              <div>
                <span className="text-gray-600">آخر تحديث:</span>
                <p className="text-gray-900">
                  {new Date(product.updatedAt).toLocaleDateString("ar-SA")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
