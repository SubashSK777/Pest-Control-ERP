import { Outfit } from 'next/font/google';
import './globals.css';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'A-Flick CRM',
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
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
