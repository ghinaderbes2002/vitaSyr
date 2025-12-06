// src/app/(public)/success-stories/page.tsx

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { successStoriesApi } from "@/lib/api/successStories";
import { toast } from "react-hot-toast";
import {
  Heart,
  Award,
  X,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  Quote,
} from "lucide-react";
import type { SuccessStory } from "@/types/successStory";
import Footer from "@/components/public/Footer";
import Header from "@/components/public/Header";
import { getImageUrl } from "@/lib/utils/imageUrl";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function SuccessStoriesPage() {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [featuredStories, setFeaturedStories] = useState<SuccessStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [currentImageLabel, setCurrentImageLabel] = useState("");

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      setIsLoading(true);
      const data = await successStoriesApi.getAll();
      const activeStories = data
        .filter((story) => story.isActive)
        .sort((a, b) => a.orderIndex - b.orderIndex);

      // Separate featured stories for carousel
      const featured = activeStories.filter((story) => story.isFeatured);

      setStories(activeStories);
      setFeaturedStories(featured);
    } catch (error) {
      console.error("Error loading success stories:", error);
      toast.error("فشل تحميل قصص النجاح");
    } finally {
      setIsLoading(false);
    }
  };

  const openImageModal = (imageUrl: string, label: string) => {
    setCurrentImageUrl(imageUrl);
    setCurrentImageLabel(label);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setCurrentImageUrl("");
    setCurrentImageLabel("");
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredStories.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredStories.length) % featuredStories.length);
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" className="text-primary-500 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">جاري تحميل قصص النجاح...</p>
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
        <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/success-stories.png"
              alt="قصص نجاح"
              fill
              className="object-cover brightness-40"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-800/90 to-accent-600/85" />
          </div>

          <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">قصص نجاح</h1>
            <p className="text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto mb-4 opacity-95">
              هنا نشارككم حكايات أناس بدأوا رحلتهم بالألم والبحث عن حل، ووصلوا اليوم
              إلى حياة أكثر ثباتًا واستقلالية وثقة.
            </p>
            <p className="text-lg md:text-xl opacity-90">
              كل تجربة هنا هي شهادة على أن التغيير ممكن، وأن الخطوة التي تنتظرها قد
              تكون قريبة.
            </p>
          </div>
        </section>

      {stories.length === 0 ? (
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Award className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              قريباً - قصص ملهمة في الطريق
            </h2>
            <p className="text-xl text-gray-600">
              نعمل حالياً على جمع قصص النجاح الملهمة لمشاركتها معكم
            </p>
          </div>
        </section>
      ) : (
        <>
          {/* Featured Story Carousel */}
          {featuredStories.length > 0 && (
            <section className="py-16 px-4">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 text-accent-600 rounded-full text-sm font-semibold mb-4">
                    <Award className="w-5 h-5" />
                    قصص مميزة
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900">
                    رحلات التعافي والأمل
                  </h2>
                </div>

                {/* Carousel */}
                <div className="relative">
                  <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-0">
                      {/* Images - Before/After */}
                      <div className="relative h-[500px] md:h-[600px]">
                        <div className="grid grid-cols-2 h-full">
                          {/* Before */}
                          <div
                            className="relative cursor-pointer group"
                            onClick={() => openImageModal(featuredStories[currentSlide].beforeImage, "قبل")}
                          >
                            <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-gray-900/80 text-white rounded-full text-sm font-semibold">
                              قبل
                            </div>
                            <Image
                              src={getImageUrl(featuredStories[currentSlide].beforeImage)}
                              alt={`${featuredStories[currentSlide].patientName} - قبل`}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                          </div>

                          {/* After */}
                          <div
                            className="relative border-r-4 border-accent-500 cursor-pointer group"
                            onClick={() => openImageModal(featuredStories[currentSlide].afterImage, "بعد")}
                          >
                            <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-accent-500 text-white rounded-full text-sm font-semibold">
                              بعد
                            </div>
                            <Image
                              src={getImageUrl(featuredStories[currentSlide].afterImage)}
                              alt={`${featuredStories[currentSlide].patientName} - بعد`}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                          </div>
                        </div>

                      </div>

                      {/* Story Content */}
                      <div className="p-8 md:p-12 flex flex-col justify-center">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="flex items-center gap-2 text-gray-600">
                            <User className="w-5 h-5" />
                            <span className="font-semibold">
                              {featuredStories[currentSlide].patientName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-5 h-5" />
                            <span>{featuredStories[currentSlide].age} سنة</span>
                          </div>
                        </div>

                        <div className="inline-block px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-semibold mb-4 w-fit">
                          {featuredStories[currentSlide].caseType}
                        </div>

                        <h3 className="text-3xl font-bold text-gray-900 mb-4">
                          {featuredStories[currentSlide].storyTitle}
                        </h3>

                        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                          {featuredStories[currentSlide].storyDescription}
                        </p>

                        {/* Patient Testimonial */}
                        <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-6 rounded-2xl border-r-4 border-accent-500">
                          <Quote className="w-8 h-8 text-accent-500 mb-3" />
                          <p className="text-gray-800 italic leading-relaxed">
                            "{featuredStories[currentSlide].patientTestimonial}"
                          </p>
                        </div>

                        {/* View Details Button */}
                        <Link
                          href={`/success-stories/${featuredStories[currentSlide].id}`}
                          className="mt-6 inline-block px-8 py-4 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 hover:scale-105 transition-all text-center"
                        >
                          اقرأ القصة كاملة
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Carousel Navigation */}
                  {featuredStories.length > 1 && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all z-10"
                        aria-label="Previous story"
                      >
                        <ChevronLeft className="w-6 h-6 text-primary-500" />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all z-10"
                        aria-label="Next story"
                      >
                        <ChevronRight className="w-6 h-6 text-primary-500" />
                      </button>

                      {/* Dots Indicator */}
                      <div className="flex justify-center gap-2 mt-6">
                        {featuredStories.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-2 rounded-full transition-all ${
                              index === currentSlide
                                ? "w-8 bg-primary-500"
                                : "w-2 bg-gray-300 hover:bg-gray-400"
                            }`}
                            aria-label={`Go to story ${index + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* All Stories Grid */}
          {stories.length > 1 && (
            <section className="py-16 px-4 bg-gray-50">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
                  جميع القصص
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {stories.map((story) => (
                    <div
                      key={story.id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all group"
                    >
                      {/* Before/After Split Image */}
                      <div className="relative h-64">
                        <div className="grid grid-cols-2 h-full">
                          <div
                            className="relative cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              openImageModal(story.beforeImage, "قبل");
                            }}
                          >
                            <div className="absolute top-2 right-2 z-10 px-2 py-1 bg-gray-900/80 text-white rounded-full text-xs font-semibold">
                              قبل
                            </div>
                            <Image
                              src={getImageUrl(story.beforeImage)}
                              alt={`${story.patientName} - قبل`}
                              fill
                              className="object-cover hover:scale-110 transition-transform"
                            />
                          </div>
                          <div
                            className="relative border-r-2 border-accent-500 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              openImageModal(story.afterImage, "بعد");
                            }}
                          >
                            <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-accent-500 text-white rounded-full text-xs font-semibold">
                              بعد
                            </div>
                            <Image
                              src={getImageUrl(story.afterImage)}
                              alt={`${story.patientName} - بعد`}
                              fill
                              className="object-cover hover:scale-110 transition-transform"
                            />
                          </div>
                        </div>

                      </div>

                      {/* Card Content */}
                      <Link
                        href={`/success-stories/${story.id}`}
                        className="p-6 block"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span className="font-semibold">
                              {story.patientName}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {story.age} سنة
                          </span>
                        </div>

                        <div className="inline-block px-2 py-1 bg-primary-100 text-primary-600 rounded-full text-xs font-semibold mb-3">
                          {story.caseType}
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-500 transition-colors">
                          {story.storyTitle}
                        </h3>

                        <p className="text-gray-600 leading-relaxed line-clamp-3">
                          {story.storyDescription}
                        </p>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <div className="relative max-w-6xl w-full h-[90vh]">
            {/* Close Button */}
            <button
              onClick={closeImageModal}
              className="absolute -top-12 left-0 p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors z-10"
              aria-label="إغلاق"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Image Label */}
            <div className="absolute top-4 right-4 z-10 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-900 font-bold text-lg shadow-lg">
              {currentImageLabel}
            </div>

            {/* Image */}
            <div
              className="relative h-full rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={getImageUrl(currentImageUrl)}
                alt={currentImageLabel}
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
      </div>
    </>
  );
}
