// src/app/(dashboard)/dashboard/blog/[id]/view/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { blogPostsApi } from "@/lib/api/blog";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  Edit,
  Calendar,
  User,
  Folder,
  Tag,
  Eye,
  Star,
} from "lucide-react";
import type { BlogPost } from "@/types/blog";
import { getImageUrl } from "@/lib/utils/imageUrl";

export default function ViewBlogPostPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [params.id]);

  const loadPost = async () => {
    try {
      setIsLoading(true);
      const data = await blogPostsApi.getOne(params.id);
      setPost(data);
    } catch (error: any) {
      toast.error("فشل تحميل المقال");
      router.push("/dashboard/blog");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      PUBLISHED: {
        label: "منشور",
        className: "bg-green-100 text-green-800",
      },
      DRAFT: {
        label: "مسودة",
        className: "bg-yellow-100 text-yellow-800",
      },
      ARCHIVED: {
        label: "مؤرشف",
        className: "bg-gray-100 text-gray-600",
      },
    };
    return badges[status] || badges.DRAFT;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const statusBadge = getStatusBadge(post.status);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard/blog")}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
            <p className="text-gray-600 mt-1">عرض تفاصيل المقال</p>
          </div>
        </div>
        <Button
          variant="primary"
          onClick={() => router.push(`/dashboard/blog/${post.id}`)}
        >
          <Edit className="w-4 h-4 ml-2" />
          تعديل المقال
        </Button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Featured Image */}
          {post.featuredImage && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <img
                src={getImageUrl(post.featuredImage)}
                alt={post.title}
                className="w-full h-96 object-cover"
              />
              {post.isFeatured && (
                <div className="px-4 py-2 bg-yellow-50 border-t border-yellow-200">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <Star className="w-4 h-4" />
                    <span className="text-sm font-medium">مقال مميز</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                المقتطف
              </h3>
              <p className="text-blue-800 leading-relaxed">{post.excerpt}</p>
            </div>
          )}

          {/* Content */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              المحتوى
            </h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                الوسوم
              </h2>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    <Tag className="w-3 h-3 ml-1" />
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Info Cards */}
        <div className="space-y-4">
          {/* Status Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">الحالة</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">حالة النشر</span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge.className}`}
                >
                  <Eye className="w-3 h-3" />
                  {statusBadge.label}
                </span>
              </div>

              {post.isFeatured && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">مقال مميز</span>
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                </div>
              )}
            </div>
          </div>

          {/* Post Info Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">
              معلومات المقال
            </h3>
            <div className="space-y-4">
              {post.category && (
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Folder className="w-4 h-4" />
                    <span className="text-sm">الفئة</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mr-6">
                    {post.category.name}
                  </p>
                </div>
              )}

              {post.author && (
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <User className="w-4 h-4" />
                    <span className="text-sm">الكاتب</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mr-6">
                    {post.author.full_name}
                  </p>
                  <p className="text-xs text-gray-500 mr-6">
                    {post.author.email}
                  </p>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Tag className="w-4 h-4" />
                  <span className="text-sm">Slug</span>
                </div>
                <p className="text-sm font-mono text-gray-900 mr-6">
                  {post.slug}
                </p>
              </div>
            </div>
          </div>

          {/* Dates Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">
              التواريخ
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>تاريخ الإنشاء</span>
                </div>
                <p className="text-gray-900 mr-6">
                  {new Date(post.createdAt).toLocaleDateString("ar-SA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>آخر تحديث</span>
                </div>
                <p className="text-gray-900 mr-6">
                  {new Date(post.updatedAt).toLocaleDateString("ar-SA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              {post.publishedAt && (
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>تاريخ النشر</span>
                  </div>
                  <p className="text-gray-900 mr-6">
                    {new Date(post.publishedAt).toLocaleDateString("ar-SA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SEO Info Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">
              معلومات SEO
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-600">العنوان</span>
                <p className="text-sm text-gray-900 mt-1">
                  {post.metaTitle || post.title}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-600">الوصف</span>
                <p className="text-sm text-gray-900 mt-1 line-clamp-3">
                  {post.metaDescription || post.excerpt || "غير محدد"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
