// src/app/(public)/about/page.tsx

"use client";

import Image from "next/image";
import {
  Target,
  Eye,
  Heart,
  Award,
  Users,
  Lightbulb,
  Shield,
  Handshake,
} from "lucide-react";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "الشراكة الاستراتيجية",
      description:
        " نعمل مع شركائنا كفريق واحد في تأسيس وتشغيل وتطوير المراكز الطبية، لضمان نجاح المشروع على المدى الطويل.     ",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: Award,
      title: "الجودة والاعتمادية",
      description:
        "نلتزم بتوفير تجهيزات وخدمات مطابقة للمعايير العالمية، تضمن أداءً موثوقًا واستقرارًا تشغيليًا.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Lightbulb,
      title: "الحلول المتكاملة",
      description:
        "  نقدّم منظومة شاملة تشمل التجهيز، التدريب، والاستشارات، لتأسيس مراكز جاهزة للعمل بكفاءة منذ اليوم الأول.",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Shield,
      title: "نقل المعرفة وبناء القدرات",
      description:
        " نركّز على تدريب وتأهيل الكوادر الفنية والإدارية لرفع مستوى الأداء وضمان استقلالية المراكز.  ",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Shield,
      title: "الالتزام والمسؤولية المهنية ",
      description:
        "نلتزم بالشفافية، الدقة، والمسؤولية في كل مراحل العمل، بما يعزز الثقة ويضمن نتائج قابلة للقياس.  ",
      color: "from-red-500 to-pink-500",
    },
  ];

  return (
    <>
      <Header />
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
            {/* <p className="text-xl md:text-2xl leading-relaxed opacity-95">
              مركز متخصص في تصميم وتركيب الأطراف الصناعية وإعادة التأهيل
            </p> */}
          </div>
        </section>

        {/* About Content */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-stretch">
              <div className="relative min-h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/center.jpg"
                  alt="فريق المركز"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="space-y-6 flex flex-col justify-center">
                <div className="inline-block">
                  <div className="inline-flex items-center px-4 py-2 bg-accent-100 text-accent-600 rounded-full text-sm font-semibold">
                    شركة Vitaxir
                  </div>
                </div>

                <p className="text-lg text-gray-700 leading-relaxed">
                  شركة{" "}
                  <span className="font-bold text-primary-500">Vitaxir</span> هي
                  شركة متخصصة في تجهيز وتطوير مراكز الأطراف الصناعية وإعادة
                  التأهيل والعلاج الفيزيائي، تأسست في تركيا منذ أكثر من 11
                  عاماً. منذ تأسيسها، نعمل وفق رؤية شاملة تهدف إلى بناء منظومة
                  تأهيل متكاملة تعتمد على الجودة، المعرفة، والشراكة المستدامة مع
                  المرافق الطبية التي تسعى إلى تقديم خدمات الأطراف الصناعية
                  والعلاج الفيزيائي، حيث أسست الشركة مراكز في أكثر من 4 دول.
                </p>

                <p className="text-lg text-gray-700 leading-relaxed">
                  تسعى{" "}
                  <span className="font-bold text-primary-500">Vitaxir</span>{" "}
                  إلى تزويد المراكز الطبية بالحلول المتكاملة التي تضمن تحقيق
                  أعلى معايير الجودة العالمية في تقديم خدمات الأطراف الصناعية
                  والعلاج الفيزيائي. ومع التطور المستمر في هذا المجال، نركز بشكل
                  أساسي على توفير تجهيزات طبية متطورة، إلى جانب تدريب وتأهيل
                  الكوادر الفنية والإدارية، وتقديم استشارات متخصصة تسهم في رفع
                  كفاءة المراكز الطبية وتحسين جودة الخدمات المقدّمة للمرضى.
                </p>

                <p className="text-lg text-gray-700 leading-relaxed">
                  وبعد النجاحات التي حققتها الشركة في تركيا، وسّعت{" "}
                  <span className="font-bold text-primary-500">Vitaxir</span>{" "}
                  نطاق خدماتها لتشمل السوق السوري، حيث افتتحت أولى فروعها في
                  مدينة <span className="font-semibold">حلب عام 2025</span>.
                  وتعمل الشركة على دعم المراكز الطبية والمستشفيات، سواء كانت
                  حديثة التأسيس أو قائمة، من خلال المساهمة في بناء بنية تحتية
                  طبية متكاملة تتماشى مع أفضل المعايير العالمية، مع ضمان توفير
                  الدعم الفني والمتابعة المستمرة.
                </p>

                <p className="text-lg text-gray-700 leading-relaxed">
                  نرافق الجهات الطبية والإنسانية والاستثمارية في جميع مراحل
                  المشروع، بدءًا من مرحلة الفكرة والتخطيط، وصولًا إلى التجهيز
                  والتشغيل الكامل، مرورًا بالتدريب والتوريد والدعم الفني
                  المستدام، بما يضمن استمرارية الأثر الطبي والإنساني وتحقيق أفضل
                  مستويات الأداء والجودة.
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
                  <h3 className="text-3xl font-bold text-gray-900">مهمتنا</h3>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  تمكين الشركات والمستثمرين والمنظمات من إنشاء وتشغيل مراكز طبية
                  متخصصة بكفاءة عالية، عبر تقديم حلول شاملة تشمل التجهيز الطبي،
                  التدريب، التأهيل، والاستشارات التشغيلية، بما يضمن جودة
                  الخدمات، استدامة المشاريع، وتحقيق أثر صحي واقتصادي ملموس.
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
                  أن نكون الشريك الاستراتيجي الرائد إقليمياً في تأسيس وتطوير
                  مراكز الأطراف الصناعية والعلاج الفيزيائي، من خلال حلول متكاملة
                  تواكب التطور الطبي العالمي وتدعم الاستثمار المستدام في القطاع
                  الصحي.
                </p>
                {/* <p className="text-primary-500 font-semibold text-lg">
                  أن نكون الوجهة الأولى للأطراف الصناعية في المنطقة.
                </p> */}
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

            {/* أول 4 قيم */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              {values.slice(0, 4).map((value, index) => {
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

            {/* القيمة الخامسة في النص */}
            <div className="flex justify-center">
              <div
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 duration-300"
                style={{ maxWidth: "280px" }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <Handshake className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
                  الالتزام والمسؤولية المهنية
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  نلتزم بالشفافية، الدقة، والمسؤولية في كل مراحل العمل، بما يعزز
                  الثقة ويضمن نتائج قابلة للقياس.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Image Gallery */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                شركاتنا
              </h2>
              <p className="text-xl text-gray-600">
                تدير Vitaxir شبكة شركات طبية متخصصة في العلاج الفيزيائي والأطراف
                الصناعية، تعمل وفق منظومة تشغيل موحّدة ومعايير جودة عالية، بما
                يضمن تقديم خدمات طبية متقدمة وكفاءة تشغيلية مستدامة.{" "}
                <span className="block">
                  تتوزّع شركاتنا في: سوريا – تركيا – الكويت – دبي ما يمنحنا خبرة
                  عملية متعددة الأسواق، وقدرة على تكييف النماذج التشغيلية بما
                  يتوافق مع المتطلبات التنظيمية والطبية لكل دولة.
                </span>
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Image 1 */}
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl group">
                <Image
                  src="/images/Elixir-logo.jpg"
                  alt="Elixir  "
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent flex items-end p-6">
                  {/* <p className="text-white font-semibold text-lg">
                    التعامل المباشر مع المرضى
                  </p> */}
                </div>
              </div>

              {/* Image 2 */}
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl group">
                <Image
                  src="/images/emraf-Logo.jpg"
                  alt="emraf"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex items-end p-6">
                  {/* <p className="text-white font-semibold text-lg">
                    جلسات العلاج والتأهيل
                  </p> */}
                </div>
              </div>

              {/* Image 3 */}
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl group">
                <Image
                  src="/images/elixir.jpg"
                  alt="Ixir alhayat "
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex items-end p-6">
                  {/* <p className="text-white font-semibold text-lg">
                    رحلة التعافي والأمل
                  </p> */}
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
                التأهيل المتقدم، تصحيح اختلالات الحركة، والمتخصصين في تحليل
                تموضع القدم ودعم الأداء الرياضي.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
