import type { Metadata } from "next";
import { Noto_Sans_TC, Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-TW"
      className={`${notoSansTC.variable} ${roboto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
