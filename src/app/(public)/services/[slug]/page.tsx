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
  ArrowLeft,
  X,
} from "lucide-react";
import type { Service } from "@/types/service";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { getImageUrl } from "@/lib/utils/imageUrl";

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

console.log(slug);

  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

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

  // قائمة الخدمات التي لها منتجات (يمكن تعديلها من هنا)
  const servicesWithProducts = [
    "supply_of_medical_devices_and_prosthetic_solutions",
    // أضف slugs الخدمات الأخرى التي لها منتجات هنا
  ];

  const hasProducts = servicesWithProducts.includes(service.slug);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Back Button */}
        {/* <div className="container mx-auto px-4 py-6">
        <Link
          href="/services"
          className="inline-flex items-center text-primary-500 hover:text-accent-500 transition-colors font-semibold"
        >
          <ArrowRight className="w-5 h-5 ml-2" />
          العودة للخدمات
        </Link>
      </div> */}

      {/* Hero Section with Images */}
      <section className="relative py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Service Info */}
            <div className="space-y-6">
              {/* <div className="inline-block px-4 py-2 bg-accent-100 text-accent-600 rounded-full text-sm font-semibold">
                {service.serviceType === "PROSTHETICS"
                  ? "الأطراف الصناعية"
                  : service.serviceType === "PHYSIOTHERAPY"
                  ? "العلاج الفيزيائي"
                  : service.serviceType === "FOOT_BALANCE"
                  ? "توازن القدم"
                  : "خدمات أخرى"}
              </div> */}
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
                <div
                  className="relative w-full h-full cursor-pointer group"
                  onClick={() => setSelectedImage(0)}
                >
                  <Image
                    src={getImageUrl(service.images[0].imageUrl)}
                    alt={service.images[0].altText || service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-lg font-semibold">
                      اضغط للتكبير
                    </span>
                  </div>
                </div>
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
          {service.slug === "center_setup_and_establishmet" ? (
            // Card Design Layout for Center Setup
            <section className="py-16 px-4 bg-white">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-12">
                  <Sparkles className="w-8 h-8 text-accent-500" />
                  <h2 className="text-4xl font-bold text-gray-900">
                    {sectionTitles.features}
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {service.features
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .map((feature, index) => (
                      <div
                        key={feature.id}
                        className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                      >
                        {/* Card Image */}
                        <div className="relative h-64 overflow-hidden">
                          {service.images && service.images[index] ? (
                            <div
                              className="relative w-full h-full cursor-pointer"
                              onClick={() => setSelectedImage(index)}
                            >
                              <Image
                                src={getImageUrl(service.images[index].imageUrl)}
                                alt={service.images[index].altText || feature.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                              <Award className="w-16 h-16 text-primary-300" />
                            </div>
                          )}
                        </div>

                        {/* Card Content */}
                        <div className="p-6">
                          <div className="inline-block p-2 bg-accent-100 rounded-lg mb-3">
                            <Check className="w-5 h-5 text-accent-500" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </section>
          ) : service.slug === "supply_of_medical_devices_and_prosthetic_solutions" ? (
            // Split Layout for Supply Service
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
                        className={`flex flex-col md:flex-row gap-8 items-stretch ${
                          index % 2 === 0 ? "" : "md:flex-row-reverse"
                        }`}
                      >
                        {/* Image */}
                        <div className="w-full md:w-1/2">
                          {service.images && service.images[index] ? (
                            <div
                              className="relative h-full min-h-[400px] rounded-2xl overflow-hidden shadow-xl cursor-pointer group"
                              onClick={() => setSelectedImage(index)}
                            >
                              <Image
                                src={getImageUrl(
                                  service.images[index].imageUrl
                                )}
                                alt={
                                  service.images[index].altText || feature.title
                                }
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ) : (
                            <div className="relative h-full min-h-[400px] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                              <Award className="w-24 h-24 text-primary-300" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="w-full md:w-1/2 flex">
                          <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border-2 border-gray-200 hover:border-accent-500 transition-colors w-full flex flex-col">
                            <div className="inline-block p-3 bg-accent-100 rounded-xl mb-4 w-fit">
                              <Check className="w-8 h-8 text-accent-500" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">
                              {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line mb-6 flex-grow">
                              {feature.description}
                            </p>
                            {hasProducts && (
                              <Link
                                href="/products"
                                className="inline-flex items-center gap-2 text-accent-500 hover:text-accent-600 transition-colors font-bold text-base self-end"
                                title="تصفح المنتجات"
                              >
                                تصفح المنتجات
                                <ArrowLeft className="w-5 h-5" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          ) : service.serviceType === "PHYSIOTHERAPY" ? (
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
                                src={getImageUrl(
                                  service.images[index].imageUrl
                                )}
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
                            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
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
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-xl font-bold text-gray-900 flex-1">
                                {feature.title}
                              </h3>
                              {hasProducts && (
                                <Link
                                  href="/products"
                                  className="inline-flex items-center gap-1 text-accent-500 hover:text-accent-600 transition-colors text-sm font-semibold whitespace-nowrap"
                                  title="تصفح المنتجات"
                                >
                                  تصفح المنتجات
                                  <ArrowLeft className="w-4 h-4" />
                                </Link>
                              )}
                            </div>
                            <p className="text-gray-600 leading-relaxed mb-3 whitespace-pre-line">
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
      {service.images && service.images.length > 0 && (
        <section className="py-16 px-4" id="image-gallery">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              معرض الصور
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {service.images
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((image, index) => (
                  <div
                    key={image.id}
                    className="relative h-64 rounded-xl overflow-hidden shadow-lg group cursor-pointer"
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={getImageUrl(image.imageUrl)}
                      alt={image.altText || service.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Products Section - Only for Prosthetics */}
      {service.serviceType === "PROSTHETICS" && (
        <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <ShoppingBag className="w-8 h-8 text-accent-500" />
                <h2 className="text-4xl font-bold text-gray-900">
                  منتجات نقدمها
                </h2>
              </div>
              <p className="text-xl text-gray-600">
                تصفح مجموعتنا الواسعة من الأطراف الصناعية عالية الجودة
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "أطراف صناعية للساق",
                  icon: "🦿",
                  description: "أطراف صناعية متقدمة للساق السفلية والعلوية",
                },
                {
                  title: "أطراف صناعية للذراع",
                  icon: "🦾",
                  description: "حلول مبتكرة للأطراف العلوية واليد",
                },
                {
                  title: "مفاصل هيدروليكية",
                  icon: "⚙️",
                  description: "مفاصل هيدروليكية عالية الأداء للحركة الطبيعية",
                },
                {
                  title: "مفاصل إلكترونية ذكية",
                  icon: "🤖",
                  description: "تقنية ذكية للتحكم الدقيق والراحة القصوى",
                },
                {
                  title: "أجزاء ملائمة وملحقات",
                  icon: "🔧",
                  description: "ملحقات وقطع غيار لتحسين الأداء",
                },
                {
                  title: "حلول مخصّصة للأطفال والكبار",
                  icon: "👨‍👩‍👧‍👦",
                  description: "أطراف مصممة خصيصاً لجميع الأعمار",
                },
              ].map((product, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all group hover:scale-105"
                >
                  <div className="text-center">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                      {product.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {product.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/products?category=prosthetics"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <ShoppingBag className="w-6 h-6 ml-2" />
                تصفح جميع المنتجات
              </Link>
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
              {/* Show products button for specific service */}
              {service.slug === "supply_of_medical_devices_and_prosthetic_solutions" && (
                <Link
                  href="/products"
                  className="px-8 py-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-lg hover:shadow-xl hover:scale-105 transition-all font-semibold inline-flex items-center justify-center"
                >
                  <ShoppingBag className="w-5 h-5 ml-2" />
                  تصفح المنتجات
                </Link>
              )}
              <Link
                href="/appointments"
                className="px-8 py-4 bg-white text-primary-500 rounded-lg hover:shadow-xl hover:scale-105 transition-all font-semibold inline-flex items-center justify-center"
              >
                <Phone className="w-5 h-5 ml-2" />
                احجز استشارتك
              </Link>
            </div>
          </div>
        </div>
      </section>

        {/* Image Lightbox Modal */}
        {selectedImage !== null && service.images && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-10 h-10" />
            </button>

            {/* Previous Button */}
            {selectedImage > 0 && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 p-3 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(selectedImage - 1);
                }}
              >
                <ArrowRight className="w-8 h-8" />
              </button>
            )}

            {/* Next Button */}
            {selectedImage < service.images.length - 1 && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 p-3 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(selectedImage + 1);
                }}
              >
                <ArrowLeft className="w-8 h-8" />
              </button>
            )}

            {/* Image */}
            <div
              className="relative w-full h-full max-w-6xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={getImageUrl(service.images[selectedImage].imageUrl)}
                alt={service.images[selectedImage].altText || service.title}
                fill
                className="object-contain"
              />
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full">
              {selectedImage + 1} / {service.images.length}
            </div>
          </div>
        )}

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
