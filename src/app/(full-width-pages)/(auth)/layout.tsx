import GridShape from "@/components/common/GridShape";
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
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
          {children}
          <div className="lg:w-1/2 w-full h-full bg-black dark:bg-white/5 lg:grid items-center hidden">
            <div className="relative items-center justify-center  flex z-1">
              {/* <!-- ===== Common Grid Shape Start ===== --> */}
              <GridShape />
              <div className="flex flex-col items-center max-w-xl px-10">
                <Link href="/" className="block mb-8">
                  <Image
                    width={320}
                    height={100}
                    src="/images/logo/logo-light.png"
                    alt="Logo"
                    className="dark:hidden"
                  />
                  <Image
                    width={320}
                    height={100}
                    src="/images/logo/logo-light-low.webp"
                    alt="Logo"
                    className="hidden dark:block"
                  />
                </Link>
                <div className="text-center w-full">
                  <p className="text-white text-3xl md:text-4xl font-semibold mb-3 whitespace-nowrap">
                    A Pest Management Company.
                  </p>
                  <p className="text-brand-500 font-extrabold text-3xl md:text-4xl uppercase tracking-wider whitespace-nowrap">
                    A-Flick and It’s Gone!
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
