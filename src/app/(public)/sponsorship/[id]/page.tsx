// src/app/(public)/sponsorship/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Heart,
  ArrowRight,
  Calendar,
  User,
  Target,
  TrendingUp,
  Mail,
  Phone,
  CreditCard,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  sponsorshipCasesApi,
  sponsorshipDonationsApi,
} from "@/lib/api/sponsorship";
import type { SponsorshipCase } from "@/types/sponsorship";
import { getImageUrl } from "@/lib/utils/imageUrl";
import { formatPriceWithLabel } from "@/lib/utils/currencyFormatter";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";

export default function PublicSponsorshipDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [caseData, setCaseData] = useState<SponsorshipCase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDonationForm, setShowDonationForm] = useState(false);

  // Donation Form State
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CREDIT_CARD");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCase();
  }, [params.id]);

  const loadCase = async () => {
    try {
      setIsLoading(true);
      const data = await sponsorshipCasesApi.getById(params.id);

      // Check if case is available for donations
      if (data.status !== "ONGOING") {
        toast.error("هذه الحالة غير متاحة للتبرع");
        router.push("/sponsorship");
        return;
      }

      setCaseData(data);
    } catch (error: any) {
      toast.error("فشل تحميل بيانات الحالة");
      router.push("/sponsorship");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!isAnonymous) {
      if (!donorName.trim()) {
        toast.error("يرجى إدخال الاسم");
        return;
      }
      if (!donorEmail.trim()) {
        toast.error("يرجى إدخال البريد الإلكتروني");
        return;
      }
      if (!donorPhone.trim()) {
        toast.error("يرجى إدخال رقم الهاتف");
        return;
      }
    }

    if (!amount || Number(amount) <= 0) {
      toast.error("يرجى إدخال مبلغ التبرع");
      return;
    }

    try {
      setIsSubmitting(true);

      const donationData = {
        donorName: isAnonymous ? "متبرع مجهول" : donorName.trim(),
        donorEmail: isAnonymous ? "anonymous@vitaxir.com" : donorEmail.trim(),
        donorPhone: isAnonymous ? "000000000" : donorPhone.trim(),
        amount: Number(amount),
        paymentMethod,
        isAnonymous,
        message: message.trim() || undefined,
        paymentStatus: "PENDING" as const,
      };

      await sponsorshipDonationsApi.create(params.id, donationData);

      toast.success(
        "تم إرسال طلب التبرع بنجاح! سيتم التواصل معك لإتمام عملية الدفع."
      );

      // Reset form
      setDonorName("");
      setDonorEmail("");
      setDonorPhone("");
      setAmount("");
      setMessage("");
      setIsAnonymous(false);
      setShowDonationForm(false);

      // Reload case data
      loadCase();
    } catch (error: any) {
      toast.error(error.message || "فشل إرسال التبرع");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateProgress = (raised: number, target: number) => {
    return Math.min((raised / target) * 100, 100).toFixed(1);
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4">
            <LoadingSpinner size="lg" className="text-primary-500" />
            <p className="text-gray-700 font-semibold text-lg">
              جاري تحميل الحالة...
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!caseData) {
    return null;
  }

  const progress = calculateProgress(caseData.raisedAmount, caseData.targetAmount);
  const remaining = Math.max(0, caseData.targetAmount - caseData.raisedAmount);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="relative h-[500px] flex items-end overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={getImageUrl(caseData.caseImage)}
              alt={caseData.patientName}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>

          <div className="relative z-10 w-full px-4 pb-12">
            <div className="max-w-7xl mx-auto">
              <button
                onClick={() => router.back()}
                className="mb-6 flex items-center gap-2 text-white hover:text-accent-300 transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
                <span className="font-medium">العودة للقائمة</span>
              </button>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {caseData.patientName}
              </h1>
              <div className="flex items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>العمر: {caseData.age} سنة</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>
                    {new Date(caseData.startDate).toLocaleDateString("ar-SA")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    وصف الحالة
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                    {caseData.caseDescription}
                  </p>
                </div>

                {/* Video */}
                {caseData.videoUrl && (
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      فيديو الحالة
                    </h2>
                    <video
                      src={getImageUrl(caseData.videoUrl)}
                      controls
                      className="w-full rounded-xl"
                    />
                  </div>
                )}

                {/* Donation Form */}
                {showDonationForm ? (
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      نموذج التبرع
                    </h2>

                    <form onSubmit={handleDonationSubmit} className="space-y-6">
                      {/* Anonymous Toggle */}
                      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isAnonymous}
                            onChange={(e) => setIsAnonymous(e.target.checked)}
                            className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          />
                          <span className="text-sm font-medium text-gray-900">
                            أرغب بالتبرع بشكل مجهول
                          </span>
                        </label>
                      </div>

                      {!isAnonymous && (
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              الاسم الكامل 
                            </label>
                            <div className="relative">
                              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="text"
                                value={donorName}
                                onChange={(e) => setDonorName(e.target.value)}
                                className="w-full pr-11 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="اسمك الكامل"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              البريد الإلكتروني 
                            </label>
                            <div className="relative">
                              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="email"
                                value={donorEmail}
                                onChange={(e) => setDonorEmail(e.target.value)}
                                className="w-full pr-11 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="email@example.com"
                              />
                            </div>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              رقم الهاتف 
                            </label>
                            <div className="relative">
                              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="tel"
                                value={donorPhone}
                                onChange={(e) => setDonorPhone(e.target.value)}
                                className="w-full pr-11 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="05xxxxxxxx"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            $ مبلغ التبرع 
                          </label>
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min="1"
                            step="0.01"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg font-bold"
                            placeholder="0.00"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            طريقة الدفع 
                          </label>
                          <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          >
                            <option value="CREDIT_CARD">بطاقة ائتمانية</option>
                            <option value="BANK_TRANSFER">تحويل بنكي</option>
                            <option value="CASH">نقداً</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          رسالة (اختياري)
                        </label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                          placeholder="اترك رسالة تشجيعية..."
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button
                          type="submit"
                          variant="primary"
                          disabled={isSubmitting}
                          className="flex-1"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                              جاري الإرسال...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-5 h-5 ml-2" />
                              تأكيد التبرع
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => setShowDonationForm(false)}
                          disabled={isSubmitting}
                        >
                          إلغاء
                        </Button>
                      </div>
                    </form>
                  </div>
                ) : null}
              </div>

              {/* Right Column - Donation Info */}
              <div className="space-y-6">
                {/* Progress Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-10 h-10 text-white fill-current" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      ساهم في إنقاذ حياة
                    </h3>
                  </div>

                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">نسبة الإنجاز</span>
                      <span className="font-bold text-gray-900">
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                      <div
                        className="bg-gradient-to-r from-accent-500 to-accent-600 h-4 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Amount Stats */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                      <span className="text-sm text-gray-600 font-medium">
                        تم جمعه
                      </span>
                      <span className="font-bold text-green-700 text-lg">
                        {formatPriceWithLabel(caseData.raisedAmount)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                      <span className="text-sm text-gray-600 font-medium">
                        المستهدف
                      </span>
                      <span className="font-bold text-blue-700 text-lg">
                        {formatPriceWithLabel(caseData.targetAmount)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                      <span className="text-sm text-gray-600 font-medium">
                        المتبقي
                      </span>
                      <span className="font-bold text-orange-700 text-lg">
                        {formatPriceWithLabel(remaining)}
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  {!showDonationForm && (
                    <button
                      onClick={() => setShowDonationForm(true)}
                      className="w-full py-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold text-lg rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Heart className="w-6 h-6" />
                      تبرع الآن
                    </button>
                  )}

                  {/* Info Note */}
                  <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                    <p className="text-sm text-blue-800 text-center leading-relaxed">
                      سيتم التواصل معك لإتمام عملية الدفع بعد إرسال النموذج
                    </p>
                  </div>
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
