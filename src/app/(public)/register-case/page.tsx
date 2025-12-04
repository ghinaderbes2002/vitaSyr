// src/app/(public)/register-case/page.tsx

"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { casesApi } from "@/lib/api/cases";
import { toast } from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Check,
  Heart,
  Shield,
  Clock,
  Stethoscope,
} from "lucide-react";
import type { CreateCaseData } from "@/types/case";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { LoadingButton } from "@/components/ui/LoadingSpinner";

export default function RegisterCasePage() {
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
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "age") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.fullName ||
      !formData.age ||
      !formData.phone ||
      !formData.address ||
      !formData.amputationType ||
      !formData.amputationLevel ||
      !formData.amputationDate ||
      !formData.currentCondition
    ) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    if (formData.age < 1 || formData.age > 120) {
      toast.error("الرجاء إدخال عمر صحيح");
      return;
    }

    try {
      setIsSubmitting(true);
      await casesApi.create({
        ...formData,
        email: formData.email?.trim() || undefined,
        additionalNotes: formData.additionalNotes?.trim() || undefined,
      });

      toast.success("تم تسجيل حالتك بنجاح! سنتواصل معك قريباً");

      // Reset form
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
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error: any) {
      console.error("Error creating case:", error);
      const errorMessage = error.response?.data?.message || "حدث خطأ أثناء تسجيل الحالة. الرجاء المحاولة مرة أخرى";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-500 to-accent-500 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-block p-4 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
              <Heart className="w-16 h-16" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              سجل حالتك الآن
            </h1>
            <p className="text-xl md:text-2xl opacity-95 leading-relaxed">
              املأ النموذج أدناه وسيتواصل معك فريقنا المتخصص لتقديم أفضل الحلول
            </p>
          </div>
        </section>

        {/* Why Register Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                لماذا تسجل حالتك معنا؟
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                نقدم رعاية شاملة ومتخصصة لكل حالة على حدة
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  icon: Stethoscope,
                  title: "تقييم طبي دقيق",
                  description: "فحص شامل من قبل أخصائيين معتمدين",
                },
                {
                  icon: Shield,
                  title: "خطة علاجية مخصصة",
                  description: "حلول مصممة خصيصاً لحالتك",
                },
                {
                  icon: Clock,
                  title: "متابعة مستمرة",
                  description: "نتابع تقدمك في كل خطوة",
                },
                {
                  icon: Heart,
                  title: "رعاية شاملة",
                  description: "دعم طبي ونفسي متكامل",
                },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="inline-block p-4 bg-accent-100 rounded-xl mb-4">
                      <Icon className="w-8 h-8 text-accent-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Registration Form */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8 md:p-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary-100 rounded-xl">
                  <FileText className="w-6 h-6 text-primary-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  نموذج تسجيل الحالة
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information Section */}
                <div className="border-b-2 border-gray-200 pb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    المعلومات الشخصية
                  </h3>

                  {/* Full Name */}
                  <div className="mb-6">
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
                        placeholder="أدخل الاسم الكامل"
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
                        value={formData.age || ""}
                        onChange={handleChange}
                        required
                        min="1"
                        max="120"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                        placeholder="العمر"
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
                        <option value="MALE">ذكر</option>
                        <option value="FEMALE">أنثى</option>
                      </select>
                    </div>
                  </div>

                  {/* Phone & Email */}
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-gray-700 font-bold mb-2">
                        رقم الهاتف <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                          placeholder="+971-XX-XXX-XXXX"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-2">
                        البريد الإلكتروني (اختياري)
                      </label>
                      <div className="relative">
                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                          placeholder="example@email.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mt-6">
                    <label className="block text-gray-700 font-bold mb-2">
                      العنوان <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        rows={2}
                        className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors resize-none"
                        placeholder="أدخل العنوان الكامل"
                      />
                    </div>
                  </div>
                </div>

                {/* Medical Information Section */}
                <div className="border-b-2 border-gray-200 pb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    المعلومات الطبية
                  </h3>

                  {/* Amputation Type & Level */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-bold mb-2">
                        نوع البتر <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="amputationType"
                        value={formData.amputationType}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                        placeholder="مثال: بتر الساق السفلى"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-2">
                        مستوى البتر <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="amputationLevel"
                        value={formData.amputationLevel}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                        placeholder="مثال: تحت الركبة"
                      />
                    </div>
                  </div>

                  {/* Amputation Date */}
                  <div className="mt-6">
                    <label className="block text-gray-700 font-bold mb-2">
                      تاريخ البتر <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        name="amputationDate"
                        value={formData.amputationDate}
                        onChange={handleChange}
                        required
                        className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Current Condition */}
                  <div className="mt-6">
                    <label className="block text-gray-700 font-bold mb-2">
                      الحالة الحالية <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="currentCondition"
                      value={formData.currentCondition}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors resize-none"
                      placeholder="صف حالتك الصحية الحالية والأعراض إن وجدت..."
                    />
                  </div>

                  {/* Previous Prosthetics */}
                  <div className="mt-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="previousProsthetics"
                        checked={formData.previousProsthetics}
                        onChange={handleChange}
                        className="w-5 h-5 text-accent-500 border-2 border-gray-300 rounded focus:ring-2 focus:ring-accent-200"
                      />
                      <span className="text-gray-700 font-bold">
                        هل سبق لك استخدام أطراف صناعية؟
                      </span>
                    </label>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    ملاحظات إضافية (اختياري)
                  </label>
                  <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors resize-none"
                    placeholder="أي معلومات إضافية تود مشاركتها معنا..."
                  />
                </div>

                {/* Submit Button */}
                <LoadingButton
                  type="submit"
                  isLoading={isSubmitting}
                  loadingText="جاري التسجيل..."
                  icon={<Check className="w-5 h-5" />}
                  className="w-full py-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  تسجيل الحالة
                </LoadingButton>
              </form>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
