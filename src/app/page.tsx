// src/app/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Heart,
  Users,
  Award,
  CheckCircle,
  Activity,
  Stethoscope,
  Settings,
  Wrench,
  Globe,
  TrendingUp,
} from "lucide-react";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { productsApi } from "@/lib/api/products";
import { blogApi } from "@/lib/api/blog";
import { successStoriesApi } from "@/lib/api/successStories";
import { partnersApi } from "@/lib/api/partners";
import type { Product } from "@/types/product";
import type { BlogPost } from "@/types/blog";
import type { SuccessStory } from "@/types/successStory";
import type { Partner } from "@/types/partner";
import { getImageUrl } from "@/lib/utils/imageUrl";
import { formatGregorianDate } from "@/lib/utils/dateFormatter";
import { formatPriceWithLabel } from "@/lib/utils/currencyFormatter";
import { LoadingCard } from "@/components/ui/LoadingSpinner";
import { useSiteStats } from "@/hooks/useSiteStats";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [featuredStories, setFeaturedStories] = useState<SuccessStory[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const stats = useSiteStats();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // Load featured products (first 3)
      const productsData = await productsApi.getAll();
      setFeaturedProducts(productsData.filter((p) => p.isFeatured).slice(0, 3));

      // Load latest blog posts (first 3)
      const postsData = await blogApi.getAll();
      setLatestPosts(postsData.slice(0, 3));

      // Load featured success stories (first 3)
      const storiesData = await successStoriesApi.getAll();
      setFeaturedStories(storiesData.filter((s) => s.isFeatured).slice(0, 3));

      // Load partners
      const partnersData = await partnersApi.getAll();
      setPartners(partnersData.filter((p) => p.isActive));
    } catch (error) {
      console.error("Error loading homepage data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="bg-gray-50">
        {/* Hero Section */}
        <section className="relative min-h-[600px] flex items-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/home.png"
              // src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop"
              alt="Vitaxir"
              fill
              className="object-cover brightness-40"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-800/90 to-accent-600/85" />
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
                مع كل طرف نركبه… نعيد قصة حياة!
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-100 leading-relaxed">
                في <span className="text-accent-400 font-bold">Vitaxir</span>{" "}
                نصمّم أطرافًا صناعية متطورة ونقدّم برامج تأهيل شاملة تساعدك على
                استعادة الحركة، الثقة، والاستقلالية.
                <br />
                <span className="text-accent-300 font-semibold">
                  كل خطوة نؤمنها لك نساعدك من خلالها على استعادة حركتك… واستعادة
                  نفسك.
                </span>
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/cases"
                  className="px-8 py-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-lg font-bold hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Heart className="w-5 h-5" />
                  سجّل حالتك الآن
                </Link>
                <Link
                  href="/appointments"
                  className="px-8 py-4 bg-white text-primary-500 rounded-lg font-bold hover:bg-gray-100 hover:shadow-xl transition-all"
                >
                  احجز موعدًا
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-transparent text-white rounded-lg font-bold border-2 border-white hover:bg-white hover:text-primary-500 transition-all"
                >
                  تواصل معنا
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white shadow-lg -mt-16 relative z-20 mx-4 md:mx-8 rounded-2xl">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 text-white rounded-full mb-4">
                  <Users className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stats.happyPatients}+
                </div>
                <div className="text-gray-600 font-medium">مريض سعيد</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full mb-4">
                  <Award className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stats.yearsExperience}+
                </div>
                <div className="text-gray-600 font-medium">سنة خبرة</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 text-white rounded-full mb-4">
                  <Heart className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stats.sponsorshipCases}+
                </div>
                <div className="text-gray-600 font-medium">حالة كفالة</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full mb-4">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stats.successRate}%
                </div>
                <div className="text-gray-600 font-medium">نسبة النجاح</div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Us Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                لماذا <span className="text-primary-500">نحن</span>؟
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                نقدم حلولاً متكاملة ومتطورة تضمن لك استعادة حياتك بشكل كامل
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Feature 1 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border-t-4 border-accent-500">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center text-white">
                      <Activity className="w-8 h-8" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      حلول متقدمة للأطراف الصناعية
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      نستخدم أحدث التقنيات والمكوّنات العالمية لنضمن لك طرفًا
                      صناعيًا مريحًا، متينًا، ومتوافقًا مع احتياجاتك اليومية.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border-t-4 border-primary-500">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white">
                      <Stethoscope className="w-8 h-8" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      تأهيل متكامل بإشراف متخصصين
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      يعمل فريق المعالجين الفيزيائيين على تدريبك خطوة بخطوة
                      لاستعادة التوازن والقدرة على الحركة باستخدام الطرف
                      الصناعي.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border-t-4 border-accent-500">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center text-white">
                      <Settings className="w-8 h-8" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      تصميم مخصص لكل حالة
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      نؤمن بأن كل مريض حالة فريدة؛ لذلك نصمّم الأطراف بما يتناسب
                      مع شكل الجسم، نمط الحياة، ونوع النشاط.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border-t-4 border-primary-500">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white">
                      <Globe className="w-8 h-8" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      جودة شراكات عالمية
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      نحن وكلاء ومزوّدون لعدد من الماركات العالمية في مجال
                      الأطراف الصناعية، لنضمن لك جودة تواكب أعلى معايير الصناعة.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-gradient-to-br from-primary-500 to-primary-700">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                خدماتنا
              </h2>
              <p className="text-xl text-primary-100 max-w-3xl mx-auto mb-12">
                نقدم مجموعة شاملة من الخدمات المتخصصة
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white hover:bg-white/20 transition-all">
                <CheckCircle className="w-12 h-12 text-accent-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">
                  تصميم وتعديل الأطراف الصناعية
                </h3>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white hover:bg-white/20 transition-all">
                <CheckCircle className="w-12 h-12 text-accent-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">
                  التركيب والمعايرة الدقيقة
                </h3>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white hover:bg-white/20 transition-all">
                <CheckCircle className="w-12 h-12 text-accent-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">
                  إعادة التأهيل الحركي والفيزيائي
                </h3>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white hover:bg-white/20 transition-all">
                <CheckCircle className="w-12 h-12 text-accent-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">
                  الصيانة والمتابعة الدورية
                </h3>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 text-white rounded-lg font-bold hover:bg-accent-600 hover:shadow-xl hover:scale-105 transition-all"
              >
                اطّلع على خدماتنا
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>


        {/* Partners Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">شركاؤنا</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                نفتخر بشراكتنا مع أفضل الشركات العالمية في هذا المجال
              </p>
            </div>
            {partners.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
                {partners.map((partner) =>
                  partner.website ? (
                    <a
                      key={partner.id}
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all grayscale hover:grayscale-0 cursor-pointer"
                    >
                      <Image
                        src={getImageUrl(partner.logoUrl)}
                        alt={partner.name}
                        width={120}
                        height={60}
                        className="max-h-16 w-auto object-contain"
                      />
                    </a>
                  ) : (
                    <div
                      key={partner.id}
                      className="flex items-center justify-center p-6 bg-white rounded-xl shadow-md"
                    >
                      <Image
                        src={getImageUrl(partner.logoUrl)}
                        alt={partner.name}
                        width={120}
                        height={60}
                        className="max-h-16 w-auto object-contain"
                      />
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  سيتم إضافة شركائنا قريباً
                </p>
              </div>
            )}
          </div>
        </section>

    
      </div>
      <Footer />
    </>
  );
}
