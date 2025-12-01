// src/app/(dashboard)/dashboard/appointments/new/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { appointmentsApi } from "@/lib/api/appointments";
import { casesApi } from "@/lib/api/cases";
import type { Case } from "@/types/case";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Save } from "lucide-react";

export default function NewAppointmentPage() {
  const router = useRouter();

  const [cases, setCases] = useState<Case[]>([]);
  const [isLoadingCases, setIsLoadingCases] = useState(true);
  const [caseId, setCaseId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      setIsLoadingCases(true);
      const data = await casesApi.getAll();
      setCases(data);
    } catch (error) {
      console.error("Error loading cases:", error);
      toast.error("فشل تحميل الحالات");
    } finally {
      setIsLoadingCases(false);
    }
  };

  const handleCaseSelect = (selectedCaseId: string) => {
    setCaseId(selectedCaseId);

    if (selectedCaseId) {
      const selectedCase = cases.find((c) => c.id === selectedCaseId);
      if (selectedCase) {
        setPatientName(selectedCase.fullName);
        setPhone(selectedCase.phone);
        setEmail(selectedCase.email || "");
      }
    } else {
      // Clear fields if "manual entry" is selected
      setPatientName("");
      setPhone("");
      setEmail("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !patientName.trim() ||
      !phone.trim() ||
      !appointmentType.trim() ||
      !appointmentDate ||
      !appointmentTime
    ) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      setIsSaving(true);

      const appointmentData: any = {
        patientName: patientName.trim(),
        phone: phone.trim(),
        appointmentType: appointmentType.trim(),
        appointmentDate,
        appointmentTime,
      };

      // Add caseId if a case was selected
      if (caseId) {
        appointmentData.caseId = caseId;
      }

      // Only add optional fields if they have values
      if (email.trim()) {
        appointmentData.email = email.trim();
      }

      if (notes.trim()) {
        appointmentData.notes = notes.trim();
      }

      console.log("Sending appointment data:", appointmentData);

      const newAppointment = await appointmentsApi.create(appointmentData);
      toast.success("تم تسجيل الموعد بنجاح");
      router.push(`/dashboard/appointments/${newAppointment.id}`);
    } catch (error: any) {
      console.error("Error creating appointment:", error);
      console.error("Error response:", error.response?.data);
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "فشل تسجيل الموعد"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/dashboard/appointments")}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">موعد جديد</h1>
          <p className="text-gray-600 mt-1">إضافة موعد مريض جديد</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Select Case (Optional) */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                ربط الموعد بحالة موجودة 
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اختر حالة من القائمة
              </label>
              {isLoadingCases ? (
                <div className="text-sm text-gray-500">جاري تحميل الحالات...</div>
              ) : (
                <select
                  value={caseId}
                  onChange={(e) => handleCaseSelect(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">  (ربط بحالة)</option>
                  {cases.map((caseItem) => (
                    <option key={caseItem.id} value={caseItem.id}>
                      {caseItem.fullName} - {caseItem.phone}
                    </option>
                  ))}
                </select>
              )}
              <p className="text-xs text-gray-500 mt-2">
                اختر حالة لملء معلومات المريض تلقائياً، أو اترك الحقل فارغاً للإدخال اليدوي
              </p>
            </div>
          </div>

          {/* Patient Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              معلومات المريض
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم المريض *
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                    disabled={!!caseId}
                  />
                  {caseId && (
                    <p className="text-xs text-gray-500 mt-1">
                      مرتبط بحالة موجودة
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                    disabled={!!caseId}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={!!caseId}
                />
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              تفاصيل الموعد
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع الموعد *
                </label>
                <input
                  type="text"
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value)}
                  placeholder="مثلاً: فحص أولي، متابعة، تركيب طرف صناعي"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    التاريخ *
                  </label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوقت *
                  </label>
                  <input
                    type="time"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ملاحظات
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="أي ملاحظات إضافية عن الموعد..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/appointments")}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isSaving} variant="primary">
              <Save className="w-4 h-4 ml-2" />
              {isSaving ? "جاري الحفظ..." : "تسجيل الموعد"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
