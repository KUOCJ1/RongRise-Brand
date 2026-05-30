import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 轉型小幫手｜免費諮詢 — 榕耀管顧",
  description:
    "有任何關於 AI 轉型、人才發展、ESG 永續的問題？榕耀管顧 AI 轉型小幫手為您解答。依據 C.J. Kuo 老師的專業知識庫，提供個人化建議。",
  openGraph: {
    title: "AI 轉型小幫手｜免費諮詢 — 榕耀管顧",
    description: "有任何關於 AI 轉型、人才發展、ESG 永續的問題？讓小幫手為您解答。",
    images: [
      {
        url: "https://rong-rise.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "榕耀管顧 AI 轉型小幫手",
      },
    ],
  },
};

export default function AssistantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
