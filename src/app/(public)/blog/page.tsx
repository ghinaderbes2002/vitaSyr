// src/app/(public)/blog/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { blogPostsApi, blogCategoriesApi } from "@/lib/api/blog";
import type { BlogPost, BlogCategory } from "@/types/blog";
import { getImageUrl } from "@/lib/utils/imageUrl";
import { Calendar, User, ArrowLeft, FileText } from "lucide-react";

export default function BlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [postsData, categoriesData] = await Promise.all([
        blogPostsApi.getAll(),
        blogCategoriesApi.getAll(),
      ]);

      // Filter only published posts
      setPosts(postsData.filter((post) => post.status === "PUBLISHED"));
      setCategories(categoriesData.filter((cat) => cat.isActive));
    } catch (error) {
      console.error("Error loading blog data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (selectedCategory && post.categoryId !== selectedCategory) return false;
    return true;
  });

  const featuredPosts = posts.filter((post) => post.isFeatured).slice(0, 3);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/sponsorship.png"
            alt="المدونة"
            fill
            className="object-cover brightness-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/90 to-accent-500/80" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">المدونة</h1>
          <p className="text-xl md:text-2xl leading-relaxed opacity-95">
            آخر الأخبار والمقالات الطبية والصحية
          </p>
        </div>
      </section>

      {/* Categories Tabs */}
      <section className="py-12 px-4 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-6 py-3 rounded-xl transition-all font-bold ${
                selectedCategory === ""
                  ? "bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border-2 border-gray-200 hover:border-accent-500"
              }`}
            >
              جميع الفئات
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl transition-all font-bold ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-accent-500"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-gradient-to-b from-gray-50 to-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <section className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                مقالات مميزة
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                    onClick={() => router.push(`/blog/${post.slug}`)}
                  >
                    {post.featuredImage ? (
                      <div className="relative h-56 overflow-hidden">
                        <Image
                          src={getImageUrl(post.featuredImage)}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          مميز
                        </div>
                      </div>
                    ) : (
                      <div className="relative h-56 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                        <FileText className="w-16 h-16 text-primary-300" />
                        <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          مميز
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      {post.category && (
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                            {post.category.name}
                          </span>
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDate(post.publishedAt || post.createdAt)}
                          </span>
                        </div>
                        {post.author?.full_name && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{post.author.full_name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* All Posts */}
          <section>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              جميع المقالات
            </h2>

            {filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  لا توجد مقالات في هذه الفئة
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                    onClick={() => router.push(`/blog/${post.slug}`)}
                  >
                    {post.featuredImage ? (
                      <div className="relative h-52 overflow-hidden">
                        <Image
                          src={getImageUrl(post.featuredImage)}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="relative h-52 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                        <FileText className="w-16 h-16 text-primary-300" />
                      </div>
                    )}
                    <div className="p-6">
                      {post.category && (
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full font-semibold">
                            {post.category.name}
                          </span>
                        </div>
                      )}
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDate(post.publishedAt || post.createdAt)}
                          </span>
                        </div>
                        <span className="flex items-center gap-1 text-primary-600 font-bold">
                          اقرأ المزيد
                          <ArrowLeft className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
}
