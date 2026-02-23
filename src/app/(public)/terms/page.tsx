// src/app/(public)/terms/page.tsx

import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <FileText className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-4">الشروط والأحكام</h1>
            <p className="text-xl opacity-90">
              يرجى قراءة هذه الشروط بعناية قبل استخدام خدماتنا
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-8">
              {/* Introduction */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">مقدمة</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  مرحباً بك في شركة Vitaxir. باستخدامك لموقعنا الإلكتروني
                  وخدماتنا، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا
                  كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام خدماتنا.
                </p>
              </div>

              {/* Services */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  الخدمات المقدمة
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>تقدم شركة Vitaxir الخدمات التالية:</p>
                  <ul className="list-disc list-inside space-y-2 mr-6">
                    <li>توريد وتركيب الأطراف الصناعية</li>
                    <li>خدمات العلاج الفيزيائي</li>
                    <li>تحليل وتقويم صحة القدم</li>
                    <li>تجهيز وتأسيس المراكز الطبية</li>
                    <li>الاستشارات الطبية المتخصصة</li>
                  </ul>
                  <p className="mt-4">
                    نحتفظ بالحق في تعديل أو إيقاف أي من خدماتنا في أي وقت دون
                    إشعار مسبق.
                  </p>
                </div>
              </div>

              {/* User Responsibilities */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  مسؤوليات المستخدم
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>عند استخدام خدماتنا، فإنك توافق على:</p>
                  <ul className="list-disc list-inside space-y-2 mr-6">
                    <li>تقديم معلومات دقيقة وكاملة</li>
                    <li>الحفاظ على سرية بيانات حسابك</li>
                    <li>استخدام الخدمات بطريقة قانونية ومشروعة</li>
                    <li>عدم إساءة استخدام الموقع أو محاولة اختراقه</li>
                    <li>احترام حقوق الملكية الفكرية</li>
                  </ul>
                </div>
              </div>

              {/* Appointments */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  المواعيد والحجوزات
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <ul className="list-disc list-inside space-y-2 mr-6">
                    <li>يجب تأكيد المواعيد قبل 24 ساعة على الأقل</li>
                    <li>في حالة الإلغاء، يرجى إخطارنا قبل 24 ساعة على الأقل</li>
                    <li>
                      قد يتم فرض رسوم على حالات الإلغاء المتأخر أو عدم الحضور
                    </li>
                    <li>
                      نحتفظ بالحق في إعادة جدولة المواعيد في حالات الطوارئ
                    </li>
                  </ul>
                </div>
              </div>

              {/* Payment Terms */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  شروط الدفع
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <ul className="list-disc list-inside space-y-2 mr-6">
                    <li>الأسعار المعروضة قابلة للتغيير دون إشعار مسبق</li>
                    <li>
                      الدفع مستحق عند تقديم الخدمة ما لم يُتفق على خلاف ذلك
                    </li>
                    <li>نقبل الدفع النقدي والتحويل البنكي</li>
                    <li>
                      جميع الأسعار المذكورة لا تشمل الضرائب ما لم يُذكر خلاف ذلك
                    </li>
                  </ul>
                </div>
              </div>

              {/* Medical Disclaimer */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  إخلاء المسؤولية الطبية
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    المعلومات المقدمة على هذا الموقع هي لأغراض تعليمية وإعلامية
                    فقط. لا ينبغي اعتبارها بديلاً عن المشورة الطبية المهنية أو
                    التشخيص أو العلاج.
                  </p>
                  <p>
                    استشر دائماً طبيبك أو مقدم الرعاية الصحية المؤهل بشأن أي
                    أسئلة قد تكون لديك بخصوص حالة طبية.
                  </p>
                </div>
              </div>

              {/* Limitation of Liability */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  حدود المسؤولية
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>لن نكون مسؤولين عن:</p>
                  <ul className="list-disc list-inside space-y-2 mr-6">
                    <li>أي أضرار غير مباشرة أو عرضية أو تبعية</li>
                    <li>فقدان البيانات أو الأرباح الناتج عن استخدام خدماتنا</li>
                    <li>انقطاع الخدمة بسبب صيانة أو مشاكل تقنية</li>
                    <li>أخطاء أو سهو في المحتوى المقدم</li>
                  </ul>
                </div>
              </div>

              {/* Intellectual Property */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  حقوق الملكية الفكرية
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  جميع المحتويات والمواد الموجودة على هذا الموقع، بما في ذلك
                  النصوص والصور والشعارات والرسومات، هي ملك لشركة Vitaxir ومحمية
                  بموجب قوانين حقوق النشر والملكية الفكرية. لا يجوز استخدام أو
                  نسخ أو توزيع أي محتوى دون إذن كتابي مسبق.
                </p>
              </div>

              {/* Privacy */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  الخصوصية
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  استخدامك لخدماتنا يخضع أيضاً لسياسة الخصوصية الخاصة بنا. يرجى
                  مراجعة
                  <a
                    href="/privacy"
                    className="text-accent-500 hover:text-accent-600 font-semibold mx-1"
                  >
                    سياسة الخصوصية
                  </a>
                  لمعرفة المزيد حول كيفية جمعنا واستخدامنا لمعلوماتك الشخصية.
                </p>
              </div>

              {/* Changes to Terms */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  التعديلات على الشروط
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  نحتفظ بالحق في تعديل هذه الشروط والأحكام في أي وقت. سيتم نشر
                  أي تغييرات على هذه الصفحة، وسيشير تاريخ "آخر تحديث" أدناه إلى
                  وقت إجراء آخر تعديل. استمرارك في استخدام خدماتنا بعد نشر
                  التغييرات يعني موافقتك على الشروط المعدلة.
                </p>
              </div>

              {/* Governing Law */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  القانون الحاكم
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  تخضع هذه الشروط والأحكام وتفسر وفقاً لقوانين الجمهورية العربية
                  السورية. أي نزاع ناشئ عن هذه الشروط سيخضع للاختصاص القضائي
                  الحصري للمحاكم السورية.
                </p>
              </div>

              {/* Contact */}
              <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  اتصل بنا
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  إذا كان لديك أي أسئلة أو استفسارات بخصوص هذه الشروط والأحكام،
                  يرجى الاتصال بنا:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>البريد الإلكتروني:</strong> info@vitaxirpro.com
                  </p>
                  <p>
                    <strong>الهاتف:</strong> +963 987 106 020
                  </p>
                </div>
              </div>

              {/* Last Update */}
              <div className="text-center pt-8 border-t border-gray-200">
                <p className="text-gray-600">
                  آخر تحديث:{" "}
                  {new Date().toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
