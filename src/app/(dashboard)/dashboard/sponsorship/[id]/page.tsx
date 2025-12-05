// src/app/(dashboard)/dashboard/sponsorship/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowRight,
  Edit,
  Calendar,
  DollarSign,
  User,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  TrendingUp,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { sponsorshipCasesApi, sponsorshipDonationsApi } from "@/lib/api/sponsorship";
import { Button } from "@/components/ui/Button";
import type { SponsorshipCase, SponsorshipDonation } from "@/types/sponsorship";
import { getImageUrl } from "@/lib/utils/imageUrl";
import { formatPriceWithLabel } from "@/lib/utils/currencyFormatter";

export default function SponsorshipDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [caseData, setCaseData] = useState<SponsorshipCase | null>(null);
  const [donations, setDonations] = useState<SponsorshipDonation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [params.id]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [caseResult, donationsResult] = await Promise.all([
        sponsorshipCasesApi.getById(params.id),
        sponsorshipDonationsApi.getByCaseId(params.id),
      ]);
      setCaseData(caseResult);
      setDonations(donationsResult);
    } catch (error: any) {
      toast.error("فشل تحميل البيانات");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<
      string,
      { label: string; className: string; icon: any }
    > = {
      ONGOING: {
        label: "جارية",
        className: "bg-blue-100 text-blue-800",
        icon: Clock,
      },
      COMPLETED: {
        label: "مكتملة",
        className: "bg-green-100 text-green-800",
        icon: CheckCircle,
      },
      CANCELLED: {
        label: "ملغية",
        className: "bg-red-100 text-red-800",
        icon: XCircle,
      },
    };
    return badges[status] || badges.ONGOING;
  };

  const getPaymentStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      PENDING: { label: "قيد الانتظار", className: "bg-yellow-100 text-yellow-800" },
      COMPLETED: { label: "مكتمل", className: "bg-green-100 text-green-800" },
      FAILED: { label: "فشل", className: "bg-red-100 text-red-800" },
    };
    return badges[status] || badges.PENDING;
  };

  const calculateProgress = (raised: number, target: number) => {
    return Math.min((raised / target) * 100, 100).toFixed(1);
  };

  const handleUpdateDonationStatus = async (
    donationId: string,
    newStatus: string
  ) => {
    try {
      await sponsorshipDonationsApi.updateStatus(params.id, donationId, newStatus);
      toast.success("تم تحديث حالة التبرع بنجاح");
      loadData(); // Reload data to reflect changes
    } catch (error: any) {
      toast.error("فشل تحديث حالة التبرع");
    }
  };

  const totalDonations = donations.filter(d => d.paymentStatus === "COMPLETED").length;
  const totalAmount = donations
    .filter(d => d.paymentStatus === "COMPLETED")
    .reduce((sum, d) => sum + d.amount, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">الحالة غير موجودة</p>
      </div>
    );
  }

  const statusBadge = getStatusBadge(caseData.status);
  const StatusIcon = statusBadge.icon;
  const progress = calculateProgress(caseData.raisedAmount, caseData.targetAmount);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{caseData.patientName}</h1>
            <p className="text-gray-600 mt-1">تفاصيل حالة الكفالة</p>
          </div>
        </div>
        <Button
          variant="primary"
          onClick={() => router.push(`/dashboard/sponsorship/${params.id}/edit`)}
        >
          <Edit className="w-5 h-5 ml-2" />
          تعديل
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Case Image & Video */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="relative h-96">
              <Image
                src={getImageUrl(caseData.caseImage)}
                alt={caseData.patientName}
                fill
                className="object-cover"
              />
              {caseData.isFeatured && (
                <div className="absolute top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                  <Star className="w-4 h-4 fill-current" />
                  حالة مميزة
                </div>
              )}
              <div className="absolute bottom-4 left-4">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusBadge.className}`}
                >
                  <StatusIcon className="w-4 h-4" />
                  {statusBadge.label}
                </span>
              </div>
            </div>

            {caseData.videoUrl && (
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">فيديو الحالة</h3>
                <video
                  src={getImageUrl(caseData.videoUrl)}
                  controls
                  className="w-full rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Case Description */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">وصف الحالة</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {caseData.caseDescription}
            </p>
          </div>

          {/* Donations List */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                التبرعات ({totalDonations})
              </h3>
              <span className="text-sm text-gray-600">
                إجمالي: {formatPriceWithLabel(totalAmount)}
              </span>
            </div>

            {donations.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">لا توجد تبرعات حتى الآن</p>
              </div>
            ) : (
              <div className="space-y-3">
                {donations.map((donation) => {
                  return (
                    <div
                      key={donation.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold text-gray-900">
                              {donation.isAnonymous ? "متبرع مجهول" : donation.donorName}
                            </span>
                          </div>
                          {!donation.isAnonymous && (
                            <div className="space-y-1 text-sm text-gray-600 mr-6">
                              <div className="flex items-center gap-2">
                                <Mail className="w-3 h-3" />
                                {donation.donorEmail}
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-3 h-3" />
                                {donation.donorPhone}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="text-left">
                          <div className="text-lg font-bold text-accent-600 mb-2">
                            {formatPriceWithLabel(donation.amount)}
                          </div>
                          {/* Payment Status Selector */}
                          <select
                            value={donation.paymentStatus}
                            onChange={(e) =>
                              handleUpdateDonationStatus(donation.id, e.target.value)
                            }
                            className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium border-2 cursor-pointer transition-colors ${
                              donation.paymentStatus === "COMPLETED"
                                ? "bg-green-50 border-green-200 text-green-800"
                                : donation.paymentStatus === "PENDING"
                                ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                                : "bg-red-50 border-red-200 text-red-800"
                            }`}
                          >
                            <option value="PENDING">قيد الانتظار</option>
                            <option value="COMPLETED">مكتمل</option>
                            <option value="FAILED">فشل</option>
                          </select>
                        </div>
                      </div>

                      {donation.message && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700 italic">"{donation.message}"</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                        <span>طريقة الدفع: {donation.paymentMethod}</span>
                        <span>
                          {new Date(donation.createdAt).toLocaleDateString("en-GB")}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">التقدم المالي</h3>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">نسبة الإنجاز</span>
                <span className="font-bold text-gray-900">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-accent-500 to-accent-600 h-3 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-600">تم جمعه</span>
                <span className="font-bold text-green-700">
                  {formatPriceWithLabel(caseData.raisedAmount)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-600">المستهدف</span>
                <span className="font-bold text-blue-700">
                  {formatPriceWithLabel(caseData.targetAmount)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">المتبقي</span>
                <span className="font-bold text-gray-700">
                  {formatPriceWithLabel(
                    Math.max(0, caseData.targetAmount - caseData.raisedAmount)
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm text-gray-600">التكلفة التقديرية</span>
                <span className="font-bold text-purple-700">
                  {formatPriceWithLabel(caseData.estimatedCost)}
                </span>
              </div>
            </div>
          </div>

          {/* Patient Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">معلومات المريض</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">الاسم:</span>
                <span className="font-semibold text-gray-900">{caseData.patientName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">العمر:</span>
                <span className="font-semibold text-gray-900">{caseData.age} سنة</span>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">التواريخ</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600 block mb-1">تاريخ البداية:</span>
                <p className="text-gray-900 font-medium">
                  {new Date(caseData.startDate).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <span className="text-gray-600 block mb-1">تاريخ النهاية:</span>
                <p className="text-gray-900 font-medium">
                  {new Date(caseData.endDate).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <span className="text-gray-600 block mb-1">تاريخ الإنشاء:</span>
                <p className="text-gray-900 font-medium">
                  {new Date(caseData.createdAt).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <span className="text-gray-600 block mb-1">آخر تحديث:</span>
                <p className="text-gray-900 font-medium">
                  {new Date(caseData.updatedAt).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">إحصائيات التبرعات</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">عدد التبرعات</span>
                <span className="font-bold text-gray-900">{totalDonations}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">قيد الانتظار</span>
                <span className="font-bold text-yellow-600">
                  {donations.filter((d) => d.paymentStatus === "PENDING").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">فشلت</span>
                <span className="font-bold text-red-600">
                  {donations.filter((d) => d.paymentStatus === "FAILED").length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
