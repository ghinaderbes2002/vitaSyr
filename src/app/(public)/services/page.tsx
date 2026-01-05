// src/app/(public)/services/page.tsx

"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { servicesApi } from "@/lib/api/services";
import { toast } from "react-hot-toast";
import {
  Activity,
  Check,
  Phone,
  ShoppingBag,
  ArrowLeft,
  Stethoscope,
  Users,
  Award,
} from "lucide-react";
import type { Service } from "@/types/service";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { getImageUrl } from "@/lib/utils/imageUrl";

function ServicesContent() {
  const searchParams = useSearchParams();
  const serviceType = searchParams.get("type");

  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, [serviceType]);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      const data = await servicesApi.getAll();
      // فقط الخدمات النشطة
      let activeServices = data.filter((s) => s.isActive);

      // تصفية حسب النوع إذا كان محدد
      if (serviceType) {
        activeServices = activeServices.filter(
          (s) => s.serviceType === serviceType
        );
      }

      setServices(activeServices);
    } catch (error) {
      toast.error("فشل تحميل الخدمات");
    } finally {
      setIsLoading(false);
    }
  };

  const getServiceTypeLabel = (type: string | null) => {
    switch (type) {
      case "PROSTHETICS":
        return "الأطراف الصناعية";
      case "PHYSIOTHERAPY":
        return "العلاج الفيزيائي";
      case "FOOT_BALANCE":
        return "تحليل القدم وتصحيح المشي";
      default:
        return "كل الخدمات";
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "PROSTHETICS":
        return <Activity className="w-12 h-12" />;
      case "PHYSIOTHERAPY":
        return <Stethoscope className="w-12 h-12" />;
      case "FOOT_BALANCE":
        return <Users className="w-12 h-12" />;
      default:
        return <Award className="w-12 h-12" />;
    }
  };

  const getServiceColor = (type: string) => {
    switch (type) {
      case "PROSTHETICS":
        return "from-primary-500 to-primary-600";
      case "PHYSIOTHERAPY":
        return "from-accent-500 to-accent-600";
      case "FOOT_BALANCE":
        return "from-blue-500 to-cyan-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/home.png"
            // src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop"
            alt="خدماتنا"
            fill
            className="object-cover brightness-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/90 to-accent-500/80" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {getServiceTypeLabel(serviceType)}
          </h1>
          <p className="text-xl md:text-2xl leading-relaxed opacity-95">
            {serviceType
              ? `تصفح جميع خدماتنا في مجال ${getServiceTypeLabel(serviceType)}`
              : "نقدم مجموعة متكاملة من الخدمات الطبية المتخصصة في الأطراف الصناعية والعلاج الفيزيائي"}
          </p>
          {serviceType && (
            <Link
              href="/services"
              className="inline-block mt-6 px-6 py-3 bg-white text-primary-500 rounded-lg hover:bg-accent-500 hover:text-white transition-all font-semibold"
            >
              عرض كل الخدمات
            </Link>
          )}
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                لا توجد خدمات متاحة حالياً
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                    {/* Service Image */}
                    {service.images && service.images.length > 0 ? (
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={getImageUrl(service.images[0].imageUrl)}
                          alt={service.images[0].altText || service.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                    ) : (
                      <div
                        className={`relative h-64 bg-gradient-to-br ${getServiceColor(
                          service.serviceType
                        )} flex items-center justify-center`}
                      >
                        <div className="text-white opacity-80">
                          {getServiceIcon(service.serviceType)}
                        </div>
                      </div>
                    )}

                    {/* Service Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-500 transition-colors">
                        {service.title}
                      </h3>

                      <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                        {service.description}
                      </p>

                      {/* Features Preview */}
                      {service.features && service.features.length > 0 && (
                        <div className="mt-auto space-y-2">
                          {service.features.slice(0, 3).map((feature) => (
                            <div
                              key={feature.id}
                              className="flex items-start gap-2 text-sm"
                            >
                              <Check className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-600">
                                {feature.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* View Details Button */}
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <span className="inline-flex items-center text-primary-500 font-semibold group-hover:text-accent-500 transition-colors">
                          اعرف المزيد
                          <ArrowLeft className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              لماذا تختار Vitaxir؟
            </h2>
            <p className="text-xl text-gray-600">
              نقدم أفضل الحلول الطبية بأعلى معايير الجودة
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: "خبرة متخصصة",
                description: "فريق من الأخصائيين المرخصين والمدربين",
              },
              {
                icon: Activity,
                title: "تقنيات حديثة",
                description: "استخدام أحدث التقنيات والمواد الطبية",
              },
              {
                icon: Users,
                title: "رعاية شخصية",
                description: "خطة علاج مصممة خصيصاً لكل مريض",
              },
              {
                icon: Check,
                title: "متابعة مستمرة",
                description: "دعم وصيانة طويلة الأمد",
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-white mx-auto mb-4">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl p-12 text-white text-center shadow-2xl">
            <h2 className="text-4xl font-bold mb-6">جاهز للبدء؟</h2>
            <p className="text-xl mb-8 opacity-95">
              تواصل معنا اليوم واحجز استشارتك المجانية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="px-8 py-4 bg-white text-primary-500 rounded-lg hover:shadow-xl hover:scale-105 transition-all font-semibold inline-flex items-center justify-center"
              >
                <ShoppingBag className="w-5 h-5 ml-2" />
                تصفح المنتجات
              </Link>
              <a
                href="/appointments"
                className="px-8 py-4 bg-accent-500 text-white rounded-lg hover:shadow-xl hover:scale-105 transition-all font-semibold inline-flex items-center justify-center"
              >
                <Phone className="w-5 h-5 ml-2" />
                احجز استشارتك
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function ServicesPage() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500"></div>
          </div>
        }
      >
        <ServicesContent />
      </Suspense>
    </>
  );
}
