import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HR AI 化成熟度評估｜5 分鐘找出 HR 轉型優先順序 ｜ 榕耀管顧",
  description:
    "HR 部門的 AI 化程度如何？從招募甄選、績效管理、培訓發展、員工服務到數據決策五大場景，20+ 題快速評估你的 HR AI 成熟度，獲得優先行動建議與缺口分析。免費線上工具，即開即用。",
  alternates: {
    canonical: "https://rong-rise.com/ai-hr-assessment",
  },
  openGraph: {
    title: "HR AI 化成熟度評估｜5 分鐘找出轉型優先順序 — 榕耀管顧",
    description:
      "CJ 哥 20 年人資 × AI 轉型實戰。五大場景 × 20+ 題，立即評估你的 HR AI 化成熟度，獲得優先行動建議。",
    images: [{ url: "https://rong-rise.com/images/og-image.jpg", width: 1200, height: 630, alt: "榕耀管顧 RongRise Consulting" }],
  },
};

export default function AiHrAssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}