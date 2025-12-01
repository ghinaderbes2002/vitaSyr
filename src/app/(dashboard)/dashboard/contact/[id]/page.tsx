// src/app/(dashboard)/dashboard/contact/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowRight,
  Mail,
  Phone,
  User,
  MessageSquare,
  Calendar,
  FileText,
  Send,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { contactApi } from "@/lib/api/contact";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import type { ContactMessage } from "@/types/contactMessage";

export default function ContactMessageDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const user = useAuthStore((state) => state.user);

  const [message, setMessage] = useState<ContactMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Form fields
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    if (id) {
      loadMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadMessage = async () => {
    try {
      setIsLoading(true);
      const data = await contactApi.getAll();
      const foundMessage = data.find((m) => m.id === id);
      if (!foundMessage) {
        toast.error("الرسالة غير موجودة");
        router.push("/dashboard/contact");
        return;
      }
      setMessage(foundMessage);
    } catch (error: any) {
      toast.error("فشل تحميل بيانات الرسالة");
      router.push("/dashboard/contact");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) {
      toast.error("الرجاء كتابة الرد");
      return;
    }

    if (!user?.id) {
      toast.error("يجب تسجيل الدخول");
      return;
    }

    try {
      setIsSending(true);
      await contactApi.reply(id, {
        replyMessage: replyMessage,
        repliedById: user.id,
      });
      toast.success("تم إرسال الرد بنجاح");
      loadMessage();
      setReplyMessage("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "فشل إرسال الرد");
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = async () => {
    if (!confirm("هل أنت متأكد من إغلاق هذه الرسالة؟")) return;

    try {
      setIsClosing(true);
      await contactApi.close(id);
      toast.success("تم إغلاق الرسالة بنجاح");
      loadMessage();
    } catch (error) {
      toast.error("فشل إغلاق الرسالة");
    } finally {
      setIsClosing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">لم يتم العثور على الرسالة</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/contact")}
          >
            <ArrowRight className="w-5 h-5 ml-2" />
            رجوع
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              رسالة من: {message.fullName}
            </h1>
            <p className="text-gray-600 mt-1">{message.subject}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {message.status !== "CLOSED" && (
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isClosing}
            >
              <XCircle className="w-5 h-5 ml-2" />
              إغلاق الرسالة
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sender Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              معلومات المرسل
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  الاسم الكامل
                </label>
                <p className="text-gray-900 mt-1">{message.fullName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  البريد الإلكتروني
                </label>
                <p className="text-gray-900 mt-1" dir="ltr">
                  {message.email}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  رقم الهاتف
                </label>
                <p className="text-gray-900 mt-1" dir="ltr">
                  {message.phone}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  تاريخ الإرسال
                </label>
                <p className="text-gray-900 mt-1">
                  {new Date(message.createdAt).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              نص الرسالة
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">
                {message.message}
              </p>
            </div>
          </div>

          {/* Admin Reply */}
          {message.replyMessage && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                الرد الإداري
              </h2>
              <div className="bg-green-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {message.replyMessage}
                </p>
              </div>
              {message.repliedBy && message.repliedAt && (
                <div className="text-sm text-gray-500">
                  <p>
                    تم الرد بواسطة: <span className="font-medium">{message.repliedBy.name}</span>
                  </p>
                  <p>
                    في:{" "}
                    {new Date(message.repliedAt).toLocaleDateString("ar-EG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Reply Form */}
          {message.status !== "CLOSED" && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Send className="w-5 h-5" />
                {message.status === "REPLIED" ? "إرسال رد إضافي" : "إرسال رد"}
              </h2>
              <div className="space-y-4">
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={6}
                  placeholder="اكتب ردك هنا..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
                <Button
                  variant="primary"
                  onClick={handleReply}
                  disabled={isSending || !replyMessage.trim()}
                >
                  <Send className="w-5 h-5 ml-2" />
                  إرسال الرد
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              حالة الرسالة
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحالة الحالية
                </label>
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                    message.status === "NEW"
                      ? "bg-blue-100 text-blue-800"
                      : message.status === "REPLIED"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.status === "NEW" && "جديد"}
                  {message.status === "REPLIED" && "تم الرد"}
                  {message.status === "CLOSED" && "مغلق"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
