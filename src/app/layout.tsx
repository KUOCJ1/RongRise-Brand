import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuickChat from "@/components/QuickChat";
import Script from "next/script";

const SITE_URL = "https://rong-rise.com";
const SITE_NAME = "榕耀管顧 RongRise Consulting";
const SITE_DESCRIPTION =
  "協助企業從人才策略到 AI 落地，驅動永續成長。智慧轉型，創新未來。C.J. Kuo 老師專業諮詢品牌，聚焦 AI 轉型、人才策略、ESG 永續發展。";
const OG_IMAGE = `${SITE_URL}/images/og-image-ai.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — 從人才策略到 AI 落地，驅動永續成長`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "AI 轉型",
    "人才策略",
    "ESG",
    "企業顧問",
    "智慧轉型",
    "榕耀管顧",
    "RongRise",
    "C.J. Kuo",
  ],
  openGraph: {
    type: "website",
    locale: "zh_TW",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "榕耀管顧 RongRise Consulting",
  alternateName: "RongRise Consulting",
  description:
    "從人才策略到 AI 落地，驅動永續成長。智慧轉型，創新未來。",
  url: SITE_URL,
  logo: `${SITE_URL}/images/cj-portrait-full.jpg`,
  image: `${SITE_URL}/images/cj-portrait-full.jpg`,
  founder: {
    "@type": "Person",
    name: "郭鎮榕 C.J. Kuo",
    jobTitle: "創辦人 / 企業轉型顧問",
    url: `${SITE_URL}/about`,
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "info@rongrise.com",
    areaServed: "TW",
    availableLanguage: ["Chinese"],
  },
  serviceType: ["AI 轉型策略", "人才發展策略", "ESG 永續諮詢"],
  sameAs: [
    "https://www.linkedin.com/in/c-j-kuo-5629b97b/",
    "https://www.facebook.com/cj.kuo1",
  ],
};

const GA4_ID = "G-E4PL80M0BL";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className="h-full antialiased">
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* GA4 Global Site Tag */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
          strategy="lazyOnload"
        />
        <Script id="ga4-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA4_ID}', {
              page_path: window.location.pathname,
              send_page_view: true,
            });
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <QuickChat />
      </body>
    </html>
  );
}
