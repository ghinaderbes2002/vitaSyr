// src/app/join-us/page.tsx

"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
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
  const [mightHaveSubmitted, setMightHaveSubmitted] = useState(false);
  const isSubmittingRef = useRef(false);

  const [hasCompanyRelation, setHasCompanyRelation] = useState<boolean | null>(null);
  const [currentlyEmployed, setCurrentlyEmployed] = useState<boolean | null>(null);
  const [availabilityToJoin, setAvailabilityToJoin] = useState<"IMMEDIATE" | "WITHIN_ONE_WEEK" | "WITHIN_TWO_WEEKS" | "WITHIN_ONE_MONTH" | "">("");
  const [singleRefOnly, setSingleRefOnly] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
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
      if (errors.cvFile) setErrors(p => ({...p, cvFile: ""}));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = "الاسم الكامل مطلوب";
    if (!email.trim()) newErrors.email = "البريد الإلكتروني مطلوب";
    if (!phone.trim()) newErrors.phone = "رقم الهاتف مطلوب";
    if (!specialization) newErrors.specialization = "التخصص مطلوب";
    if (!yearsOfExperience) newErrors.yearsOfExperience = "سنوات الخبرة مطلوبة";
    if (!education.trim()) newErrors.education = "المؤهل العلمي مطلوب";
    if (!cvFile) newErrors.cvFile = "يرجى رفع ملف السيرة الذاتية (CV)";
    if (!ref1Name.trim()) newErrors.ref1Name = "اسم المرجع مطلوب";
    if (!ref1Phone.trim()) newErrors.ref1Phone = "رقم التواصل مطلوب";
    if (!singleRefOnly) {
      if (!ref1Company.trim()) newErrors.ref1Company = "اسم الشركة مطلوب";
      if (!ref1JobTitle.trim()) newErrors.ref1JobTitle = "المسمى الوظيفي مطلوب";
      if (!ref2Name.trim()) newErrors.ref2Name = "اسم المرجع مطلوب";
      if (!ref2Company.trim()) newErrors.ref2Company = "اسم الشركة مطلوب";
      if (!ref2JobTitle.trim()) newErrors.ref2JobTitle = "المسمى الوظيفي مطلوب";
      if (!ref2Phone.trim()) newErrors.ref2Phone = "رقم التواصل مطلوب";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      isSubmittingRef.current = false;
      return;
    }
    setErrors({});

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
          hasCompanyRelation: hasCompanyRelation ?? undefined,
          currentlyEmployed: currentlyEmployed ?? undefined,
          availabilityToJoin: availabilityToJoin || undefined,
          ref1Name: ref1Name.trim(),
          ref1Company: singleRefOnly ? "-" : ref1Company.trim(),
          ref1JobTitle: singleRefOnly ? "-" : ref1JobTitle.trim(),
          ref1Phone: ref1Phone.trim(),
          ref2Name: singleRefOnly ? "-" : ref2Name.trim(),
          ref2Company: singleRefOnly ? "-" : ref2Company.trim(),
          ref2JobTitle: singleRefOnly ? "-" : ref2JobTitle.trim(),
          ref2Phone: singleRefOnly ? "-" : ref2Phone.trim(),
        },
        cvFile!
      );

      toast.success("تم تقديم طلبك بنجاح! سنتواصل معك قريباً");
      setMightHaveSubmitted(false);

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
      setHasCompanyRelation(null);
      setCurrentlyEmployed(null);
      setAvailabilityToJoin("");
      setRef1Name(""); setRef1Company(""); setRef1JobTitle(""); setRef1Phone("");
      setRef2Name(""); setRef2Company(""); setRef2JobTitle(""); setRef2Phone("");

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error: any) {
      console.error("Error submitting job application:", error);
      const status = error.response?.status;
      let errorMessage = "حدث خطأ أثناء إرسال الطلب، حاول مرة أخرى";
      if (status === 413) {
        errorMessage = "حجم ملف السيرة الذاتية كبير جداً، يرجى رفع ملف أصغر من 5MB";
      } else if (status === 400) {
        errorMessage = error.response?.data?.message || "تأكد من ملء جميع الحقول بشكل صحيح";
      } else if (status >= 500) {
        errorMessage = "خطأ في الخادم، يرجى المحاولة لاحقاً";
      } else if (error.message === "Network Error" || !error.response) {
        setMightHaveSubmitted(true);
        errorMessage = "انقطع الاتصال أثناء الإرسال — قد يكون طلبك وصل إلينا بالفعل. تواصل معنا عبر واتساب للتأكيد قبل إعادة التقديم";
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
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
                      onChange={(e) => { setFullName(e.target.value); if (errors.fullName) setErrors(p => ({...p, fullName: ""})); }}
                      className={`w-full pr-12 pl-4 py-3 border-2 rounded-xl focus:ring-2 transition-colors ${errors.fullName ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-accent-500 focus:ring-accent-200"}`}
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                  {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
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
                        onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(p => ({...p, email: ""})); }}
                        className={`w-full pr-12 pl-4 py-3 border-2 rounded-xl focus:ring-2 transition-colors ${errors.email ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-accent-500 focus:ring-accent-200"}`}
                        placeholder="example@email.com"
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
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
                        onChange={(e) => { setPhone(e.target.value); if (errors.phone) setErrors(p => ({...p, phone: ""})); }}
                        className={`w-full pr-12 pl-4 py-3 border-2 rounded-xl focus:ring-2 transition-colors ${errors.phone ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-accent-500 focus:ring-accent-200"}`}
                        placeholder="+963-XX-XXX-XXXX"
                      />
                    </div>
                    {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
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
                        onChange={(e) => { setSpecialization(e.target.value); if (errors.specialization) setErrors(p => ({...p, specialization: ""})); }}
                        className={`w-full pr-12 pl-4 py-3 border-2 rounded-xl focus:ring-2 transition-colors appearance-none ${errors.specialization ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-accent-500 focus:ring-accent-200"}`}
                      >
                        <option value="">اختر التخصص</option>
                        {specializations.map((spec) => (
                          <option key={spec} value={spec}>
                            {spec}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.specialization && <p className="mt-1 text-sm text-red-500">{errors.specialization}</p>}
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
                        onChange={(e) => { setYearsOfExperience(Number(e.target.value)); if (errors.yearsOfExperience) setErrors(p => ({...p, yearsOfExperience: ""})); }}
                        min={0}
                        max={50}
                        className={`w-full pr-12 pl-4 py-3 border-2 rounded-xl focus:ring-2 transition-colors ${errors.yearsOfExperience ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-accent-500 focus:ring-accent-200"}`}
                        placeholder="0"
                      />
                    </div>
                    {errors.yearsOfExperience && <p className="mt-1 text-sm text-red-500">{errors.yearsOfExperience}</p>}
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
                      onChange={(e) => { setEducation(e.target.value); if (errors.education) setErrors(p => ({...p, education: ""})); }}
                      className={`w-full pr-12 pl-4 py-3 border-2 rounded-xl focus:ring-2 transition-colors ${errors.education ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-accent-500 focus:ring-accent-200"}`}
                      placeholder="بكالوريوس، ماجستير، دكتوراه، إلخ"
                    />
                  </div>
                  {errors.education && <p className="mt-1 text-sm text-red-500">{errors.education}</p>}
                </div>

                {/* CV Upload */}
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    السيرة الذاتية (CV) <span className="text-red-500">*</span>
                  </label>
                  <div className={`relative border-2 border-dashed rounded-xl p-6 transition-colors ${errors.cvFile ? "border-red-400 bg-red-50 hover:border-red-400" : "border-gray-300 hover:border-accent-500"}`}>
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
                  {errors.cvFile && <p className="mt-2 text-sm text-red-500">{errors.cvFile}</p>}
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

                {/* هل تعمل حالياً + إمكانية الالتحاق */}
                <div className="border-t-2 border-gray-200 pt-6 mt-6 space-y-6">
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      هل تربطك صلة قرابة بأحد موظفي الشركة أو بمورد تتعامل معه الشركة؟
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="hasCompanyRelation" value="true"
                          checked={hasCompanyRelation === true}
                          onChange={() => setHasCompanyRelation(true)}
                          className="w-4 h-4 accent-primary-500" />
                        <span className="text-gray-700">نعم</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="hasCompanyRelation" value="false"
                          checked={hasCompanyRelation === false}
                          onChange={() => setHasCompanyRelation(false)}
                          className="w-4 h-4 accent-primary-500" />
                        <span className="text-gray-700">لا</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-3">هل تعمل حالياً؟</label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="currentlyEmployed" value="true"
                          checked={currentlyEmployed === true}
                          onChange={() => setCurrentlyEmployed(true)}
                          className="w-4 h-4 accent-primary-500" />
                        <span className="text-gray-700">نعم</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="currentlyEmployed" value="false"
                          checked={currentlyEmployed === false}
                          onChange={() => setCurrentlyEmployed(false)}
                          className="w-4 h-4 accent-primary-500" />
                        <span className="text-gray-700">لا</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-3">إمكانية الالتحاق</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { value: "IMMEDIATE" as const, label: "فوري" },
                        { value: "WITHIN_ONE_WEEK" as const, label: "خلال أسبوع" },
                        { value: "WITHIN_TWO_WEEKS" as const, label: "خلال أسبوعين" },
                        { value: "WITHIN_ONE_MONTH" as const, label: "خلال شهر" },
                      ].map((option) => (
                        <label key={option.value}
                          className={`flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-colors
                            ${availabilityToJoin === option.value
                              ? "border-accent-500 bg-accent-50 text-accent-700 font-semibold"
                              : "border-gray-200 hover:border-accent-300"}`}>
                          <input type="radio" name="availabilityToJoin" value={option.value}
                            checked={availabilityToJoin === option.value}
                            onChange={() => setAvailabilityToJoin(option.value)}
                            className="hidden" />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* References Section */}
                <div className="border-t-2 border-gray-200 pt-6 mt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <Users className="w-5 h-5 text-primary-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">المراجع</h3>
                  </div>
                  <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-4">
                    <span className="text-blue-500 text-lg leading-tight">ℹ</span>
                    <p className="text-sm text-blue-700">ملاحظة: يرجى تزويدنا بمعلومات شخصين يمكن التواصل معهم للتحقق من خبرتك المهنية.</p>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer mb-6 w-fit">
                    <input
                      type="checkbox"
                      checked={singleRefOnly}
                      onChange={(e) => setSingleRefOnly(e.target.checked)}
                      className="w-5 h-5 accent-accent-500 cursor-pointer"
                    />
                    <span className="text-gray-700 font-medium">لم أعمل سابقا </span>
                  </label>

                  {singleRefOnly ? (
                    /* مرجع واحد فقط — اسم ورقم */
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-bold mb-2">اسم المرجع <span className="text-red-500">*</span></label>
                        <input type="text" value={ref1Name} onChange={(e) => { setRef1Name(e.target.value); if (errors.ref1Name) setErrors(p => ({...p, ref1Name: ""})); }}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-colors ${errors.ref1Name ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-accent-500 focus:ring-accent-200"}`}
                          placeholder="الاسم الكامل" />
                        {errors.ref1Name && <p className="mt-1 text-sm text-red-500">{errors.ref1Name}</p>}
                      </div>
                      <div>
                        <label className="block text-gray-700 font-bold mb-2">رقم التواصل <span className="text-red-500">*</span></label>
                        <input type="tel" value={ref1Phone} onChange={(e) => { setRef1Phone(e.target.value); if (errors.ref1Phone) setErrors(p => ({...p, ref1Phone: ""})); }}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-colors ${errors.ref1Phone ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-accent-500 focus:ring-accent-200"}`}
                          placeholder="+963-XX-XXX-XXXX" />
                        {errors.ref1Phone && <p className="mt-1 text-sm text-red-500">{errors.ref1Phone}</p>}
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* المرجع الأول */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">
                          المرجع الأول <span className="text-red-500">*</span>
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 font-bold mb-2">اسم الشخص المرجعي</label>
                            <input type="text" value={ref1Name} onChange={(e) => { setRef1Name(e.target.value); if (errors.ref1Name) setErrors(p => ({...p, ref1Name: ""})); }}
                              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-colors ${errors.ref1Name ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-accent-500 focus:ring-accent-200"}`}
                              placeholder="الاسم الكامل" />
                            {errors.ref1Name && <p className="mt-1 text-sm text-red-500">{errors.ref1Name}</p>}
                          </div>
                          <div>
                            <label className="block text-gray-700 font-bold mb-2">اسم الشركة</label>
                            <input type="text" value={ref1Company} onChange={(e) => { setRef1Company(e.target.value); if (errors.ref1Company) setErrors(p => ({...p, ref1Company: ""})); }}
                              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-colors ${errors.ref1Company ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-accent-500 focus:ring-accent-200"}`}
                              placeholder="اسم الشركة التي يعمل بها" />
                            {errors.ref1Company && <p className="mt-1 text-sm text-red-500">{errors.ref1Company}</p>}
                          </div>
                          <div>
                            <label className="block text-gray-700 font-bold mb-2">المسمى الوظيفي</label>
                            <input type="text" value={ref1JobTitle} onChange={(e) => { setRef1JobTitle(e.target.value); if (errors.ref1JobTitle) setErrors(p => ({...p, ref1JobTitle: ""})); }}
                              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-colors ${errors.ref1JobTitle ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-accent-500 focus:ring-accent-200"}`}
                              placeholder="مسماه الوظيفي" />
                            {errors.ref1JobTitle && <p className="mt-1 text-sm text-red-500">{errors.ref1JobTitle}</p>}
                          </div>
                          <div>
                            <label className="block text-gray-700 font-bold mb-2">رقم التواصل</label>
                            <input type="tel" value={ref1Phone} onChange={(e) => { setRef1Phone(e.target.value); if (errors.ref1Phone) setErrors(p => ({...p, ref1Phone: ""})); }}
                              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-colors ${errors.ref1Phone ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-accent-500 focus:ring-accent-200"}`}
                              placeholder="+963-XX-XXX-XXXX" />
                            {errors.ref1Phone && <p className="mt-1 text-sm text-red-500">{errors.ref1Phone}</p>}
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
                            <input type="text" value={ref2Name} onChange={(e) => { setRef2Name(e.target.value); if (errors.ref2Name) setErrors(p => ({...p, ref2Name: ""})); }}
                              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-colors ${errors.ref2Name ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-accent-500 focus:ring-accent-200"}`}
                              placeholder="الاسم الكامل" />
                            {errors.ref2Name && <p className="mt-1 text-sm text-red-500">{errors.ref2Name}</p>}
                          </div>
                          <div>
                            <label className="block text-gray-700 font-bold mb-2">اسم الشركة</label>
                            <input type="text" value={ref2Company} onChange={(e) => { setRef2Company(e.target.value); if (errors.ref2Company) setErrors(p => ({...p, ref2Company: ""})); }}
                              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-colors ${errors.ref2Company ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-accent-500 focus:ring-accent-200"}`}
                              placeholder="اسم الشركة التي يعمل بها" />
                            {errors.ref2Company && <p className="mt-1 text-sm text-red-500">{errors.ref2Company}</p>}
                          </div>
                          <div>
                            <label className="block text-gray-700 font-bold mb-2">المسمى الوظيفي</label>
                            <input type="text" value={ref2JobTitle} onChange={(e) => { setRef2JobTitle(e.target.value); if (errors.ref2JobTitle) setErrors(p => ({...p, ref2JobTitle: ""})); }}
                              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-colors ${errors.ref2JobTitle ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-accent-500 focus:ring-accent-200"}`}
                              placeholder="مسماه الوظيفي" />
                            {errors.ref2JobTitle && <p className="mt-1 text-sm text-red-500">{errors.ref2JobTitle}</p>}
                          </div>
                          <div>
                            <label className="block text-gray-700 font-bold mb-2">رقم التواصل</label>
                            <input type="tel" value={ref2Phone} onChange={(e) => { setRef2Phone(e.target.value); if (errors.ref2Phone) setErrors(p => ({...p, ref2Phone: ""})); }}
                              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-colors ${errors.ref2Phone ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-accent-500 focus:ring-accent-200"}`}
                              placeholder="+963-XX-XXX-XXXX" />
                            {errors.ref2Phone && <p className="mt-1 text-sm text-red-500">{errors.ref2Phone}</p>}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Warning: might have already submitted */}
                {mightHaveSubmitted && (
                  <div className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-xl text-sm text-yellow-800 flex items-start gap-3">
                    <span className="text-yellow-500 text-lg leading-tight flex-shrink-0">⚠</span>
                    <p>
                      <strong>تنبيه:</strong> قد يكون طلبك السابق وصل إلينا رغم ظهور الخطأ.
                      يرجى التواصل معنا عبر{" "}
                      <a href="https://wa.me/963987106020" target="_blank" rel="noopener noreferrer" className="underline font-bold text-green-700">واتساب</a>
                      {" "}للتأكيد قبل إعادة التقديم لتجنب التكرار.
                    </p>
                  </div>
                )}

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
