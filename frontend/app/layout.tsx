import { Outfit } from 'next/font/google';
import '@/styles/globals.css';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { BootstrapProvider } from '@/context/BootstrapContext';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'A-Flick Pest Management',
  description: 'A Pest Management Company. A-Flick and It’s Gone!',
  icons: {
    icon: '/images/logo/logo-dark-icon.png',
    shortcut: '/images/logo/logo-dark-icon.png',
    apple: '/images/logo/logo-dark-icon.png',
  },
};

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <BootstrapProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </BootstrapProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
