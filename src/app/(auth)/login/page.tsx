// src/app/(auth)/login/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Image from "next/image";

// Schema للتحقق من البيانات
const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // إذا كان مسجل دخول، نوجهه للداشبورد
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      await login(data.email, data.password);
      toast.success("تم تسجيل الدخول بنجاح");
      router.push("/dashboard");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "حدث خطأ أثناء تسجيل الدخول";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* الجانب الأيسر - النموذج */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* اللوغو والعنوان */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Image
                src="/images/logo.svg"
                alt="VitaXir Logo"
                width={180}
                height={60}
                priority
                className="h-16 w-auto"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary-900">
                لوحة التحكم
              </h1>
              <p className="text-gray-600 mt-2">مرحباً بك، يرجى تسجيل الدخول</p>
            </div>
          </div>

          {/* النموذج */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* البريد الإلكتروني */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="admin@vitaxir.com"
                  className="pr-10"
                  error={errors.email?.message}
                  {...register("email")}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* كلمة المرور */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pr-10 pl-10"
                  error={errors.password?.message}
                  {...register("password")}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* زر تسجيل الدخول */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              تسجيل الدخول
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500">
            <p>© 2025 VitaXir. جميع الحقوق محفوظة</p>
          </div>
        </div>
      </div>

      {/* الجانب الأيمن - الصورة/التصميم */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 items-center justify-center p-12">
        <div className="text-white text-center space-y-6 max-w-lg">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">مركز VitaXir الطبي</h2>
            <p className="text-xl text-blue-100">
              نصمّم أطرافًا صناعية متطورة ونقدّم برامج تأهيل شاملة
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-3xl font-bold text-accent-500">500+</div>
              <div className="text-sm text-blue-100 mt-2">حالة ناجحة</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-3xl font-bold text-accent-500">15+</div>
              <div className="text-sm text-blue-100 mt-2">سنة خبرة</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




