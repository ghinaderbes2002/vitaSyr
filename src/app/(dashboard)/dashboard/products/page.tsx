// src/app/(dashboard)/dashboard/products/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye as EyeIcon, EyeOff, FileText, DollarSign } from "lucide-react";
import { toast } from "react-hot-toast";
import { productsApi } from "@/lib/api/products";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/types/product";
import { getImageUrl } from "@/lib/utils/imageUrl";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productsApi.getAll();
      setProducts(data);
    } catch (error: any) {
      toast.error("فشل تحميل المنتجات");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;

    try {
      await productsApi.delete(id);
      toast.success("تم حذف المنتج بنجاح");
      loadProducts();
    } catch (error) {
      toast.error("فشل حذف المنتج");
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
    return `${price.toLocaleString("ar-SA")} $ `;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المنتجات</h1>
          <p className="text-gray-600 mt-1">إدارة منتجات المركز</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button variant="primary">
            <Plus className="w-5 h-5 ml-2" />
            إضافة منتج جديد
          </Button>
        </Link>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">لا توجد منتجات حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];

            return (
              <div
                key={product.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Product Image */}
                {primaryImage && (
                  <div className="relative h-48 bg-gray-100">
                    <img
                      src={getImageUrl(primaryImage.imageUrl)}
                      alt={primaryImage.altText || product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Card Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {product.name}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {getProductTypeLabel(product.productType)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      {product.isActive ? (
                        <EyeIcon className="w-5 h-5 text-green-600" />
                      ) : (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {product.description || "لا يوجد وصف"}
                  </p>

                  {/* Price */}
                  {product.isPriceVisible && product.price && (
                    <div className="flex items-center gap-2 mb-3 text-primary-900 font-semibold">
                      <DollarSign className="w-4 h-4" />
                      {formatPrice(product.price)}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 pt-3 border-t border-gray-100 text-sm text-gray-500">
                    <span>{product.features?.length || 0} ميزة</span>
                    <span>{product.images?.length || 0} صورة</span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="bg-gray-50 px-6 py-3 flex items-center gap-2">
                  <Link
                    href={`/dashboard/products/${product.id}/view`}
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      <FileText className="w-4 h-4 ml-2" />
                      عرض
                    </Button>
                  </Link>
                  <Link href={`/dashboard/products/${product.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 ml-2" />
                      تعديل
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:bg-red-50 border-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
