// src/app/(dashboard)/dashboard/success-stories/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { successStoriesApi } from "@/lib/api/successStories";
import type { SuccessStory } from "@/types/successStory";
import { Button } from "@/components/ui/Button";
import {
  Plus,
  Eye,
  Edit2,
  Trash2,
  Star,
  Search,
  Image as ImageIcon,
  Video,
  Award,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function SuccessStoriesPage() {
  const router = useRouter();

  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [filteredStories, setFilteredStories] = useState<SuccessStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  useEffect(() => {
    loadStories();
  }, []);

  useEffect(() => {
    filterStories();
  }, [stories, searchQuery, filterStatus]);

  const loadStories = async () => {
    try {
      setIsLoading(true);
      const data = await successStoriesApi.getAll();
      setStories(data);
    } catch (error: any) {
      console.error("Error loading success stories:", error);
      toast.error("فشل تحميل قصص النجاح");
    } finally {
      setIsLoading(false);
    }
  };

  const filterStories = () => {
    let filtered = [...stories];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (story) =>
          story.patientName.toLowerCase().includes(query) ||
          story.caseType.toLowerCase().includes(query) ||
          story.storyTitle.toLowerCase().includes(query) ||
          story.storyDescription.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filterStatus === "FEATURED") {
      filtered = filtered.filter((story) => story.isFeatured);
    } else if (filterStatus === "ACTIVE") {
      filtered = filtered.filter((story) => story.isActive);
    } else if (filterStatus === "INACTIVE") {
      filtered = filtered.filter((story) => !story.isActive);
    }

    // Sort by orderIndex
    filtered.sort((a, b) => a.orderIndex - b.orderIndex);

    setFilteredStories(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف قصة النجاح هذه؟")) return;

    try {
      await successStoriesApi.delete(id);
      toast.success("تم حذف قصة النجاح بنجاح");
      loadStories();
    } catch (error: any) {
      console.error("Error deleting success story:", error);
      toast.error("فشل حذف قصة النجاح");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">قصص النجاح</h1>
          <p className="text-gray-600 mt-1">
            إدارة قصص النجاح ({filteredStories.length} قصة)
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => router.push("/dashboard/success-stories/new")}
        >
          <Plus className="w-4 h-4 ml-2" />
          قصة نجاح جديدة
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="بحث (الاسم، نوع الإصابة، الوصف...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="ALL">جميع القصص</option>
              <option value="FEATURED">مميزة</option>
              <option value="ACTIVE">نشطة</option>
              <option value="INACTIVE">غير نشطة</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      {filteredStories.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            لا توجد قصص نجاح
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || filterStatus !== "ALL"
              ? "لم يتم العثور على قصص تطابق البحث"
              : "لم يتم إضافة أي قصص نجاح بعد"}
          </p>
          {!searchQuery && filterStatus === "ALL" && (
            <Button
              variant="primary"
              onClick={() => router.push("/dashboard/success-stories/new")}
            >
              <Plus className="w-4 h-4 ml-2" />
              إضافة قصة نجاح جديدة
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Images */}
              <div className="grid grid-cols-2 gap-1 bg-gray-100">
                {story.beforeImage ? (
                  <img
                    src={`${API_BASE_URL}${story.beforeImage}`}
                    alt="قبل"
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                    <span className="text-xs text-gray-500 absolute">قبل</span>
                  </div>
                )}
                {story.afterImage ? (
                  <img
                    src={`${API_BASE_URL}${story.afterImage}`}
                    alt="بعد"
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                    <span className="text-xs text-gray-500 absolute">بعد</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 flex-1">
                    {story.patientName}
                  </h3>
                  {story.isFeatured && (
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {story.storyTitle}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">نوع الحالة:</span>{" "}
                    {story.caseType}
                  </p>
                  {story.age && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">العمر:</span> {story.age} سنة
                    </p>
                  )}
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {story.storyDescription}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 mb-4">
                  {story.videoUrl && (
                    <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      <Video className="w-3 h-3 ml-1" />
                      فيديو
                    </span>
                  )}
                  {story.milestones && story.milestones.length > 0 && (
                    <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {story.milestones.length} مرحلة
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                      story.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {story.isActive ? "نشط" : "غير نشط"}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      router.push(`/dashboard/success-stories/${story.id}`)
                    }
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100"
                  >
                    <Eye className="w-4 h-4" />
                    عرض
                  </button>
                  <button
                    onClick={() =>
                      router.push(`/dashboard/success-stories/${story.id}`)
                    }
                    className="px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg"
                    title="تعديل"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(story.id)}
                    className="px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
