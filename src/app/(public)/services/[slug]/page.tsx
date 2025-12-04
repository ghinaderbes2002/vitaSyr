// src/app/(public)/services/[slug]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { servicesApi } from "@/lib/api/services";
import { toast } from "react-hot-toast";
import {
  ArrowRight,
  Check,
  Phone,
  ShoppingBag,
  Award,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import type { Service } from "@/types/service";
import Footer from "@/components/public/Footer";
import { getImageUrl } from "@/lib/utils/imageUrl";

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

console.log(slug);

  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadService();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const loadService = async () => {
    try {
      setIsLoading(true);
      const data = await servicesApi.getAll();

  

      const foundService = data.find((s) => s.slug === slug && s.isActive);

      if (!foundService) {
        console.error("❌ Service not found! Looking for:", slug);
        toast.error("الخدمة غير موجودة");
        router.push("/services");
        return;
      }

      console.log("✅ Service found:", foundService.title);
      setService(foundService);
    } catch (error) {
      console.error("Error loading service:", error);
      toast.error("فشل تحميل بيانات الخدمة");
      router.push("/services");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!service) {
    return null;
  }

  // Get section titles based on service type
  const getSectionTitles = () => {
    switch (service.serviceType) {
      case "PROSTHETICS":
        return {
          features: "ما نقدمه في هذه الخدمة",
          benefits: "مميزات خدماتنا",
        };
      case "PHYSIOTHERAPY":
        return {
          features: "ما يتضمنه البرنامج",
          benefits: "لماذا يجب أن تبدأ جلستك معنا؟",
          benefitsPrefix: "لتتمكن من ",
        };
      case "FOOT_BALANCE":
        return {
          features: "ما يميز خدمتنا",
          benefits: "من يستطيع الاستفادة من هذه الخدمة؟",
        };
      default:
        return {
          features: "ما نقدمه في هذه الخدمة",
          benefits: "مميزات خدماتنا",
        };
    }
  };

  const sectionTitles = getSectionTitles();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/services"
          className="inline-flex items-center text-primary-500 hover:text-accent-500 transition-colors font-semibold"
        >
          <ArrowRight className="w-5 h-5 ml-2" />
          العودة للخدمات
        </Link>
      </div>

      {/* Hero Section with Images */}
      <section className="relative py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Service Info */}
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-accent-100 text-accent-600 rounded-full text-sm font-semibold">
                {service.serviceType === "PROSTHETICS"
                  ? "الأطراف الصناعية"
                  : service.serviceType === "PHYSIOTHERAPY"
                  ? "العلاج الفيزيائي"
                  : service.serviceType === "FOOT_BALANCE"
                  ? "توازن القدم"
                  : "خدمات أخرى"}
              </div>
              <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                {service.title}
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Service Image */}
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              {service.images && service.images.length > 0 ? (
                <Image
                  src={getImageUrl(service.images[0].imageUrl)}
                  alt={service.images[0].altText || service.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <Award className="w-24 h-24 text-white opacity-50" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {service.features && service.features.length > 0 && (
        <>
          {service.serviceType === "PHYSIOTHERAPY" ? (
            // Split Layout for Physiotherapy
            <section className="py-16 px-4 bg-white">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-12">
                  <Sparkles className="w-8 h-8 text-accent-500" />
                  <h2 className="text-4xl font-bold text-gray-900">
                    {sectionTitles.features}
                  </h2>
                </div>

                {service.features
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map((feature, index) => (
                    <div key={feature.id} className="mb-16 last:mb-0">
                      <div
                        className={`flex flex-col md:flex-row gap-8 items-center ${
                          index % 2 === 0 ? "" : "md:flex-row-reverse"
                        }`}
                      >
                        {/* Image */}
                        <div className="w-full md:w-1/2">
                          {service.images && service.images[index] ? (
                            <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl">
                              <Image
                                src={getImageUrl(service.images[index].imageUrl)}
                                alt={
                                  service.images[index].altText || feature.title
                                }
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                              <Stethoscope className="w-24 h-24 text-primary-300" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="w-full md:w-1/2">
                          <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border-2 border-gray-200 hover:border-accent-500 transition-colors">
                            <div className="inline-block p-3 bg-accent-100 rounded-xl mb-4">
                              <Check className="w-8 h-8 text-accent-500" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">
                              {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-lg">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          ) : (
            // Grid Layout for other services
            <section className="py-16 px-4 bg-white">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-12">
                  <Sparkles className="w-8 h-8 text-accent-500" />
                  <h2 className="text-4xl font-bold text-gray-900">
                    {sectionTitles.features}
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {service.features
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .map((feature) => (
                      <div
                        key={feature.id}
                        className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 hover:border-accent-500 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-accent-100 rounded-lg flex-shrink-0">
                            <Check className="w-6 h-6 text-accent-500" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Benefits Section */}
      {service.benefits && service.benefits.length > 0 && (
        <section className="py-16 px-4 bg-gradient-to-br from-primary-50 to-accent-50">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-8 h-8 text-primary-500" />
                <h2 className="text-4xl font-bold text-gray-900">
                  {sectionTitles.benefits}
                </h2>
              </div>
              {sectionTitles.benefitsPrefix && (
                <p className="text-xl text-gray-600 font-semibold mr-11">
                  {sectionTitles.benefitsPrefix}
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.benefits
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((benefit) => (
                  <div
                    key={benefit.id}
                    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-accent-500 flex-shrink-0 mt-1" />
                      <p className="text-gray-700 font-medium">
                        {benefit.benefitText}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Image Gallery */}
      {service.images && service.images.length > 1 && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              معرض الصور
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {service.images
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .slice(1)
                .map((image) => (
                  <div
                    key={image.id}
                    className="relative h-64 rounded-xl overflow-hidden shadow-lg group"
                  >
                    <Image
                      src={getImageUrl(image.imageUrl)}
                      alt={image.altText || service.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl p-12 text-white text-center shadow-2xl">
            <h2 className="text-4xl font-bold mb-6">جاهز للبدء؟</h2>
            <p className="text-xl mb-8 opacity-95">
              تواصل معنا اليوم لمعرفة المزيد عن هذه الخدمة واحجز استشارتك
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Show both buttons only for PROSTHETICS */}
              {service.serviceType === "PROSTHETICS" && (
                <Link
                  href="/products"
                  className="px-8 py-4 bg-white text-primary-500 rounded-lg hover:shadow-xl hover:scale-105 transition-all font-semibold inline-flex items-center justify-center"
                >
                  <ShoppingBag className="w-5 h-5 ml-2" />
                  تصفح المنتجات
                </Link>
              )}
              <Link
                href="/appointments"
                className="px-8 py-4 bg-accent-500 text-white rounded-lg hover:shadow-xl hover:scale-105 transition-all font-semibold inline-flex items-center justify-center"
              >
                <Phone className="w-5 h-5 ml-2" />
                احجز استشارتك
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
