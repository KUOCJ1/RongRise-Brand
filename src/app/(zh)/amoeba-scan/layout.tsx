import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "任務變形蟲盤點器｜你的工作有多少能交給 AI？｜榕耀管顧",
  description:
    "勾選日常工作任務，立即盤點哪些適合 AI 自動化、哪些該人機協作、哪些必須留給人。三分鐘算出團隊每週可節省工時，方法論對齊《任務變形蟲 Task Amoeba Model》研究專刊。免費線上工具。",
  alternates: {
    canonical: "https://rong-rise.com/amoeba-scan",
  },
  openGraph: {
    title: "任務變形蟲盤點器｜AI 化任務分類免費工具 — 榕耀管顧",
    description:
      "勾選日常工作任務，立即盤點哪些適合 AI 自動化、哪些該人機協作、哪些必須留給人。三分鐘算出團隊每週可節省工時。",
    images: [{ url: "https://rong-rise.com/images/og-image.jpg", width: 1200, height: 630, alt: "榕耀管顧 RongRise Consulting" }],
  },
};

export default function AmoebaScanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
