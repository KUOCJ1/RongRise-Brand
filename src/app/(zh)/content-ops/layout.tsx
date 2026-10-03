import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "內容引擎戰情室｜AI 驅動內容引擎營運儀表板｜榕耀管顧",
  description:
    "榕耀管顧「小哈內容引擎」公開戰情室：知識掃描天數、官網文章、電子報期數、訂閱者、YouTube 影片與競對監測——每日自動彙整的 AI 內容營運實績。",
  alternates: {
    canonical: "https://rong-rise.com/content-ops",
  },
  openGraph: {
    title: "內容引擎戰情室｜每天自己運作的 AI 內容引擎 — 榕耀管顧",
    description:
      "一台連續運作上百天的 AI 內容引擎：每日產業掃描、趨勢分析、內容產出與數據回饋，全部自動化。",
    images: [{ url: "https://rong-rise.com/images/og-image.jpg", width: 1200, height: 630, alt: "榕耀管顧 RongRise Consulting" }],
  },
};

export default function ContentOpsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
