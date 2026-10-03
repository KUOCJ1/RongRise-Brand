import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 轉型趨勢雷達｜每週企業 AI 熱門話題排行｜榕耀管顧",
  description:
    "榕耀管顧每週聚合 12+ 全球產業來源（HBR、MIT TR、McKinsey、科技新報等），追蹤企業 AI 轉型熱門話題排行、升溫降溫趨勢與焦點文章。免費線上工具，每週更新。",
  alternates: {
    canonical: "https://rong-rise.com/trend-radar",
  },
  openGraph: {
    title: "AI 轉型趨勢雷達｜每週企業 AI 熱門話題 — 榕耀管顧",
    description:
      "每週監測 12+ 來源、80+ 篇文章，一次看懂企業 AI 轉型最熱的話題與變化。",
    images: [{ url: "https://rong-rise.com/images/og-image.jpg", width: 1200, height: 630, alt: "榕耀管顧 RongRise Consulting" }],
  },
};

export default function TrendRadarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
