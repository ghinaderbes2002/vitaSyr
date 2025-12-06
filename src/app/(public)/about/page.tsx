// src/app/(public)/about/page.tsx

"use client";

import Image from "next/image";
import { Target, Eye, Heart, Award, Users, Lightbulb, Shield } from "lucide-react";
import Footer from "@/components/public/Footer";

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "الإنسان أولًا",
      description: "كل ما نقدّمه يبدأ من احتياجات المريض",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: Award,
      title: "الجودة",
      description: "نعمل بأعلى المعايير الطبية والمهنية",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Lightbulb,
      title: "الابتكار",
      description: "نطوّر طرق التصنيع والتأهيل باستمرار",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Shield,
      title: "الموثوقية",
      description: "نرافق المريض في رحلته من التشخيص إلى التأهيل الكامل",
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/about.png"
            // src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=2091&auto=format&fit=crop"
            alt="مركز Vitaxir"
            fill
            className="object-cover brightness-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/90 to-primary-600/80" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            من نحن
          </h1>
          <p className="text-xl md:text-2xl leading-relaxed opacity-95">
            مركز متخصص في تصميم وتركيب الأطراف الصناعية وإعادة التأهيل
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop"
                alt="فريق المركز"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-accent-100 text-accent-600 rounded-full text-sm font-semibold">
                مركز Vitaxir
              </div>
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                رواد في تصميم الأطراف الصناعية
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                مركز <span className="font-bold text-primary-500">Vitaxir</span>{" "}
                متخصص في تصميم وتركيب الأطراف الصناعية، وتقديم برامج تأهيل
                متكاملة لمبتوري الأطراف. يجتمع في مركزنا فريق من الأخصائيين
                المرخّصين في العلاج الفيزيائي، وإعادة التأهيل المتقدم، وتصحيح
                اختلالات الحركة، إضافة إلى فريق متخصص في{" "}
                <span className="font-semibold text-primary-500">
                  Foot Balance
                </span>{" "}
                لتحليل تموضع القدم وتصحيح المشية ودعم الأداء الرياضي.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">رسالتنا</h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                نؤمن بأن كل شخص يستحق رعاية مصممة له شخصيًا، لذلك نعتمد منهجًا
                دقيقًا يبدأ بتقييم شامل، وتقنيات علاجية قائمة على الأدلة
                العلمية، وخطط علاج فردية تُبنى على احتياجاتك، نمط حياتك، وأهدافك
                الصحية.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">رؤيتنا</h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                دعم المرضى في استعادة قدراتهم الحركية وتحسين جودة حياتهم من خلال
                حلول متطورة طبية ومبتكرة تُعيد للمريض ثقته بنفسه وقدرته على
                ممارسة حياته اليومية بسهولة.
              </p>
              <p className="text-primary-500 font-semibold text-lg">
                أن نكون الوجهة الأولى للأطراف الصناعية في المنطقة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              قيمنا
            </h2>
            <p className="text-xl text-gray-600">
              المبادئ التي نؤمن بها ونعمل من خلالها
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 duration-300"
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center mb-6 mx-auto`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              مركزنا
            </h2>
            <p className="text-xl text-gray-600">
              لمحة عن بيئة العمل والعلاج في Vitaxir
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Image 1 */}
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl group">
              <Image
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop"
                alt="التعامل مع المرضى"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <p className="text-white font-semibold text-lg">
                  التعامل المباشر مع المرضى
                </p>
              </div>
            </div>

            {/* Image 2 */}
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl group">
              <Image
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop"
                alt="العلاج الفيزيائي"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <p className="text-white font-semibold text-lg">
                  جلسات العلاج والتأهيل
                </p>
              </div>
            </div>

            {/* Image 3 */}
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl group">
              <Image
                src="https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=2031&auto=format&fit=crop"
                alt="أمل التعافي"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <p className="text-white font-semibold text-lg">
                  رحلة التعافي والأمل
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl p-12 text-white text-center shadow-2xl">
            <Users className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl font-bold mb-6">فريق متخصص ومرخّص</h2>
            <p className="text-xl leading-relaxed max-w-3xl mx-auto opacity-95">
              نفخر بفريقنا من الأخصائيين المرخّصين في العلاج الفيزيائي، إعادة
              التأهيل المتقدم، تصحيح اختلالات الحركة، والمتخصصين في تحليل تموضع
              القدم ودعم الأداء الرياضي.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
