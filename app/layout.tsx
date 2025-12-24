import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Navigation } from "@/app/components/Navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "图书管理系统",
  description: "图书借阅管理系统 - 管理图书、读者和借阅记录",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <Navigation />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
