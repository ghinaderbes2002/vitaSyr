// src/app/(dashboard)/dashboard/blog/new/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { blogPostsApi, blogCategoriesApi, blogTagsApi } from "@/lib/api/blog";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Save, Upload, X } from "lucide-react";
import type { BlogCategory, BlogTag } from "@/types/blog";
import { useAuthStore } from "@/store/authStore";

export default function NewBlogPostPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [isFeatured, setIsFeatured] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadCategories();
    loadTags();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await blogCategoriesApi.getAll();
      setCategories(data.filter(c => c.isActive));
      if (data.length > 0) {
        setCategoryId(data[0].id);
      }
    } catch (error: any) {
      toast.error("فشل تحميل الفئات");
    }
  };

  const loadTags = async () => {
    try {
      const data = await blogTagsApi.getAll();
      setTags(data);
    } catch (error: any) {
      toast.error("فشل تحميل الوسوم");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("الرجاء اختيار صورة صحيحة");
        return;
      }
      setFeaturedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setFeaturedImage(null);
    setImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !slug.trim() || !categoryId || !content.trim()) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    if (!user?.id) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    try {
      setIsSaving(true);

      const formData = new FormData();
      formData.append("categoryId", categoryId);
      formData.append("authorId", user.id);
      formData.append("title", title.trim());
      formData.append("slug", slug.trim());
      formData.append("content", content.trim());
      formData.append("metaTitle", metaTitle.trim() || title.trim());
      formData.append("metaDescription", metaDescription.trim() || excerpt.trim() || title.trim());
      formData.append("status", status);
      formData.append("isFeatured", isFeatured.toString());

      if (excerpt.trim()) {
        formData.append("excerpt", excerpt.trim());
      }

      if (featuredImage) {
        formData.append("featuredImage", featuredImage);
      }

      if (status === "PUBLISHED") {
        formData.append("publishedAt", new Date().toISOString());
      }

      if (selectedTags.length > 0) {
        formData.append("tags", JSON.stringify(selectedTags));
      }

      const newPost = await blogPostsApi.create(formData);

      toast.success("تم إنشاء المقال بنجاح");
      router.push(`/dashboard/blog/${newPost.id}`);
    } catch (error: any) {
      console.error("Error creating post:", error);
      console.error("Error response:", error.response?.data);
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "فشل إنشاء المقال"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\u0600-\u06FFa-z0-9-]/g, "");
      setSlug(generatedSlug);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/dashboard/blog")}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إضافة مقال جديد</h1>
          <p className="text-gray-600 mt-1">أضف مقال جديد إلى المدونة</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان المقال *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-900">
                    <strong>ما هو الـ Slug؟</strong> هو اسم مختصر يظهر داخل رابط الصفحة
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    يرجى كتابته باللغة الإنكليزية فقط، وبدون مسافات، واستخدام علامة (-) بين الكلمات.
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    مثال: <span className="font-mono bg-blue-100 px-1 rounded">health-tips-2024</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الفئة *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">اختر الفئة</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  حالة النشر *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="DRAFT">مسودة</option>
                  <option value="PUBLISHED">منشور</option>
                  <option value="ARCHIVED">مؤرشف</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المقتطف
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="مقتطف قصير عن المقال..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المحتوى *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="محتوى المقال..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الصورة البارزة
              </label>

              {imagePreview ? (
                <div className="relative w-full h-48 border-2 border-gray-300 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">اضغط لاختيار صورة</span>
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG أو WEBP</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>

            {/* Tags Selection */}
            {tags.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوسوم
                </label>
                <div className="flex flex-wrap gap-2 p-4 border border-gray-300 rounded-lg">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedTags.includes(tag.id)
                          ? "bg-primary-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان SEO
                </label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder={title || "عنوان SEO"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف SEO
                </label>
                <input
                  type="text"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder={excerpt || "وصف SEO"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label
                htmlFor="isFeatured"
                className="text-sm font-medium text-gray-700"
              >
                مقال مميز
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/blog")}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={isSaving} variant="primary">
                <Save className="w-4 h-4 ml-2" />
                {isSaving ? "جاري الحفظ..." : "إنشاء المقال"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
