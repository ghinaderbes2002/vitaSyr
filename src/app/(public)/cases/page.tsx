// src/app/(public)/cases/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { casesApi } from "@/lib/api/cases";
import { toast } from "react-hot-toast";
import { User, Phone, Mail, MessageSquare, Calendar, ImageIcon } from "lucide-react";
import type { CreateCaseData } from "@/types/case";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";

export default function NewCasePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateCaseData>({
    fullName: "",
    age: 0,
    gender: "MALE",
    phone: "",
    email: "",
    address: "",
    amputationType: "",
    amputationLevel: "",
    amputationDate: "",
    currentCondition: "",
    previousProsthetics: false,
    additionalNotes: "",
    priority: "MEDIUM",
  });

  const genders: { value: "MALE" | "FEMALE"; label: string }[] = [
    { value: "MALE", label: "ذكر" },
    { value: "FEMALE", label: "أنثى" },
  ];

  const priorities: { value: "LOW" | "MEDIUM" | "HIGH"; label: string }[] = [
    { value: "LOW", label: "منخفض" },
    { value: "MEDIUM", label: "متوسط" },
    { value: "HIGH", label: "مرتفع" },
  ];

const [imageFile, setImageFile] = useState<File | null>(null);


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type, checked } = e.target as any;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : name === "age" ? Number(value) : value,
    }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();

   // Validation
   if (!formData.fullName || !formData.phone || !formData.amputationDate) {
     toast.error("الرجاء ملء جميع الحقول المطلوبة");
     return;
   }

   try {
     setIsSubmitting(true);

     // 1️⃣ إنشاء الحالة
     const createdCase = await casesApi.create(formData);

     // 2️⃣ رفع الصورة إذا اختارها المستخدم
     if (imageFile) {
       await casesApi.addImage(createdCase.id, imageFile, "BEFORE");
     }

     // 3️⃣ مسح الحقول بعد الإرسال
     setFormData({
       fullName: "",
       age: 0,
       gender: "MALE",
       phone: "",
       email: "",
       address: "",
       amputationType: "",
       amputationLevel: "",
       amputationDate: "",
       currentCondition: "",
       previousProsthetics: false,
       additionalNotes: "",
       priority: "MEDIUM",
     });
     setImageFile(null);

     toast.success("تم تسجيل حالتك بنجاح!");
     router.push("/"); // أو أي صفحة بدك تروح عليها بعد الإرسال
   } catch (error) {
     console.error(error);
     toast.error("فشل في تسجيل الحالة. حاول مرة أخرى");
   } finally {
     setIsSubmitting(false);
   }
 };


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-500 to-accent-500 py-16 px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              سجل حالتك الآن
            </h1>
            <p className="text-xl opacity-95">
              ابدأ رحلتك معنا لضمان تقديم أفضل حل يناسبك، يرجى تعبئة نموذج تسجيل
              الحالة
            </p>
          </div>
        </section>

        {/* Info Message */}
        <section className="py-6 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
              <p className="text-blue-800 text-center text-lg font-medium leading-relaxed">
                بعد إرسال النموذج، سيتواصل فريقنا معك لتحديد موعد وتقييم كامل لحالتك.
              </p>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-10 px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  الاسم الكامل <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>
              </div>

              {/* Age & Gender */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    العمر <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    min={0}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                    placeholder="أدخل عمرك"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    الجنس <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                  >
                    {genders.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid md:grid-cols-2 gap-6">
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
                    placeholder="أدخل رقم الهاتف"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  العنوان <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                  placeholder="أدخل عنوانك"
                />
              </div>

              {/* Amputation Details */}
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    نوع البتر
                  </label>
                  <input
                    type="text"
                    name="amputationType"
                    value={formData.amputationType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                    placeholder="مثال: أسفل الركبة"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    مستوى البتر
                  </label>
                  <input
                    type="text"
                    name="amputationLevel"
                    value={formData.amputationLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                    placeholder="مثال: يمين/يسار"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    تاريخ البتر
                  </label>
                  <input
                    type="date"
                    name="amputationDate"
                    value={formData.amputationDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                  />
                </div>
              </div>

              {/* Current Condition & Previous Prosthetics */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    الحالة الحالية
                  </label>
                  <textarea
                    name="currentCondition"
                    value={formData.currentCondition}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors resize-none"
                    placeholder="صف حالتك الحالية..."
                  />
                </div>

                <div className="flex items-center gap-2 mt-6">
                  <input
                    type="checkbox"
                    name="previousProsthetics"
                    checked={formData.previousProsthetics}
                    onChange={handleChange}
                    className="h-5 w-5 accent-accent-500"
                  />
                  <label className="text-gray-700 font-medium">
                    هل استخدمت أطراف صناعية سابقة؟
                  </label>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  ملاحظات إضافية
                </label>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors resize-none"
                  placeholder="أضف أي تفاصيل إضافية..."
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  رفع صورة
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="border-2 border-gray-200 rounded-xl p-2"
                  />
                  {imageFile && (
                    <span className="text-gray-600">{imageFile.name}</span>
                  )}
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "جاري التسجيل..." : "تسجيل الحالة"}
              </button>
            </form>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
