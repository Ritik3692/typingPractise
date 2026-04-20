import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/contexts/SettingsContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "raktype | Premium Typing Practice",
  description: "A professional, high-performance typing practice application.",
};

import { Providers } from "@/components/Providers";
import Header from "@/components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      cz-shortcut-listen="true"
      >
        <Providers>
          <div className="relative min-h-screen max-w-7xl mx-auto flex flex-col">
            {/* Floating Header */}
            <div className="absolute top-0 left-0 w-full z-50">
              <Header  />
            </div>
            
            <main className="flex-1 flex flex-col items-center justify-center overflow-hidden p-4">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
