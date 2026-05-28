import type { Metadata } from "next";
import { Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";

const notoSans = Noto_Sans_TC({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoSerif = Noto_Serif_TC({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "榕耀管顧 RongRise Consulting — 從人才策略到 AI 落地，驅動永續成長",
  description:
    "協助企業從人才策略到 AI 落地，驅動永續成長。智慧轉型，創新未來。C.J. Kuo 老師專業諮詢品牌，聚焦 AI 轉型、人才策略、ESG 永續發展。",
  keywords: [
    "AI 轉型", "人才策略", "ESG", "企業顧問", "智慧轉型",
    "榕耀管顧", "RongRise", "C.J. Kuo",
  ],
  openGraph: {
    title: "榕耀管顧 RongRise Consulting",
    description: "從人才策略到 AI 落地，驅動永續成長。智慧轉型，創新未來。",
    type: "website",
    locale: "zh_TW",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "榕耀管顧 RongRise Consulting",
  alternateName: "RongRise Consulting",
  description: "從人才策略到 AI 落地，驅動永續成長。智慧轉型，創新未來。",
  url: "https://rong-rise.com",
  logo: "https://rong-rise.com/images/cj-photo.jpg",
  image: "https://rong-rise.com/images/cj-photo.jpg",
  founder: {
    "@type": "Person",
    name: "郭鎮榕 C.J. Kuo",
    jobTitle: "創辦人 / 企業轉型顧問",
    url: "https://rong-rise.com/about",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "info@rongrise.com",
    areaServed: "TW",
    availableLanguage: ["Chinese"],
  },
  serviceType: ["AI 轉型策略", "人才發展策略", "ESG 永續諮詢"],
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-TW"
      className={`${notoSans.variable} ${notoSerif.variable} h-full antialiased`}
    >
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col" style={{ fontFamily: 'var(--font-noto-sans)' }}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
