// src/app/(public)/blog/[slug]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { blogPostsApi } from "@/lib/api/blog";
import type { BlogPost } from "@/types/blog";
import { getImageUrl } from "@/lib/utils/imageUrl";
import { Calendar, ArrowRight, Share2, Tag } from "lucide-react";
import { toast } from "react-hot-toast";

export default function BlogPostDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [params.slug]);

  const loadPost = async () => {
    try {
      setIsLoading(true);
      const posts = await blogPostsApi.getAll();
      const foundPost = posts.find((p) => p.slug === params.slug);

      if (!foundPost || foundPost.status !== "PUBLISHED") {
        router.push("/blog");
        return;
      }

      setPost(foundPost);
    } catch (error) {
      console.error("Error loading post:", error);
      toast.error("فشل تحميل المقال");
      router.push("/blog");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("تم نسخ الرابط");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <>
      <Header />

      <article className="min-h-screen bg-white">
        {/* Back Button - Sticky */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
       

        </div>

        {/* Featured Image Hero */}
        {post.featuredImage && (
          <section className="relative h-[400px] md:h-[550px] bg-gray-900">
            <Image
              src={getImageUrl(post.featuredImage)}
              alt={post.title}
              fill
              className="object-cover"
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </section>
        )}

        {/* Article Header */}
        <section className={`${post.featuredImage ? '-mt-40' : 'pt-12'} relative z-10 px-4`}>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              {/* Category Badge */}
              {post.category && (
                <div className="flex items-center gap-2 mb-6">
                  <Tag className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-bold text-primary-600 bg-primary-50 px-4 py-2 rounded-full">
                    {post.category.name}
                  </span>
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-8 pb-8 border-b-2 border-gray-100">
                  {post.excerpt}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6">
                {post.author?.full_name && (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg">
                      {post.author.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {post.author.full_name}
                      </p>
                      <p className="text-xs text-gray-500">كاتب المقال</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {formatDate(post.publishedAt || post.createdAt)}
                  </span>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-xl prose-slate max-w-none">
              <div className="text-gray-800 leading-loose space-y-8">
                {post.content.split("\n").map((paragraph, index) => {
                  if (!paragraph.trim()) return null;
                  return (
                    <p key={index} className="text-lg md:text-xl text-justify leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Share CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-primary-50 via-accent-50 to-white">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-10 md:p-16 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full mb-8 shadow-xl">
                <Share2 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                أعجبك المقال؟
              </h3>
              <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                شارك هذا المقال مع أصدقائك وعائلتك ليستفيدوا من المعلومات القيمة
              </p>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-2xl font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all"
              >
                <Share2 className="w-7 h-7" />
                <span>مشاركة المقال</span>
              </button>
            </div>
          </div>
        </section>

  
      </article>

      <Footer />
    </>
  );
}
