// src/app/(public)/success-stories/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { successStoriesApi } from "@/lib/api/successStories";
import { toast } from "react-hot-toast";
import {
  ArrowRight,
  Calendar,
  User,
  Play,
  X,
  Quote,
  Heart,
} from "lucide-react";
import type { SuccessStory } from "@/types/successStory";
import Footer from "@/components/public/Footer";
import { getImageUrl } from "@/lib/utils/imageUrl";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { formatGregorianDate } from "@/lib/utils/dateFormatter";

export default function SuccessStoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const storyId = params.id as string;

  const [story, setStory] = useState<SuccessStory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [currentImageLabel, setCurrentImageLabel] = useState("");

  useEffect(() => {
    if (storyId) {
      loadStory();
    }
  }, [storyId]);

  const loadStory = async () => {
    try {
      setIsLoading(true);
      const data = await successStoriesApi.getOne(storyId);

      if (!data.isActive) {
        toast.error("هذه القصة غير متاحة حالياً");
        router.push("/success-stories");
        return;
      }

      setStory(data);
    } catch (error) {
      console.error("Error loading success story:", error);
      toast.error("فشل تحميل قصة النجاح");
      router.push("/success-stories");
    } finally {
      setIsLoading(false);
    }
  };

  const openVideoModal = () => {
    setShowVideoModal(true);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="text-primary-500 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">جاري تحميل قصة النجاح...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/success-stories"
          className="inline-flex items-center text-primary-500 hover:text-accent-500 transition-colors font-semibold"
        >
          <ArrowRight className="w-5 h-5 ml-2" />
          العودة لقصص النجاح
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative py-12 px-4 bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span className="text-lg font-semibold">{story.patientName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{story.age} سنة</span>
            </div>
          </div>

          <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-4">
            {story.caseType}
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">{story.storyTitle}</h1>
          <p className="text-xl md:text-2xl leading-relaxed opacity-95">
            {story.storyDescription}
          </p>
        </div>
      </section>

      {/* Before/After Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-12">
            <h2 className="text-4xl font-bold text-gray-900">رحلة التحول</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Before Image */}
            <div
              className="relative group cursor-pointer"
              onClick={() => openImageModal(story.beforeImage, "قبل")}
            >
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute top-4 right-4 z-10 px-4 py-2 bg-gray-900/80 text-white rounded-full font-bold text-lg">
                  قبل
                </div>
                <Image
                  src={getImageUrl(story.beforeImage)}
                  alt={`${story.patientName} - قبل`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
              </div>
            </div>

            {/* After Image */}
            <div
              className="relative group cursor-pointer"
              onClick={() => openImageModal(story.afterImage, "بعد")}
            >
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-accent-500">
                <div className="absolute top-4 left-4 z-10 px-4 py-2 bg-accent-500 text-white rounded-full font-bold text-lg">
                  بعد
                </div>
                <Image
                  src={getImageUrl(story.afterImage)}
                  alt={`${story.patientName} - بعد`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      {story.videoUrl && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
              شاهد رحلة {story.patientName}
            </h2>
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl group cursor-pointer">
              <Image
                src={getImageUrl(story.afterImage)}
                alt="فيديو"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <button
                  onClick={openVideoModal}
                  className="p-6 bg-white rounded-full shadow-2xl group-hover:scale-110 transition-transform"
                >
                  <Play className="w-12 h-12 text-primary-500" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Patient Testimonial */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-12 rounded-3xl border-r-8 border-accent-500 shadow-xl">
            <Quote className="w-16 h-16 text-accent-500 mb-6" />
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              كلمة {story.patientName}
            </h3>
            <p className="text-2xl text-gray-800 leading-relaxed italic">
              "{story.patientTestimonial}"
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      {story.milestones && story.milestones.length > 0 && (
        <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              مراحل رحلة {story.patientName}
            </h2>

            <div className="relative">
              {/* Vertical Timeline Line */}
              <div className="absolute right-8 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 via-accent-500 to-primary-500 hidden md:block"></div>

              {/* Milestones */}
              <div className="space-y-16">
                {story.milestones
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map((milestone, index) => (
                    <div
                      key={milestone.id}
                      className={`relative ${
                        index % 2 === 0 ? "md:pr-20" : "md:pr-20 md:pl-20"
                      }`}
                    >
                      {/* Timeline Dot */}
                      <div
                        className={`absolute right-6 w-7 h-7 rounded-full hidden md:block ${
                          milestone.milestoneType === "BEFORE"
                            ? "bg-gray-500"
                            : milestone.milestoneType === "AFTER"
                            ? "bg-accent-500"
                            : "bg-primary-500"
                        } border-4 border-white shadow-xl z-10`}
                      ></div>

                      {/* Milestone Card */}
                      <div
                        className={`bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all ${
                          index % 2 === 0 ? "" : "md:mr-auto"
                        } max-w-2xl`}
                      >
                        {/* Milestone Image */}
                        <div
                          className="relative h-80 cursor-pointer group"
                          onClick={() =>
                            openImageModal(milestone.imageUrl, milestone.title)
                          }
                        >
                          <Image
                            src={getImageUrl(milestone.imageUrl)}
                            alt={milestone.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                        </div>

                        {/* Milestone Content */}
                        <div className="p-8">
                          <div className="flex items-center gap-3 mb-4">
                            <div
                              className={`px-4 py-2 rounded-full text-sm font-bold ${
                                milestone.milestoneType === "BEFORE"
                                  ? "bg-gray-100 text-gray-700"
                                  : milestone.milestoneType === "AFTER"
                                  ? "bg-accent-100 text-accent-700"
                                  : "bg-primary-100 text-primary-700"
                              }`}
                            >
                              {milestone.milestoneType === "BEFORE"
                                ? "قبل"
                                : milestone.milestoneType === "AFTER"
                                ? "بعد"
                                : "مرحلة"}
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                              <Calendar className="w-5 h-5" />
                              <span className="font-semibold">
                                {formatGregorianDate(milestone.date)}
                              </span>
                            </div>
                          </div>

                          <h3 className="text-3xl font-bold text-gray-900 mb-4">
                            {milestone.title}
                          </h3>

                          <p className="text-gray-700 text-lg leading-relaxed">
                            {milestone.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Video Modal */}
      {showVideoModal && story.videoUrl && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full">
            <button
              onClick={closeVideoModal}
              className="absolute -top-12 left-0 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden">
              <video
                src={getImageUrl(story.videoUrl)}
                controls
                autoPlay
                className="w-full h-full"
              >
                متصفحك لا يدعم تشغيل الفيديو
              </video>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <div className="relative max-w-6xl w-full h-[90vh]">
            <button
              onClick={closeImageModal}
              className="absolute -top-12 left-0 p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors z-10"
              aria-label="إغلاق"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="absolute top-4 right-4 z-10 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-900 font-bold text-lg shadow-lg">
              {currentImageLabel}
            </div>

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
  );
}
