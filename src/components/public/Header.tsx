// src/components/public/Header.tsx

"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import NavigationProgress from "@/components/ui/NavigationProgress";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/about", label: "من نحن" },
    { href: "/services", label: "خدماتنا", hasDropdown: true },
    { href: "/products", label: "منتجاتنا" },
    { href: "/partnerships", label: "شراكات" },
    { href: "/success-stories", label: "أخبارنا" },
    { href: "/sponsorship", label: "كفالة إنسان" },
    { href: "/blog", label: "المدونة" },
    { href: "/contact", label: "اتصل بنا" },
    { href: "/join-us", label: "توظف معنا" },
  ];

  const serviceTypes = [
    { href: "/services/prosthetics", label: "الأطراف الصناعية" },
    { href: "/services/physiotherapy", label: "العلاج الفيزيائي" },
    { href: "/services/foot-balance", label: "تحليل القدم وتصحيح المشي" },
  ];

  return (
    <>
      <NavigationProgress />
      <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Main Header */}
      <div className="container mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between h-24 md:h-28">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2 space-x-reverse">
            {navLinks.map((link) => (
              <div key={link.href} className="relative">
                {link.hasDropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setIsServicesOpen(true)}
                    onMouseLeave={() => setIsServicesOpen(false)}
                  >
                    <Link
                      href={link.href}
                      className={`px-5 py-3 text-base hover:text-accent-500 hover:bg-accent-50 rounded-lg transition-all font-bold flex items-center gap-1 group ${
                        pathname.startsWith('/services') ? 'text-accent-500 bg-accent-50' : 'text-primary-500'
                      }`}
                    >
                      {link.label}
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          isServicesOpen ? "rotate-180" : ""
                        }`}
                      />
                      <span className={`absolute bottom-0 left-0 h-0.5 bg-accent-500 transition-all duration-300 ${
                        pathname.startsWith('/services') ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}></span>
                    </Link>

                    {/* Dropdown Menu */}
                    {isServicesOpen && (
                      <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 py-3 z-50">
                        <Link
                          href="/services"
                          className="block px-5 py-3 text-primary-500 hover:bg-accent-50 hover:text-accent-500 transition-colors font-bold border-b border-gray-100"
                        >
                          كل الخدمات
                        </Link>
                        {serviceTypes.map((service) => (
                          <Link
                            key={service.href}
                            href={service.href}
                            className="block px-5 py-3 text-gray-700 hover:bg-accent-50 hover:text-accent-500 transition-colors font-semibold"
                          >
                            {service.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className={`px-5 py-3 text-base hover:text-accent-500 hover:bg-accent-50 rounded-lg transition-all font-bold relative group ${
                      pathname === link.href ? 'text-accent-500 bg-accent-50' : 'text-primary-500'
                    }`}
                  >
                    {link.label}
                    <span className={`absolute bottom-0 left-0 h-0.5 bg-accent-500 transition-all duration-300 ${
                      pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}></span>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Menu & Logo */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 text-primary-500 hover:text-accent-500 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="القائمة"
            >
              {isMenuOpen ? (
                <X className="w-8 h-8" />
              ) : (
                <Menu className="w-8 h-8" />
              )}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="relative w-40 md:w-48 h-16 md:h-20">
                <Image
                  src="/images/logo.png"
                  alt="Vitaxir Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <div key={link.href}>
                  {link.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => setIsServicesOpen(!isServicesOpen)}
                        className={`w-full text-right px-4 py-3 hover:text-accent-500 hover:bg-accent-50 rounded-lg transition-colors font-semibold flex items-center justify-between ${
                          pathname.startsWith('/services') ? 'text-accent-500 bg-accent-50' : 'text-primary-500'
                        }`}
                      >
                        {link.label}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            isServicesOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isServicesOpen && (
                        <div className="mr-4 mt-1 space-y-1">
                          <Link
                            href="/services"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:text-accent-500 hover:bg-accent-50 rounded-lg transition-colors"
                          >
                            كل الخدمات
                          </Link>
                          {serviceTypes.map((service) => (
                            <Link
                              key={service.href}
                              href={service.href}
                              onClick={() => setIsMenuOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:text-accent-500 hover:bg-accent-50 rounded-lg transition-colors"
                            >
                              {service.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`px-4 py-3 hover:text-accent-500 hover:bg-accent-50 rounded-lg transition-colors font-semibold ${
                        pathname === link.href ? 'text-accent-500 bg-accent-50' : 'text-primary-500'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
              <Link
                href="/appointments"
                onClick={() => setIsMenuOpen(false)}
                className="mx-4 mt-2 px-6 py-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-lg text-center font-semibold"
              >
                احجز موعد
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
    </>
  );
}
