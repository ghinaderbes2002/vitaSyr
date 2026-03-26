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
  Users,
} from "lucide-react";
import Image from "next/image";
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

  const [ref1Name, setRef1Name] = useState("");
  const [ref1Company, setRef1Company] = useState("");
  const [ref1JobTitle, setRef1JobTitle] = useState("");
  const [ref1Phone, setRef1Phone] = useState("");
  const [ref2Name, setRef2Name] = useState("");
  const [ref2Company, setRef2Company] = useState("");
  const [ref2JobTitle, setRef2JobTitle] = useState("");
  const [ref2Phone, setRef2Phone] = useState("");

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

    if (!ref1Name || !ref1Company || !ref1JobTitle || !ref1Phone ||
        !ref2Name || !ref2Company || !ref2JobTitle || !ref2Phone) {
      toast.error("الرجاء ملء جميع حقول المراجع");
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
          ref1Name: ref1Name.trim(),
          ref1Company: ref1Company.trim(),
          ref1JobTitle: ref1JobTitle.trim(),
          ref1Phone: ref1Phone.trim(),
          ref2Name: ref2Name.trim(),
          ref2Company: ref2Company.trim(),
          ref2JobTitle: ref2JobTitle.trim(),
          ref2Phone: ref2Phone.trim(),
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
      setRef1Name(""); setRef1Company(""); setRef1JobTitle(""); setRef1Phone("");
      setRef2Name(""); setRef2Company(""); setRef2JobTitle(""); setRef2Phone("");

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
        <section className="relative min-h-[500px] flex items-center">
          <div className="absolute inset-0">
            <Image
              src="/join-us/بانر انضم إلينا.png"
              alt="انضم إلينا"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-primary-900/40" />
          </div>
          <div className="relative max-w-4xl mx-auto text-center text-white px-4 py-20">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">انضم إلينا</h1>
            <p className="text-xl md:text-2xl opacity-95 leading-relaxed">
              كن جزءًا من رحلة تطوير مستقبل الأطراف الصناعية والعلاج الفيزيائي،
              وساهم في تقديم خدمات عالية الجودة للمجتمع إذا كنت متخصصًا في أحد
              المجالات التالية أو لديك خبرة ذات صلة، فنحن نرحّب بك
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
                  img: "/join-us/ايقونات_توظف معنا - بيئة احترافية.png",
                  title: "بيئة احترافية",
                  description: "فريق متخصص ومتعاون",
                },
                {
                  img: "/join-us/ايقونات_توظف معنا - فرص للتطوير.png",
                  title: "فرص للتطور",
                  description: "تدريب مستمر وتطوير مهني",
                },
                {
                  img: "/join-us/ايقونات_توظف معنا - أثر ايجابيي.png",
                  title: "أثر إيجابي",
                  description: "خدمة المجتمع وتغيير حياة الناس",
                },
                {
                  img: "/join-us/ايقونات_توظف معنا- مزايا تنافسية.png",
                  title: "مزايا تنافسية",
                  description: "رواتب ومزايا جيدة",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="inline-block p-4 bg-accent-100 rounded-xl mb-4">
                    <div className="relative w-8 h-8">
                      <Image
                        src={item.img}
                        alt={item.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
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
                        placeholder="+963-XX-XXX-XXXX"
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
                        onChange={(e) =>
                          setYearsOfExperience(Number(e.target.value))
                        }
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

                {/* References Section */}
                <div className="border-t-2 border-gray-200 pt-6 mt-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <Users className="w-5 h-5 text-primary-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">المراجع</h3>
                  </div>

                  {/* المرجع الأول */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      المرجع الأول <span className="text-red-500">*</span>
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-bold mb-2">اسم الشخص المرجعي</label>
                        <input type="text" value={ref1Name} onChange={(e) => setRef1Name(e.target.value)} required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                          placeholder="الاسم الكامل" />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-bold mb-2">اسم الشركة</label>
                        <input type="text" value={ref1Company} onChange={(e) => setRef1Company(e.target.value)} required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                          placeholder="اسم الشركة التي يعمل بها" />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-bold mb-2">المسمى الوظيفي</label>
                        <input type="text" value={ref1JobTitle} onChange={(e) => setRef1JobTitle(e.target.value)} required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                          placeholder="مسماه الوظيفي" />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-bold mb-2">رقم التواصل</label>
                        <input type="tel" value={ref1Phone} onChange={(e) => setRef1Phone(e.target.value)} required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                          placeholder="+963-XX-XXX-XXXX" />
                      </div>
                    </div>
                  </div>

                  {/* المرجع الثاني */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      المرجع الثاني <span className="text-red-500">*</span>
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-bold mb-2">اسم الشخص المرجعي</label>
                        <input type="text" value={ref2Name} onChange={(e) => setRef2Name(e.target.value)} required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                          placeholder="الاسم الكامل" />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-bold mb-2">اسم الشركة</label>
                        <input type="text" value={ref2Company} onChange={(e) => setRef2Company(e.target.value)} required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                          placeholder="اسم الشركة التي يعمل بها" />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-bold mb-2">المسمى الوظيفي</label>
                        <input type="text" value={ref2JobTitle} onChange={(e) => setRef2JobTitle(e.target.value)} required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                          placeholder="مسماه الوظيفي" />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-bold mb-2">رقم التواصل</label>
                        <input type="tel" value={ref2Phone} onChange={(e) => setRef2Phone(e.target.value)} required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
                          placeholder="+963-XX-XXX-XXXX" />
                      </div>
                    </div>
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
