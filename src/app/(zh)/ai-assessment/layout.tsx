import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 成熟度評估｜3 分鐘測出企業 AI 轉型走到哪一步｜榕耀管顧",
  description:
    "免費 AI 轉型成熟度評估：3 分鐘回答問題，取得五大構面的成熟度分數與下一步建議。適合中小企業主與 HR 主管盤點 AI 導入現況，找出最該先動的地方。",
  alternates: {
    canonical: "https://rong-rise.com/ai-assessment",
  },
  openGraph: {
    title: "AI 成熟度評估｜榕耀管顧",
    description: "3 分鐘測出企業 AI 轉型走到哪一步，取得五大構面分數與下一步建議。",
    url: "https://rong-rise.com/ai-assessment",
    type: "website",
    images: [{ url: "https://rong-rise.com/images/og-image.jpg", width: 1200, height: 630, alt: "榕耀管顧 RongRise Consulting" }],
  },
};

export default function AiAssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
