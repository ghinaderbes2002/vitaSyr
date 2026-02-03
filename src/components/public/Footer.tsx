// src/components/public/Footer.tsx

import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Clock,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-500 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="mb-4">
              <div className="relative w-40 h-12 mb-4">
                <Image
                  src="/images/logo.png"
                  alt="Vitaxir Logo"
                  fill
                  className="object-contain brightness-0 invert"
                />
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6 opacity-90">
              مركز Vitaxir متخصص في تصميم وتركيب الأطراف الصناعية وتقديم برامج
              تأهيل متكاملة لمبتوري الأطراف.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/share/17fC3cf3NJ/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white/10 rounded-lg hover:bg-accent-500 transition-all hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/vitaxir_company?igsh=MWdxY3p2dGh4a3l6dA=="
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white/10 rounded-lg hover:bg-accent-500 transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 relative inline-block">
              روابط سريعة
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-accent-500"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="hover:text-accent-500 transition-colors hover:translate-x-1 inline-block"
                >
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-accent-500 transition-colors hover:translate-x-1 inline-block"
                >
                  من نحن
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-accent-500 transition-colors hover:translate-x-1 inline-block"
                >
                  خدماتنا
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-accent-500 transition-colors hover:translate-x-1 inline-block"
                >
                  منتجاتنا
                </Link>
              </li>
              <li>
                <Link
                  href="/success-stories"
                  className="hover:text-accent-500 transition-colors hover:translate-x-1 inline-block"
                >
                  قصص النجاح
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-accent-500 transition-colors hover:translate-x-1 inline-block"
                >
                  المدونة
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-6 relative inline-block">
              خدماتنا
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-accent-500"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/services"
                  className="hover:text-accent-500 transition-colors hover:translate-x-1 inline-block"
                >
                  الأطراف الصناعية
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-accent-500 transition-colors hover:translate-x-1 inline-block"
                >
                  العلاج الفيزيائي
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-accent-500 transition-colors hover:translate-x-1 inline-block"
                >
                  إعادة التأهيل
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-accent-500 transition-colors hover:translate-x-1 inline-block"
                >
                  Foot Balance
                </Link>
              </li>
              <li>
                <Link
                  href="/partnerships"
                  className="hover:text-accent-500 transition-colors hover:translate-x-1 inline-block"
                >
                  شراكات استثمارية
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 relative inline-block">
              تواصل معنا
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-accent-500"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent-500 flex-shrink-0 mt-1" />
                <span className="text-sm opacity-90">
                  سوريا - حلب - حلب الجديدة شمالي - خلف فيلا العقاد - شارع
                  ايكاردا{" "}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent-500 flex-shrink-0" />
                <a
                  href="tel:+963987106020"
                  className="text-sm hover:text-accent-500 transition-colors"
                  dir="ltr"
                >
                 +963 987 106 020
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent-500 flex-shrink-0" />
                <a
                  href="mailto:info@vitaxir.com"
                  className="text-sm hover:text-accent-500 transition-colors"
                >
                  info@vitaxir.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-accent-500 flex-shrink-0 mt-1" />
                <div className="text-sm opacity-90">
                  <p>السبت - الخميس</p>
                  <p>10:00 ص - 6:00 م</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm opacity-90">
              جميع الحقوق محفوظة &copy; {currentYear} مركز{" "}
              <span className="font-bold text-accent-500">Vitaxir</span>
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                href="/privacy"
                className="hover:text-accent-500 transition-colors"
              >
                سياسة الخصوصية
              </Link>
              <Link
                href="/terms"
                className="hover:text-accent-500 transition-colors"
              >
                الشروط والأحكام
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
