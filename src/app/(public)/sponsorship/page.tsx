// src/app/(public)/sponsorship/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Target,
  TrendingUp,
  Calendar,
  User,
  Star,
  CheckCircle,
  Clock,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { sponsorshipCasesApi } from "@/lib/api/sponsorship";
import type { SponsorshipCase } from "@/types/sponsorship";
import { getImageUrl } from "@/lib/utils/imageUrl";
import { formatPriceWithLabel } from "@/lib/utils/currencyFormatter";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function PublicSponsorshipPage() {
  const [cases, setCases] = useState<SponsorshipCase[]>([]);
  const [featuredCases, setFeaturedCases] = useState<SponsorshipCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "featured">("all");

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      setIsLoading(true);
      const data = await sponsorshipCasesApi.getAll();

      // Only show ONGOING cases to public
      const ongoingCases = data.filter((c) => c.status === "ONGOING");

      setCases(ongoingCases);
      setFeaturedCases(ongoingCases.filter((c) => c.isFeatured));
    } catch (error) {
      toast.error("فشل تحميل حالات الكفالة");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateProgress = (raised: number, target: number) => {
    return Math.min((raised / target) * 100, 100).toFixed(1);
  };

  const displayedCases = filter === "featured" ? featuredCases : cases;

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4">
            <LoadingSpinner size="lg" className="text-primary-500" />
            <p className="text-gray-700 font-semibold text-lg">
              جاري تحميل حالات الكفالة...
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
              src="/images/sponsorship.png"
              // src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop"
              alt="كفالة إنسان"
              fill
              className="object-cover brightness-50"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/90 to-accent-500/80" />
          </div>

          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Heart className="w-12 h-12 fill-current" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">كفالة إنسان</h1>
            <p className="text-xl md:text-2xl leading-relaxed opacity-95">
              ساهم في تغيير حياة إنسان.. كن سبباً في إعادة الأمل لمن يحتاج
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 px-4 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-blue-900 mb-2">
                  {cases.length}
                </h3>
                <p className="text-blue-700 font-medium">حالة قيد التمويل</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-green-900 mb-2">
                  {formatPriceWithLabel(
                    cases.reduce((sum, c) => sum + c.raisedAmount, 0)
                  )}
                </h3>
                <p className="text-green-700 font-medium">إجمالي التبرعات</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white fill-current" />
                </div>
                <h3 className="text-3xl font-bold text-yellow-900 mb-2">
                  {featuredCases.length}
                </h3>
                <p className="text-yellow-700 font-medium">حالة مميزة</p>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="py-8 px-4 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setFilter("all")}
                className={`px-6 py-3 rounded-xl transition-all font-bold ${
                  filter === "all"
                    ? "bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-accent-500"
                }`}
              >
                جميع الحالات ({cases.length})
              </button>
              <button
                onClick={() => setFilter("featured")}
                className={`px-6 py-3 rounded-xl transition-all font-bold flex items-center gap-2 ${
                  filter === "featured"
                    ? "bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-accent-500"
                }`}
              >
                <Star className="w-4 h-4" />
                الحالات المميزة ({featuredCases.length})
              </button>
            </div>
          </div>
        </section>

        {/* Cases Grid */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            {displayedCases.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  لا توجد حالات كفالة متاحة حالياً
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedCases.map((caseItem) => {
                  const progress = calculateProgress(
                    caseItem.raisedAmount,
                    caseItem.targetAmount
                  );

                  return (
                    <Link
                      key={caseItem.id}
                      href={`/sponsorship/${caseItem.id}`}
                      className="group"
                    >
                      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                        {/* Image */}
                        <div className="relative h-64 overflow-hidden">
                          <Image
                            src={getImageUrl(caseItem.caseImage)}
                            alt={caseItem.patientName}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {caseItem.isFeatured && (
                            <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-2 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                              <Star className="w-4 h-4 fill-current" />
                              مميزة
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary-500 transition-colors">
                            {caseItem.patientName}
                          </h3>

                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                            <User className="w-4 h-4" />
                            <span>العمر: {caseItem.age} سنة</span>
                          </div>

                          <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                            {caseItem.caseDescription}
                          </p>

                          {/* Progress */}
                          <div className="mt-auto">
                            <div className="mb-4">
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600 font-medium">
                                  التقدم
                                </span>
                                <span className="font-bold text-accent-600">
                                  {progress}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                  className="bg-gradient-to-r from-accent-500 to-accent-600 h-3 rounded-full transition-all"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>

                            {/* Amount Info */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              <div className="bg-green-50 rounded-lg p-3 text-center">
                                <p className="text-xs text-gray-600 mb-1">
                                  تم جمعه
                                </p>
                                <p className="font-bold text-green-700 text-sm">
                                  {formatPriceWithLabel(caseItem.raisedAmount)}
                                </p>
                              </div>
                              <div className="bg-blue-50 rounded-lg p-3 text-center">
                                <p className="text-xs text-gray-600 mb-1">
                                  المستهدف
                                </p>
                                <p className="font-bold text-blue-700 text-sm">
                                  {formatPriceWithLabel(caseItem.targetAmount)}
                                </p>
                              </div>
                            </div>

                            {/* CTA */}
                            <div className="pt-4 border-t border-gray-100">
                              <span className="inline-flex items-center justify-center w-full gap-2 px-4 py-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold rounded-xl group-hover:shadow-lg transition-all">
                                <Heart className="w-5 h-5" />
                                تبرع الآن
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
