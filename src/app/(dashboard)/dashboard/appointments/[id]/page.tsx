// src/app/(dashboard)/dashboard/appointments/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { appointmentsApi } from "@/lib/api/appointments";
import type { Appointment } from "@/types/appointment";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  Calendar,
  Clock,
  Phone,
  Mail,
  User,
  FileText,
  Save,
  Edit2,
  X,
} from "lucide-react";

interface PageProps {
  params: {
    id: string;
  };
}

export default function AppointmentDetailsPage({ params }: PageProps) {
  const router = useRouter();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Editable fields
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [status, setStatus] = useState<Appointment["status"]>("PENDING");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadAppointment();
  }, [params.id]);

  const loadAppointment = async () => {
    try {
      setIsLoading(true);
      const data = await appointmentsApi.getOne(params.id);
      setAppointment(data);

      // Set editable fields
      setPatientName(data.patientName);
      setPhone(data.phone);
      setEmail(data.email || "");
      setAppointmentType(data.appointmentType);
      setAppointmentDate(data.appointmentDate);
      setAppointmentTime(data.appointmentTime);
      setStatus(data.status);
      setNotes(data.notes || "");
    } catch (error: any) {
      console.error("Error loading appointment:", error);
      toast.error("فشل تحميل بيانات الموعد");
      router.push("/dashboard/appointments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
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

      const updateData: any = {
        patientName: patientName.trim(),
        phone: phone.trim(),
        appointmentType: appointmentType.trim(),
        appointmentDate,
        appointmentTime,
        status,
      };

      if (email.trim()) {
        updateData.email = email.trim();
      }

      if (notes.trim()) {
        updateData.notes = notes.trim();
      }

      await appointmentsApi.update(params.id, updateData);
      toast.success("تم تحديث الموعد بنجاح");
      setIsEditing(false);
      loadAppointment();
    } catch (error: any) {
      console.error("Error updating appointment:", error);
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "فشل تحديث الموعد"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: Appointment["status"]) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-800",
      CONFIRMED: "bg-blue-100 text-blue-800",
      COMPLETED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
    };

    const labels = {
      PENDING: "قيد الانتظار",
      CONFIRMED: "مؤكد",
      COMPLETED: "مكتمل",
      CANCELLED: "ملغي",
    };

    return (
      <span
        className={`px-3 py-1 text-sm font-medium rounded-full ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeStr: string) => {
    return timeStr.substring(0, 5); // HH:MM
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard/appointments")}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">تفاصيل الموعد</h1>
            <p className="text-gray-600 mt-1">
              موعد {appointment.patientName}
            </p>
          </div>
        </div>
        {!isEditing && (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit2 className="w-4 h-4 ml-2" />
            تعديل
          </Button>
        )}
      </div>

      {/* Appointment Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Patient Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 ml-2" />
              معلومات المريض
            </h2>

            {isEditing ? (
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
                    />
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
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <User className="w-5 h-5 text-gray-400 ml-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">اسم المريض</p>
                    <p className="text-base font-medium text-gray-900">
                      {appointment.patientName}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-gray-400 ml-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">رقم الهاتف</p>
                    <p className="text-base font-medium text-gray-900">
                      {appointment.phone}
                    </p>
                  </div>
                </div>

                {appointment.email && (
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-gray-400 ml-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">البريد الإلكتروني</p>
                      <p className="text-base font-medium text-gray-900">
                        {appointment.email}
                      </p>
                    </div>
                  </div>
                )}

                {appointment.case && (
                  <div className="flex items-start">
                    <FileText className="w-5 h-5 text-gray-400 ml-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">مرتبط بحالة</p>
                      <p className="text-base font-medium text-gray-900">
                        {appointment.case.fullName}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Appointment Details */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 ml-2" />
              تفاصيل الموعد
            </h2>

            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نوع الموعد *
                    </label>
                    <input
                      type="text"
                      value={appointmentType}
                      onChange={(e) => setAppointmentType(e.target.value)}
                      placeholder="مثلاً: فحص أولي، متابعة، تركيب طرف"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الحالة *
                    </label>
                    <select
                      value={status}
                      onChange={(e) =>
                        setStatus(e.target.value as Appointment["status"])
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="PENDING">قيد الانتظار</option>
                      <option value="CONFIRMED">مؤكد</option>
                      <option value="COMPLETED">مكتمل</option>
                      <option value="CANCELLED">ملغي</option>
                    </select>
                  </div>
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
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <FileText className="w-5 h-5 text-gray-400 ml-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">نوع الموعد</p>
                      <p className="text-base font-medium text-gray-900">
                        {appointment.appointmentType}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="ml-2 mt-0.5">
                      {getStatusBadge(appointment.status)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-gray-400 ml-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">التاريخ</p>
                      <p className="text-base font-medium text-gray-900">
                        {formatDate(appointment.appointmentDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-gray-400 ml-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">الوقت</p>
                      <p className="text-base font-medium text-gray-900">
                        {formatTime(appointment.appointmentTime)}
                      </p>
                    </div>
                  </div>
                </div>

                {appointment.notes && (
                  <div className="flex items-start">
                    <FileText className="w-5 h-5 text-gray-400 ml-2 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">ملاحظات</p>
                      <p className="text-base text-gray-900 whitespace-pre-wrap">
                        {appointment.notes}
                      </p>
                    </div>
                  </div>
                )}

                {appointment.assignedTo && (
                  <div className="flex items-start">
                    <User className="w-5 h-5 text-gray-400 ml-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">المسؤول</p>
                      <p className="text-base font-medium text-gray-900">
                        {appointment.assignedTo.full_name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Edit Actions */}
          {isEditing && (
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  loadAppointment();
                }}
                disabled={isSaving}
              >
                <X className="w-4 h-4 ml-2" />
                إلغاء
              </Button>
              <Button
                variant="primary"
                onClick={handleUpdate}
                disabled={isSaving}
              >
                <Save className="w-4 h-4 ml-2" />
                {isSaving ? "جاري الحفظ..." : "حفظ التعديلات"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">تاريخ الإنشاء:</span>{" "}
            <span className="text-gray-900">
              {new Date(appointment.createdAt).toLocaleString("ar-EG")}
            </span>
          </div>
          <div>
            <span className="text-gray-600">آخر تحديث:</span>{" "}
            <span className="text-gray-900">
              {new Date(appointment.updatedAt).toLocaleString("ar-EG")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
