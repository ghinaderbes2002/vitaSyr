// src/app/(public)/partnerships/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { partnershipsApi } from "@/lib/api/partnerships";
import { toast } from "react-hot-toast";
import {
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  FileText,
  Check,
  Handshake,
  TrendingUp,
  Users,
  Target,
  MessageCircle,
  Info,
  Heart,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import type {
  CreatePartnershipInquiryDto,
  PartnershipType,
} from "@/types/partnership";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { LoadingButton } from "@/components/ui/LoadingSpinner";

export default function PartnershipsPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreatePartnershipInquiryDto>({
    organizationName: "",
    contactPerson: "",
    email: "",
    phone: "",
    partnershipType: "MEDICAL",
    country: "",
    inquiryDetails: "",
  });

  const partnershipTypes: {
    value: PartnershipType;
    label: string;
    description: string;
  }[] = [
    {
      value: "MEDICAL",
      label: "شراكة طبية",
      description: "للمؤسسات الطبية والمراكز الصحية",
    },
    {
      value: "INVESTMENT",
      label: "فرصة استثمارية",
      description: "للمستثمرين وأصحاب رؤوس الأموال",
    },
    {
      value: "OTHER",
      label: "أخرى",
      description: "لأنواع الشراكات الأخرى",
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.organizationName ||
      !formData.contactPerson ||
      !formData.email ||
      !formData.phone ||
      !formData.country ||
      !formData.inquiryDetails
    ) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      setIsSubmitting(true);
      await partnershipsApi.create(formData);
      toast.success("تم إرسال طلب الشراكة بنجاح! سنتواصل معك قريباً");

      // Reset form
      setFormData({
        organizationName: "",
        contactPerson: "",
        email: "",
        phone: "",
        partnershipType: "MEDICAL",
        country: "",
        inquiryDetails: "",
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Error creating partnership inquiry:", error);
      toast.error("فشل في إرسال الطلب. الرجاء المحاولة مرة أخرى");
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
              <Handshake className="w-16 h-16" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              شراكات وفرص استثمارية
            </h1>
            <p className="text-xl md:text-2xl opacity-95 leading-relaxed mb-8">
              انضم إلينا في تطوير مستقبل الأطراف الصناعية والعلاج الفيزيائي وطب
              القدم.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-500 rounded-lg font-bold hover:shadow-xl hover:scale-105 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                تواصل معنا
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white border-2 border-white rounded-lg font-bold hover:bg-white hover:text-primary-500 transition-all"
              >
                <Info className="w-5 h-5" />
                تعرّف علينا
              </Link>
            </div>
          </div>
        </section>

        {/* Why Partner With Us */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                لماذا الشراكة معنا؟
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                تقدّم Vitaxir فرصًا للتعاون والشراكات الاستراتيجية مع مجموعة
                متنوعة من الجهات لتحقيق قيمة مشتركة ومستدامة، وتشمل
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: TrendingUp,
                  title: " الجهات والمنشآت الطبية",
                  description:
                    " تأسيس وتشغيل مراكز مجهزة وفق أعلى معايير الجودة.  ",
                },
                {
                  icon: Users,
                  title: "المستثمرين ",
                  description:
                    " فرص استثمارية في قطاع الأطراف الصناعية والعلاج الفيزيائي الواعد.",
                },
                {
                  icon: Target,
                  title: " مؤسسات الرعاية الصحية",
                  description:
                    " تطوير خدمات تأهيلية متكاملة ومستدامة.",
                },
                {
                  icon: Heart,
                  title: "المنظمات الإنسانية",
                  description:
                    "دعم مشاريع التأهيل وتحسين الوصول إلى خدمات طبية متقدمة.",
                },
                {
                  icon: Wrench,
                  title: "مطوري المنتجات الطبية",
                  description:
                    "شراكات لتطوير الأجهزة والتقنيات الحديثة.",
                },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border-2 border-gray-200 hover:border-accent-500 transition-all text-center"
                  >
                    <div className="inline-block p-4 bg-accent-100 rounded-xl mb-4">
                      <Icon className="w-8 h-8 text-accent-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Partnership Form */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8 md:p-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary-100 rounded-xl">
                  <FileText className="w-6 h-6 text-primary-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  نموذج طلب الشراكة
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Organization Name */}
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    اسم المؤسسة / الشركة <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleChange}
                      required
                      className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                      placeholder="أدخل اسم المؤسسة"
                    />
                  </div>
                </div>

                {/* Contact Person & Email */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      اسم الشخص المسؤول <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleChange}
                        required
                        className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                        placeholder="الاسم الكامل"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      البريد الإلكتروني <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Phone & Country */}
                <div className="grid md:grid-cols-2 gap-6">
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
                        placeholder="+963-XX-XXX-XXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      الدولة <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Globe className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                        placeholder="الإمارات العربية المتحدة"
                      />
                    </div>
                  </div>
                </div>

                {/* Partnership Type */}
                <div>
                  <label className="block text-gray-700 font-bold mb-3">
                    نوع الشراكة <span className="text-red-500">*</span>
                  </label>
                  <div className="grid md:grid-cols-3 gap-4">
                    {partnershipTypes.map((type) => (
                      <label
                        key={type.value}
                        className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          formData.partnershipType === type.value
                            ? "border-accent-500 bg-accent-50"
                            : "border-gray-200 hover:border-accent-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="partnershipType"
                          value={type.value}
                          checked={formData.partnershipType === type.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              formData.partnershipType === type.value
                                ? "border-accent-500 bg-accent-500"
                                : "border-gray-300"
                            }`}
                          >
                            {formData.partnershipType === type.value && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="font-bold text-gray-900">
                            {type.label}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {type.description}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Inquiry Details */}
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    تفاصيل الاستفسار <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="inquiryDetails"
                    value={formData.inquiryDetails}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors resize-none"
                    placeholder="أخبرنا المزيد عن مؤسستك ونوع الشراكة المطلوبة..."
                  />
                </div>

                {/* Submit Button */}
                <LoadingButton
                  type="submit"
                  isLoading={isSubmitting}
                  loadingText="جاري الإرسال..."
                  icon={<Check className="w-5 h-5" />}
                  className="w-full py-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  إرسال الطلب
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
