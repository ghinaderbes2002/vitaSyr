// src/app/(dashboard)/dashboard/services/[id]/view/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { servicesApi } from "@/lib/api/services";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Edit, Eye, EyeOff } from "lucide-react";
import type { Service } from "@/types/service";
import { getImageUrl } from "@/lib/utils/imageUrl";

export default function ServiceViewPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadService();
  }, [serviceId]);

  const loadService = async () => {
    try {
      setIsLoading(true);
      const data = await servicesApi.getOne(serviceId);
      setService(data);
    } catch (error: any) {
      toast.error("فشل تحميل الخدمة");
      router.push("/dashboard/services");
    } finally {
      setIsLoading(false);
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

  if (!service) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">لم يتم العثور على الخدمة</p>
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
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{service.title}</h1>
              {service.isActive ? (
                <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  <Eye className="w-4 h-4" />
                  نشط
                </span>
              ) : (
                <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                  <EyeOff className="w-4 h-4" />
                  غير نشط
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-600">{getServiceTypeLabel(service.serviceType)}</span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-600 font-mono">{service.slug}</span>
            </div>
          </div>
        </div>
        <Button
          onClick={() => router.push(`/dashboard/services/${service.id}`)}
          variant="primary"
        >
          <Edit className="w-4 h-4 ml-2" />
          تعديل الخدمة
        </Button>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">المعلومات الأساسية</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">العنوان</label>
            <p className="text-gray-900 mt-1">{service.title}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">الوصف</label>
            <p className="text-gray-900 mt-1">{service.description || "لا يوجد وصف"}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">نوع الخدمة</label>
              <p className="text-gray-900 mt-1">{getServiceTypeLabel(service.serviceType)}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Slug</label>
              <p className="text-gray-900 mt-1 font-mono text-sm">{service.slug}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <label className="text-sm font-medium text-gray-500">عنوان SEO</label>
              <p className="text-gray-900 mt-1">{service.metaTitle}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">وصف SEO</label>
              <p className="text-gray-900 mt-1 text-sm">{service.metaDescription}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t text-sm">
            <div>
              <label className="text-sm font-medium text-gray-500">تاريخ الإنشاء</label>
              <p className="text-gray-900 mt-1">
                {new Date(service.createdAt).toLocaleDateString('ar-SA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">آخر تحديث</label>
              <p className="text-gray-900 mt-1">
                {new Date(service.updatedAt).toLocaleDateString('ar-SA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          الميزات ({service.features?.length || 0})
        </h2>

        {!service.features || service.features.length === 0 ? (
          <p className="text-gray-500 text-center py-8">لا توجد ميزات</p>
        ) : (
          <div className="space-y-3">
            {service.features.map((feature, index) => (
              <div key={feature.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-900 rounded-full font-semibold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Benefits */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          الفوائد ({service.benefits?.length || 0})
        </h2>

        {!service.benefits || service.benefits.length === 0 ? (
          <p className="text-gray-500 text-center py-8">لا توجد فوائد</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {service.benefits.map((benefit) => (
              <div key={benefit.id} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-900 flex-1">{benefit.benefitText}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Images */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          الصور ({service.images?.length || 0})
        </h2>

        {!service.images || service.images.length === 0 ? (
          <p className="text-gray-500 text-center py-8">لا توجد صور</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {service.images.map((image) => (
              <div key={image.id} className="group relative">
                <img
                  src={getImageUrl(image.imageUrl)}
                  alt={image.altText || service.title}
                  className="w-full h-40 object-cover rounded-lg border border-gray-200"
                />
                {image.altText && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    {image.altText}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
