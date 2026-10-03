import type { Metadata } from "next";
import "@/app/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuickChat from "@/components/QuickChat";

const SITE_NAME = "榕耀管顧 RongRise Consulting";
const SITE_DESCRIPTION =
  "以管理為本、以 AI 為用。CJ哥 20 年人資管理實戰，從組織設計、人才發展到變革領導，陪企業把 AI 真正落地。聚焦管理策略、人才發展、AI 落地、ESG 永續。";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — 把管理做深，讓 AI 落地`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
};

export default function ZhLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <QuickChat />
    </div>
  );
}
