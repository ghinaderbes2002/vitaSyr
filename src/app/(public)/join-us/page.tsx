// src/app/join-us/page.tsx

"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { jobsApi } from "@/lib/api/jobs";
import { toast } from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Clock,
  FileText,
  Upload,
  Linkedin,
  Check,
  Award,
  Users,
  TrendingUp,
  Heart,
} from "lucide-react";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { LoadingButton } from "@/components/ui/LoadingSpinner";

export default function JoinUsPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState<number | "">("");
  const [education, setEducation] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const specializations = [
    "الهندسة الطبية",
    "الأطراف الصناعية",
    "العلاج الفيزيائي",
    "التمريض المتخصص",
    "الإدارة الطبية",
    "أخرى",
  ];

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("حجم الملف يجب أن يكون أقل من 5 ميجابايت");
        return;
      }
      setCvFile(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!cvFile) {
      toast.error("الرجاء رفع ملف السيرة الذاتية (CV)");
      return;
    }

    if (!fullName || !email || !phone || !specialization || !yearsOfExperience || !education) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    setIsSubmitting(true);

    try {
      // إرسال البيانات مع ملف CV
      await jobsApi.createWithCV(
        {
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          specialization,
          yearsOfExperience: Number(yearsOfExperience),
          education: education.trim(),
          coverLetter: coverLetter.trim() || undefined,
          linkedinUrl: linkedinUrl.trim() || undefined,
        },
        cvFile
      );

      toast.success("تم تقديم طلبك بنجاح! سنتواصل معك قريباً");

      // إعادة تعيين الفورم
      setFullName("");
      setEmail("");
      setPhone("");
      setSpecialization("");
      setYearsOfExperience("");
      setEducation("");
      setCvFile(null);
      setCoverLetter("");
      setLinkedinUrl("");

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error: any) {
      console.error("Error submitting job application:", error);
      const errorMessage = error.response?.data?.message || "حدث خطأ أثناء إرسال الطلب، حاول مرة أخرى";
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
              <Users className="w-16 h-16" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">انضم إلينا</h1>
            <p className="text-xl md:text-2xl opacity-95 leading-relaxed">
              كن جزءاً من فريقنا المتميز في خدمة المجتمع
            </p>
          </div>
        </section>

        {/* Specializations Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              نبحث عن متخصصين في المجالات التالية
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                "الهندسة الطبية",
                "الأطراف الصناعية",
                "العلاج الفيزيائي",
                "التمريض المتخصص",
                "الإدارة الطبية",
                "اختصاصات أخرى",
              ].map((spec, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-4 bg-accent-50 rounded-lg border-2 border-accent-200"
                >
                  <Check className="w-5 h-5 text-accent-500 flex-shrink-0" />
                  <span className="font-semibold text-gray-900">{spec}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Join Us */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                لماذا تنضم إلينا؟
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                نوفر بيئة عمل محفزة ومهنية تساعدك على النمو والتطور
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  icon: Award,
                  title: "بيئة احترافية",
                  description: "فريق متخصص ومتعاون",
                },
                {
                  icon: TrendingUp,
                  title: "فرص للتطور",
                  description: "تدريب مستمر وتطوير مهني",
                },
                {
                  icon: Heart,
                  title: "أثر إيجابي",
                  description: "خدمة المجتمع وتغيير حياة الناس",
                },
                {
                  icon: Briefcase,
                  title: "مزايا تنافسية",
                  description: "رواتب ومزايا جيدة",
                },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="inline-block p-4 bg-accent-100 rounded-xl mb-4">
                      <Icon className="w-8 h-8 text-accent-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8 md:p-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary-100 rounded-xl">
                  <FileText className="w-6 h-6 text-primary-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  قدّم طلبك الآن
                </h2>
              </div>

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
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      البريد الإلكتروني <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      رقم الهاتف <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                        placeholder="+971-XX-XXX-XXXX"
                      />
                    </div>
                  </div>
                </div>

                {/* Specialization & Years of Experience */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      التخصص <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                      <select
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        required
                        className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors appearance-none"
                      >
                        <option value="">اختر التخصص</option>
                        {specializations.map((spec) => (
                          <option key={spec} value={spec}>
                            {spec}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      سنوات الخبرة <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={yearsOfExperience}
                        onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                        required
                        min={0}
                        max={50}
                        className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Education */}
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    المؤهل العلمي <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      required
                      className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                      placeholder="بكالوريوس، ماجستير، دكتوراه، إلخ"
                    />
                  </div>
                </div>

                {/* CV Upload */}
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    السيرة الذاتية (CV) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-accent-500 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-accent-100 rounded-lg">
                        <Upload className="w-6 h-6 text-accent-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">
                          {cvFile ? cvFile.name : "اختر ملف السيرة الذاتية"}
                        </p>
                        <p className="text-sm text-gray-600">
                          PDF, DOC, DOCX (حجم أقصى: 5 ميجابايت)
                        </p>
                      </div>
                      <label className="cursor-pointer px-6 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors">
                        <span>رفع ملف</span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          required
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Cover Letter */}
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    رسالة تغطية (اختياري)
                  </label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors resize-none"
                    placeholder="اكتب رسالة تعريفية موجزة عن نفسك وخبراتك..."
                  />
                </div>

                {/* LinkedIn URL */}
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    رابط لينكدإن (اختياري)
                  </label>
                  <div className="relative">
                    <Linkedin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                      placeholder="https://linkedin.com/in/your-profile"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <LoadingButton
                  type="submit"
                  isLoading={isSubmitting}
                  loadingText="جاري الإرسال..."
                  icon={<Check className="w-5 h-5" />}
                  className="w-full py-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  قدّم طلبك
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
