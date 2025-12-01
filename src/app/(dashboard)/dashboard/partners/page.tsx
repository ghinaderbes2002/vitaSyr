// src/app/(dashboard)/dashboard/partners/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";
import { toast } from "react-hot-toast";
import { partnersApi } from "@/lib/api/partners";
import { Button } from "@/components/ui/Button";
import type { Partner } from "@/types/partner";
import { getImageUrl } from "@/lib/utils/imageUrl";

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      setIsLoading(true);
      const data = await partnersApi.getAll();
      setPartners(data);
    } catch (error: any) {
      toast.error("فشل تحميل الشركاء");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الشريك؟")) return;

    try {
      await partnersApi.delete(id);
      toast.success("تم حذف الشريك بنجاح");
      loadPartners();
    } catch (error) {
      toast.error("فشل حذف الشريك");
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الشركاء</h1>
          <p className="text-gray-600 mt-1">إدارة شركاء ومتعاونين المؤسسة</p>
        </div>
        <Link href="/dashboard/partners/new">
          <Button variant="primary">
            <Plus className="w-5 h-5 ml-2" />
            إضافة شريك جديد
          </Button>
        </Link>
      </div>

      {/* Partners Grid */}
      {partners.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">لا يوجد شركاء حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Logo */}
              <div className="relative h-40 bg-gray-50 flex items-center justify-center p-6">
                <img
                  src={getImageUrl(partner.logoUrl)}
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain"
                />
                {!partner.isActive && (
                  <div className="absolute top-2 left-2 bg-gray-500 text-white px-2 py-1 rounded text-xs font-medium">
                    غير نشط
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                  {partner.name}
                </h3>

                {partner.website && (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mb-3"
                  >
                    <ExternalLink className="w-3 h-3" />
                    زيارة الموقع
                  </a>
                )}

                {/* Status */}
                <div className="flex items-center gap-2 mb-3 pt-2 border-t">
                  {partner.isActive ? (
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
              </div>

              {/* Card Footer */}
              <div className="bg-gray-50 px-4 py-3 flex items-center gap-2">
                <Link href={`/dashboard/partners/${partner.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="w-4 h-4 ml-2" />
                    تعديل
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(partner.id)}
                  className="text-red-600 hover:bg-red-50 border-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
