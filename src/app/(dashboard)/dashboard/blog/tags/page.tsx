// src/app/(dashboard)/dashboard/blog/tags/page.tsx

"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Save, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { blogTagsApi } from "@/lib/api/blog";
import { Button } from "@/components/ui/Button";
import type { BlogTag } from "@/types/blog";

export default function BlogTagsPage() {
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setIsLoading(true);
      const data = await blogTagsApi.getAll();
      setTags(data);
    } catch (error: any) {
      toast.error("فشل تحميل الوسوم");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setSlug("");
    setShowAddForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !slug.trim()) {
      toast.error("الرجاء ملء الحقول المطلوبة");
      return;
    }

    try {
      setIsSaving(true);

      const tagData = {
        name: name.trim(),
        slug: slug.trim(),
      };

      await blogTagsApi.create(tagData);
      toast.success("تمت إضافة الوسم بنجاح");

      resetForm();
      loadTags();
    } catch (error: any) {
      console.error("Error saving tag:", error);
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "فشل حفظ الوسم"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الوسم؟")) return;

    try {
      await blogTagsApi.delete(id);
      toast.success("تم حذف الوسم بنجاح");
      loadTags();
    } catch (error: any) {
      toast.error("فشل حذف الوسم. قد يكون مرتبط بمقالات.");
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slug) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\u0600-\u06FFa-z0-9-]/g, "");
      setSlug(generatedSlug);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">وسوم المدونة</h1>
          <p className="text-gray-600 mt-1">إدارة وسوم المقالات</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setShowAddForm(!showAddForm);
          }}
        >
          {showAddForm ? (
            <>
              <X className="w-5 h-5 ml-2" />
              إلغاء
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 ml-2" />
              إضافة وسم جديد
            </>
          )}
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            إضافة وسم جديد
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الوسم *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
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
                    مثال: <span className="font-mono bg-blue-100 px-1 rounded">health-care</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={resetForm}>
                إلغاء
              </Button>
              <Button type="submit" disabled={isSaving} variant="primary">
                <Save className="w-4 h-4 ml-2" />
                {isSaving ? "جاري الحفظ..." : "إضافة الوسم"}
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Tags Grid */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {tags.length === 0 ? (
          <p className="text-center text-gray-500 py-8">لا توجد وسوم حالياً</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-full border border-gray-200 hover:bg-gray-200 transition-colors group"
              >
                <span className="text-sm font-medium">{tag.name}</span>
                <span className="text-xs text-gray-500 font-mono">
                  ({tag.slug})
                </span>
                <button
                  onClick={() => handleDelete(tag.id)}
                  className="p-1 text-red-600 hover:bg-red-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
