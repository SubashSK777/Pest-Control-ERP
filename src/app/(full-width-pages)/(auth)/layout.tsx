import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";

import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-white dark:bg-black z-1 flex items-center justify-center p-6 md:p-10">
      <ThemeProvider>
        <div className="w-full max-w-[480px]">
          {/* Branding Section */}
          <div className="flex flex-col items-center mb-10">
            <Link href="/" className="block mb-6">
              <Image
                width={300}
                height={80}
                src="/images/logo/logo-light-full.png"
                alt="Logo"
                className="dark:hidden"
                priority
              />
              <Image
                width={300}
                height={80}
                src="/images/logo/logo-dark-full.png"
                alt="Logo"
                className="hidden dark:block"
                priority
              />
            </Link>
            <div className="text-center w-full">
              <p className="text-gray-900 dark:text-white text-2xl md:text-3xl font-semibold mb-2 whitespace-nowrap">
                A Pest Management Company.
              </p>
              <p className="text-brand-500 font-extrabold text-2xl md:text-3xl uppercase tracking-wider whitespace-nowrap">
                A-Flick and It’s Gone!
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 border border-gray-100 dark:border-gray-800">
            {children}
          </div>

          <div className="absolute top-6 right-6">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
