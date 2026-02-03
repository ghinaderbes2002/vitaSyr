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
                    placeholder="+963-XX-XXX-XXXX"
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
            <div className="bg-white rounded-2xl shadow-xl p-8 h-full flex flex-col">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Phone className="w-6 h-6 text-accent-500" />
                معلومات التواصل
              </h2>

              <div className="space-y-6 flex-grow">
                <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6 border-2 border-primary-100">
                  <div className="flex items-start gap-4">
                    <div className="bg-white rounded-full p-3 shadow-md">
                      <Mail className="w-6 h-6 text-accent-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 mb-2">البريد الإلكتروني</p>
                      <a
                        href="mailto:info@vitaxir.com"
                        className="text-accent-600 font-bold text-lg hover:text-accent-700 transition-colors block"
                      >
                        info@vitaxir.com
                      </a>
                      <p className="text-gray-600 text-sm mt-2">نرد على استفساراتك خلال 24 ساعة</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
                  <div className="flex items-start gap-4">
                    <div className="bg-white rounded-full p-3 shadow-md">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 mb-2">ساعات العمل</p>
                      <p className="text-blue-900 font-bold text-lg">
                        السبت - الخميس
                      </p>
                      <p className="text-gray-700 text-lg font-semibold mt-1">
                        9:00 صباحاً - 8:00 مساءً
                      </p>
                      <p className="text-gray-600 text-sm mt-2">نحن في خدمتك طوال أيام الأسبوع</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
                  <div className="flex items-start gap-4">
                    <div className="bg-white rounded-full p-3 shadow-md">
                      <MessageCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 mb-2">تواصل معنا</p>
                      <p className="text-gray-700 leading-relaxed">
                        سواء كنت بحاجة إلى استشارة طبية، معلومات عن منتجاتنا، أو أي استفسار آخر، فريقنا جاهز لمساعدتك.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-gray-100 pt-6">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">تابعنا على مواقع التواصل</h3>
                  <div className="flex items-center gap-4">
                    <a
                      href="https://www.facebook.com/share/17fC3cf3NJ/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 transition-all hover:scale-110 shadow-lg"
                    >
                      <Facebook className="w-6 h-6" />
                    </a>
                    <a
                      href="https://www.instagram.com/vitaxir_company?igsh=MWdxY3p2dGh4a3l6dA=="
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full p-3 transition-all hover:scale-110 shadow-lg"
                    >
                      <Instagram className="w-6 h-6" />
                    </a>
                  </div>
                  <p className="text-gray-600 text-sm mt-4">
                    تابع آخر أخبارنا وقصص نجاح المرضى على صفحاتنا
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
