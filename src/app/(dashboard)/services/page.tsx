// src/app/(dashboard)/dashboard/services/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import { servicesApi } from "@/lib/api/services";
import { Button } from "@/components/ui/Button";
import type { Service } from "@/types/service";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      const data = await servicesApi.getAll();
      setServices(data);
    } catch (error: any) {
      toast.error("فشل تحميل الخدمات");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الخدمة؟")) return;

    try {
      await servicesApi.delete(id);
      toast.success("تم حذف الخدمة بنجاح");
      loadServices();
    } catch (error) {
      toast.error("فشل حذف الخدمة");
    }
  };

  const getServiceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      PROSTHETICS: "الأطراف الصناعية",
      PHYSIOTHERAPY: "العلاج الفيزيائي",
      FOOT_BALANCE: "تحليل القدم",
      OTHER: "أخرى",
    };
    return labels[type] || type;
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
          <h1 className="text-2xl font-bold text-gray-900">الخدمات</h1>
          <p className="text-gray-600 mt-1">إدارة خدمات المركز</p>
        </div>
        <Link href="/dashboard/services/new">
          <Button variant="primary">
            <Plus className="w-5 h-5 ml-2" />
            إضافة خدمة جديدة
          </Button>
        </Link>
      </div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">لا توجد خدمات حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Card Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {service.title}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {getServiceTypeLabel(service.serviceType)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    {service.isActive ? (
                      <Eye className="w-5 h-5 text-green-600" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {service.description || "لا يوجد وصف"}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
                  <span>{service.features?.length || 0} ميزة</span>
                  <span>{service.benefits?.length || 0} فائدة</span>
                  <span>{service.images?.length || 0} صورة</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="bg-gray-50 px-6 py-3 flex items-center gap-2">
                <Link
                  href={`/dashboard/services/${service.id}`}
                  className="flex-1"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="w-4 h-4 ml-2" />
                    تعديل
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(service.id)}
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


