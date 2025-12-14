// src/app/(public)/appointments/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { appointmentsApi } from "@/lib/api/appointments";
import { toast } from "react-hot-toast";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MessageSquare,
  Check,
  PhoneCall,
} from "lucide-react";
import type { CreateAppointmentData, AppointmentType } from "@/types/appointment";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { LoadingButton } from "@/components/ui/LoadingSpinner";

export default function AppointmentsPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateAppointmentData>({
    patientName: "",
    phone: "",
    email: "",
    appointmentType: "CONSULTATION",
    appointmentDate: "",
    appointmentTime: "",
    notes: "",
  });

  const appointmentTypes: { value: AppointmentType; label: string }[] = [
    { value: "CONSULTATION", label: "استشارة أولية" },
    { value: "FOLLOW_UP", label: "متابعة" },
    { value: "OTHER", label: "أخرى" },
  ];

  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.patientName || !formData.phone || !formData.appointmentDate || !formData.appointmentTime) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      setIsSubmitting(true);
      await appointmentsApi.create(formData);
      toast.success("تم حجز الموعد بنجاح! سنتواصل معك قريباً");

      // Reset form
      setFormData({
        patientName: "",
        phone: "",
        email: "",
        appointmentType: "CONSULTATION",
        appointmentDate: "",
        appointmentTime: "",
        notes: "",
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("فشل في حجز الموعد. الرجاء المحاولة مرة أخرى");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-500 to-accent-500 py-16 px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">احجز موعدك الآن</h1>
            <p className="text-xl opacity-95">
              املأ النموذج أدناه وسيتواصل معك فريقنا لتأكيد موعدك
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Appointment Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-accent-100 rounded-xl">
                      <Calendar className="w-6 h-6 text-accent-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">بيانات الموعد</h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Patient Name */}
                    <div>
                      <label className="block text-gray-700 font-bold mb-2">
                        الاسم الكامل <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="patientName"
                          value={formData.patientName}
                          onChange={handleChange}
                          required
                          className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                          placeholder="أدخل اسمك الكامل"
                        />
                      </div>
                    </div>

                    {/* Phone & Email */}
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
                          البريد الإلكتروني
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

                    {/* Appointment Type */}
                    <div>
                      <label className="block text-gray-700 font-bold mb-2">
                        نوع الموعد <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="appointmentType"
                        value={formData.appointmentType}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                      >
                        {appointmentTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Date & Time */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-bold mb-2">
                          التاريخ <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="date"
                            name="appointmentDate"
                            value={formData.appointmentDate}
                            onChange={handleChange}
                            min={today}
                            required
                            className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-bold mb-2">
                          الوقت <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <select
                            name="appointmentTime"
                            value={formData.appointmentTime}
                            onChange={handleChange}
                            required
                            className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors appearance-none"
                          >
                            <option value="">اختر الوقت</option>
                            {timeSlots.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-gray-700 font-bold mb-2">
                        ملاحظات إضافية
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
                        <textarea
                          name="notes"
                          value={formData.notes}
                          onChange={handleChange}
                          rows={4}
                          className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors resize-none"
                          placeholder="أخبرنا عن حالتك أو أي تفاصيل إضافية..."
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <LoadingButton
                      type="submit"
                      isLoading={isSubmitting}
                      loadingText="جاري الحجز..."
                      icon={<Check className="w-5 h-5" />}
                      className="w-full py-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all"
                    >
                      تأكيد الحجز
                    </LoadingButton>
                  </form>
                </div>
              </div>

              {/* Contact Info Box */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8 sticky top-24">
                  <div className="flex items-center gap-3 mb-8">
                    <PhoneCall className="w-8 h-8 text-accent-500" />
                    <h3 className="text-2xl font-bold text-gray-900">تفضل الاتصال المباشر؟</h3>
                  </div>

                  <div className="space-y-6">
                    {/* Phone */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Phone className="w-5 h-5 text-gray-600" />
                        <span className="font-semibold text-gray-600">هاتف</span>
                      </div>
                      <a
                        href="tel:+963935813333"
                        className="text-2xl font-bold text-gray-900 hover:text-accent-500 transition-colors block"
                        dir="ltr"
                      >
                        +963 935 813 333
                      </a>
                    </div>

                    <div className="border-t border-gray-200"></div>

                    {/* WhatsApp */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <MessageSquare className="w-5 h-5 text-gray-600" />
                        <span className="font-semibold text-gray-600">واتساب</span>
                      </div>
                      <a
                        href="https://wa.me/963935813333"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xl font-bold text-gray-900 hover:text-accent-500 transition-colors block"
                        dir="ltr"
                      >
                        +963 935 813 333
                      </a>
                    </div>

                    <div className="border-t border-gray-200"></div>

                    {/* Working Hours */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-gray-600" />
                        <span className="font-semibold text-gray-600">متاح</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">9 صباحاً - 8 مساءً</p>
                      <p className="text-gray-600 text-sm">(7 أيام)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
