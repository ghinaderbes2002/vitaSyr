// src/app/(dashboard)/dashboard/blog/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  Eye as EyeIcon,
  FileText,
  Calendar,
  Tag,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { blogPostsApi } from "@/lib/api/blog";
import { Button } from "@/components/ui/Button";
import type { BlogPost } from "@/types/blog";
import { getImageUrl } from "@/lib/utils/imageUrl";

export default function BlogPostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const data = await blogPostsApi.getAll();
      setPosts(data);
    } catch (error: any) {
      toast.error("فشل تحميل المقالات");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المقال؟")) return;

    try {
      await blogPostsApi.delete(id);
      toast.success("تم حذف المقال بنجاح");
      loadPosts();
    } catch (error) {
      toast.error("فشل حذف المقال");
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المدونة</h1>
          <p className="text-gray-600 mt-1">إدارة مقالات المدونة</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/blog/categories">
            <Button variant="outline">
              <FileText className="w-4 h-4 ml-2" />
              الفئات
            </Button>
          </Link>
          <Link href="/dashboard/blog/tags">
            <Button variant="outline">
              <Tag className="w-4 h-4 ml-2" />
              الوسوم
            </Button>
          </Link>
          <Link href="/dashboard/blog/new">
            <Button variant="primary">
              <Plus className="w-5 h-5 ml-2" />
              إضافة مقال جديد
            </Button>
          </Link>
        </div>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">لا توجد مقالات حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const statusBadge = getStatusBadge(post.status);

            return (
              <div
                key={post.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Featured Image */}
                {post.featuredImage && (
                  <div className="relative h-48 bg-gray-100">
                    <img
                      src={getImageUrl(post.featuredImage)}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    {post.isFeatured && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                        مميز
                      </div>
                    )}
                  </div>
                )}

                {/* Card Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.className}`}
                        >
                          {statusBadge.label}
                        </span>
                        {post.category && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {post.category.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {post.excerpt || "لا يوجد مقتطف"}
                  </p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
                        >
                          #{tag.name}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{post.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.createdAt).toLocaleDateString("ar-SA")}
                    </div>
                    {post.author && (
                      <span className="text-gray-400">•</span>
                    )}
                    {post.author && (
                      <span>{post.author.full_name}</span>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="bg-gray-50 px-6 py-3 flex items-center gap-2">
                  <Link
                    href={`/dashboard/blog/${post.id}/view`}
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      <EyeIcon className="w-4 h-4 ml-2" />
                      عرض
                    </Button>
                  </Link>
                  <Link href={`/dashboard/blog/${post.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 ml-2" />
                      تعديل
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                    className="text-red-600 hover:bg-red-50 border-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
