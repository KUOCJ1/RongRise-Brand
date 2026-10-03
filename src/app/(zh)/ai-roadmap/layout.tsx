import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 轉型路線圖生成器｜12 個月導入藍圖免費工具 ｜ 榕耀管顧",
  description:
    "輸入企業規模、想導入的範圍、目前進度與預算，三分鐘生成專屬的 12 個月 AI 轉型路線圖：三階段行動清單、試點場景推薦、10-20-70 投資配置建議。免費線上工具，即開即用。",
  alternates: {
    canonical: "https://rong-rise.com/ai-roadmap",
  },
  openGraph: {
    title: "AI 轉型路線圖生成器｜12 個月導入藍圖 — 榕耀管顧",
    description:
      "四個問題，一張路線圖。輸入規模、範圍、進度與預算，立即生成你的 12 個月 AI 轉型藍圖：盤點、試點、規模化三階段行動清單。",
    images: [{ url: "https://rong-rise.com/images/og-image.jpg", width: 1200, height: 630, alt: "榕耀管顧 RongRise Consulting" }],
  },
};

export default function AiRoadmapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
