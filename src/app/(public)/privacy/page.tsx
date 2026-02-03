// src/app/(public)/privacy/page.tsx

import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-4">سياسة الخصوصية</h1>
            <p className="text-xl opacity-90">
              نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية
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
                  في شركة Vitaxir، نحن نقدر خصوصيتك ونلتزم بحماية معلوماتك الشخصية.
                  توضح سياسة الخصوصية هذه كيفية جمعنا واستخدامنا وحماية البيانات التي تقدمها لنا.
                </p>
              </div>

              {/* Data Collection */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">المعلومات التي نجمعها</h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>نقوم بجمع المعلومات التالية عند استخدامك لخدماتنا:</p>
                  <ul className="list-disc list-inside space-y-2 mr-6">
                    <li>الاسم الكامل</li>
                    <li>عنوان البريد الإلكتروني</li>
                    <li>رقم الهاتف</li>
                    <li>المعلومات الطبية ذات الصلة (عند الضرورة لتقديم الخدمة)</li>
                    <li>معلومات الموقع (إذا كان ذلك ضرورياً لتقديم الخدمة)</li>
                  </ul>
                </div>
              </div>

              {/* How We Use Data */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">كيف نستخدم معلوماتك</h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>نستخدم المعلومات التي نجمعها للأغراض التالية:</p>
                  <ul className="list-disc list-inside space-y-2 mr-6">
                    <li>تقديم وتحسين خدماتنا الطبية والعلاجية</li>
                    <li>التواصل معك بشأن مواعيدك واستفساراتك</li>
                    <li>إرسال التحديثات والعروض الخاصة (بموافقتك)</li>
                    <li>تحسين تجربة المستخدم على موقعنا</li>
                    <li>الامتثال للمتطلبات القانونية والتنظيمية</li>
                  </ul>
                </div>
              </div>

              {/* Data Protection */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">حماية البيانات</h2>
                <p className="text-gray-700 leading-relaxed">
                  نتخذ جميع التدابير الأمنية المناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به
                  أو التعديل أو الإفصاح أو التدمير. نستخدم تقنيات التشفير والبروتوكولات الآمنة
                  لحماية بياناتك أثناء النقل والتخزين.
                </p>
              </div>

              {/* Data Sharing */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">مشاركة المعلومات</h2>
                <p className="text-gray-700 leading-relaxed">
                  لا نقوم ببيع أو تأجير أو مشاركة معلوماتك الشخصية مع أطراف ثالثة إلا في الحالات التالية:
                </p>
                <ul className="list-disc list-inside space-y-2 mr-6 mt-4 text-gray-700">
                  <li>بموافقتك الصريحة</li>
                  <li>عند الضرورة لتقديم الخدمة المطلوبة</li>
                  <li>للامتثال للقوانين والأنظمة المعمول بها</li>
                  <li>لحماية حقوقنا وسلامتنا أو حقوق وسلامة الآخرين</li>
                </ul>
              </div>

              {/* Your Rights */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">حقوقك</h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>لديك الحق في:</p>
                  <ul className="list-disc list-inside space-y-2 mr-6">
                    <li>الوصول إلى بياناتك الشخصية</li>
                    <li>تصحيح أو تحديث معلوماتك</li>
                    <li>طلب حذف بياناتك</li>
                    <li>الاعتراض على معالجة بياناتك</li>
                    <li>سحب موافقتك في أي وقت</li>
                  </ul>
                </div>
              </div>

              {/* Cookies */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">ملفات تعريف الارتباط (Cookies)</h2>
                <p className="text-gray-700 leading-relaxed">
                  نستخدم ملفات تعريف الارتباط لتحسين تجربتك على موقعنا. يمكنك التحكم في استخدام
                  ملفات تعريف الارتباط من خلال إعدادات متصفحك.
                </p>
              </div>

              {/* Updates */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">التحديثات على السياسة</h2>
                <p className="text-gray-700 leading-relaxed">
                  قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنقوم بإخطارك بأي تغييرات
                  جوهرية عبر البريد الإلكتروني أو من خلال إشعار على موقعنا.
                </p>
              </div>

              {/* Contact */}
              <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">اتصل بنا</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  إذا كان لديك أي أسئلة أو استفسارات بخصوص سياسة الخصوصية، يرجى الاتصال بنا:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>البريد الإلكتروني:</strong> info@vitaxir.com</p>
                  <p><strong>الهاتف:</strong> +963 987 106 020</p>
                </div>
              </div>

              {/* Last Update */}
              <div className="text-center pt-8 border-t border-gray-200">
                <p className="text-gray-600">
                  آخر تحديث: {new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
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
