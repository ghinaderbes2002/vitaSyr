// src/app/(public)/products/[slug]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { productsApi } from "@/lib/api/products";
import { toast } from "react-hot-toast";
import {
  ArrowRight,
  Check,
  Phone,
  ShoppingBag,
  Package,
  Star,
} from "lucide-react";
import type { Product } from "@/types/product";
import Footer from "@/components/public/Footer";
import { getImageUrl } from "@/lib/utils/imageUrl";
import { formatPriceWithLabel } from "@/lib/utils/currencyFormatter";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import Header from "@/components/public/Header";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const loadProduct = async () => {
    try {
      setIsLoading(true);
      const data = await productsApi.getAll();
      const foundProduct = data.find((p) => p.slug === slug && p.isActive);

      if (!foundProduct) {
        toast.error("المنتج غير موجود");
        router.push("/products");
        return;
      }

      setProduct(foundProduct);
    } catch (error) {
      console.error("Error loading product:", error);
      toast.error("فشل تحميل بيانات المنتج");
      router.push("/products");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4">
            <LoadingSpinner size="lg" className="text-primary-500" />
            <p className="text-gray-700 font-semibold text-lg">
              جاري تحميل المنتج...
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return null;
  }

  const sortedImages =
    product.images?.sort((a, b) => {
      if (a.isPrimary) return -1;
      if (b.isPrimary) return 1;
      return a.orderIndex - b.orderIndex;
    }) || [];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

        {/* Product Details */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Images */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                  {sortedImages.length > 0 ? (
                    <Image
                      src={getImageUrl(
                        sortedImages[selectedImageIndex].imageUrl
                      )}
                      alt={
                        sortedImages[selectedImageIndex].altText || product.name
                      }
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                      <ShoppingBag className="w-24 h-24 text-primary-300" />
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {sortedImages.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {sortedImages.map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index
                            ? "border-accent-500 shadow-lg"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Image
                          src={getImageUrl(image.imageUrl)}
                          alt={image.altText || product.name}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                {/* Category Badge */}
                {product.category && (
                  <div className="inline-block px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-semibold">
                    {product.category.name}
                  </div>
                )}

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  {product.name}
                </h1>

                {/* Price */}
                {/* {product.isPriceVisible && product.price && (
                  <div className="py-4 border-y border-gray-200">
                    <span className="text-4xl font-bold text-accent-500" dir="ltr">
                      {formatPriceWithLabel(product.price)}
                    </span>
                  </div>
                )} */}

                {/* Description */}
                {product.description && (
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Features */}
                {product.features && product.features.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <Star className="w-6 h-6 text-accent-500" />
                      المميزات
                    </h2>
                    <div className="space-y-3">
                      {product.features
                        .sort((a, b) => a.orderIndex - b.orderIndex)
                        .map((feature) => (
                          <div
                            key={feature.id}
                            className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-200"
                          >
                            <Check className="w-6 h-6 text-accent-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 font-medium">
                              {feature.featureText}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Specifications */}
        {product.specifications && (
          <section className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <Package className="w-8 h-8 text-primary-500" />
                <h2 className="text-4xl font-bold text-gray-900">
                  المواصفات التقنية
                </h2>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200">
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.specifications}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Videos Section */}
        {product.videos && product.videos.length > 0 && (
          <section className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                الفيديوهات
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {product.videos
                  .sort((a, b) => (a.isPrimary === b.isPrimary ? 0 : a.isPrimary ? -1 : 1))
                  .map((video) => (
                    <div
                      key={video.id}
                      className={`rounded-2xl overflow-hidden shadow-xl border-2 ${
                        video.isPrimary ? 'md:col-span-2 border-primary-500' : 'border-gray-200'
                      }`}
                    >
                      <div className="relative bg-gray-100" style={{ paddingBottom: '56.25%' }}>
                        <video
                          src={getImageUrl(video.videoUrl)}
                          controls
                          className="absolute inset-0 w-full h-full object-contain"
                          preload="metadata"
                        />
                      </div>
                      {video.isPrimary && (
                        <div className="bg-primary-500 text-white px-4 py-2 text-center font-semibold flex items-center justify-center gap-2">
                          <Star className="w-5 h-5" />
                          الفيديو الرئيسي
                        </div>
                      )}
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
              <h2 className="text-4xl font-bold mb-6">هل لديك أسئلة؟</h2>
              <p className="text-xl mb-8 opacity-95">
                فريقنا المتخصص جاهز لمساعدتك في اختيار المنتج المناسب
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="px-10 py-4 bg-white text-primary-500 rounded-lg hover:shadow-xl hover:scale-105 transition-all font-bold"
                >
                  تواصل معنا
                </Link>
                <a
                  href="tel:+963987106020"
                  className="px-10 py-4 bg-accent-500 text-white rounded-lg hover:shadow-xl hover:scale-105 transition-all font-bold"
                >
                  اتصل بنا
                </a>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
