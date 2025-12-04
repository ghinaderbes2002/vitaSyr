// src/app/(public)/contact/page.tsx

"use client";

import { useState } from "react";
import { contactApi } from "@/lib/api/contact";
import { toast } from "react-hot-toast";
import {
  Mail,
  Phone,
  MessageCircle,
  Clock,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import type { CreateContactMessageDto } from "@/types/contactMessage";

export default function ContactPage() {
  const [formData, setFormData] = useState<CreateContactMessageDto>({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    status: "NEW", // حالة افتراضية عند الإنشاء
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.message
    ) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      setIsSubmitting(true);
      await contactApi.create(formData);
      toast.success("تم إرسال رسالتك! سنتواصل معك خلال 24 ساعة.");

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        status: "NEW",
      });
    } catch (error) {
      console.error(error);
      toast.error("فشل في إرسال الرسالة. حاول مرة أخرى");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-r from-primary-500 to-accent-500 py-16 px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">اتصل بنا</h1>
            <p className="text-xl opacity-90">
              نحن هنا لمساعدتك. تواصل معنا وسنرد عليك في أقرب وقت
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-accent-500" /> أرسل لنا
                رسالة
              </h2>
              <p className="text-gray-600 mb-6">
                املأ النموذج وسنتواصل معك خلال 24 ساعة
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    الاسم الكامل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    البريد الإلكتروني <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    رقم الهاتف <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                    placeholder="+971-XX-XXX-XXXX"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    الموضوع
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                    placeholder="الموضوع اختياري"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    الرسالة <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors resize-none"
                    placeholder="اكتب رسالتك هنا..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "جاري الإرسال..." : "إرسال الرسالة"}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8 flex flex-col gap-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                معلومات التواصل
              </h2>

              <div className="flex items-center gap-3">
                <Phone className="w-6 h-6 text-accent-500" />
                <div>
                  <p className="font-semibold">الهاتف</p>
                  <a
                    href="tel:8008482947"
                    className="text-gray-900 font-bold text-lg hover:text-accent-500 transition-colors"
                  >
                    800-VITAXIR
                  </a>
                  <p className="text-gray-500 text-sm">
                    متاح 7 أيام في الأسبوع
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-accent-500" />
                <div>
                  <p className="font-semibold">واتساب</p>
                  <a
                    href="https://wa.me/971501234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-900 font-bold text-lg hover:text-accent-500 transition-colors"
                  >
                    +971-50-123-4567
                  </a>
                  <p className="text-gray-500 text-sm">استجابة فورية</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-accent-500" />
                <div>
                  <p className="font-semibold">البريد الإلكتروني</p>
                  <a
                    href="mailto:info@vitaxirpro.com"
                    className="text-gray-900 font-bold text-lg hover:text-accent-500 transition-colors"
                  >
                    info@vitaxirpro.com
                  </a>
                  <p className="text-gray-500 text-sm">نرد خلال 24 ساعة</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-accent-500" />
                <div>
                  <p className="font-semibold">ساعات العمل</p>
                  <p className="text-gray-900 font-bold text-lg">
                    9 صباحاً - 8 مساءً
                  </p>
                  <p className="text-gray-500 text-sm">(7 أيام)</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-pink-500 transition-colors"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-blue-400 transition-colors"
                >
                  <Twitter className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
