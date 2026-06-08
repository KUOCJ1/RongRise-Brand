import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 長小賀｜AI 問答助手｜榕耀管顧",
  description: "有任何關於 AI 轉型、人才發展、ESG 永續的問題？榕耀管顧 AI 小幫手即時為您解答。基於 CJ哥專業知識庫。",
  alternates: {
    canonical: "https://rongrise.com/assistant",
  },
};

export default function AssistantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
