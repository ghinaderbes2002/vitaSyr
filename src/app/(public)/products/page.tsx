// src/app/(public)/products/page.tsx

"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { productsApi, categoriesApi } from "@/lib/api/products";
import { toast } from "react-hot-toast";
import { Check, ShoppingBag } from "lucide-react";
import type { Product, ProductCategory } from "@/types/product";
import Footer from "@/components/public/Footer";
import { getImageUrl } from "@/lib/utils/imageUrl";
import { formatPriceWithLabel } from "@/lib/utils/currencyFormatter";
import { LoadingCard, LoadingSpinner } from "@/components/ui/LoadingSpinner";
import Header from "@/components/public/Header";

function ProductsContent() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (categorySlug && categories.length > 0) {
      const category = categories.find((c) => c.slug === categorySlug);
      if (category) {
        setSelectedCategory(category.id);
      }
    }
  }, [categorySlug, categories]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productsApi.getAll(),
        categoriesApi.getAll(),
      ]);

      const activeProducts = productsData.filter((p) => p.isActive);
      const activeCategories = categoriesData.filter((c) => c.isActive);

      setProducts(activeProducts);
      setCategories(activeCategories);
    } catch (error) {
      toast.error("فشل تحميل المنتجات");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.categoryId === selectedCategory)
    : products;

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4">
            <LoadingSpinner size="lg" className="text-primary-500" />
            <p className="text-gray-700 font-semibold text-lg">
              جاري تحميل المنتجات...
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/home.png"
              // src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop"
              alt="منتجاتنا"
              fill
              className="object-cover brightness-50"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/90 to-accent-500/80" />
          </div>

          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">منتجاتنا</h1>
            <p className="text-xl md:text-2xl leading-relaxed opacity-95">
              تصفح مجموعتنا المتكاملة من الأطراف الصناعية والأجهزة الطبية
              المتطورة
            </p>
          </div>
        </section>

        {/* Categories Tabs */}
        <section className="py-12 px-4 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-6 py-3 rounded-xl transition-all font-bold ${
                  selectedCategory === null
                    ? "bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-accent-500"
                }`}
              >
                كل المنتجات
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-xl transition-all font-bold ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg"
                      : "bg-white text-gray-700 border-2 border-gray-200 hover:border-accent-500"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  لا توجد منتجات في هذا التصنيف
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group"
                  >
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                      {/* Product Image */}
                      {product.images && product.images.length > 0 ? (
                        <div className="relative h-64 overflow-hidden">
                          <Image
                            src={getImageUrl(
                              product.images.find((img) => img.isPrimary)
                                ?.imageUrl || product.images[0].imageUrl
                            )}
                            alt={
                              product.images.find((img) => img.isPrimary)
                                ?.altText || product.name
                            }
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="relative h-64 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                          <ShoppingBag className="w-16 h-16 text-primary-300" />
                        </div>
                      )}

                      {/* Product Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary-500 transition-colors">
                          {product.name}
                        </h3>

                        {product.description && (
                          <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                            {product.description}
                          </p>
                        )}

                        {/* Features Preview */}
                        {product.features && product.features.length > 0 && (
                          <div className="mt-auto space-y-2">
                            {product.features
                              .sort((a, b) => a.orderIndex - b.orderIndex)
                              .slice(0, 3)
                              .map((feature) => (
                                <div
                                  key={feature.id}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <Check className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
                                  <span className="text-gray-600">
                                    {feature.featureText}
                                  </span>
                                </div>
                              ))}
                          </div>
                        )}

                        {/* Price */}
                        {product.isPriceVisible && product.price && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <span className="text-2xl font-bold text-accent-500" dir="ltr">
                              {formatPriceWithLabel(product.price)}
                            </span>
                          </div>
                        )}

                        {/* View Details */}
                        <div className="mt-4">
                          <span className="inline-flex items-center text-primary-500 font-semibold group-hover:text-accent-500 transition-colors">
                            عرض التفاصيل
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

        <Footer />
      </div>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500"></div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
