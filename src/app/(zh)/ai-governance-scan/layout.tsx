import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 治理五檢查自評｜5 分鐘測出你的治理體質 ｜ 榕耀管顧",
  description:
    "榕耀管顧原創治理五檢查框架：人、流程、資料、技術、文化。五大維度 × 20 題，五分鐘評估你的 AI 治理成熟度，找出風險維度與優先行動，與 Pilot Trap 量表互補使用。",
  alternates: {
    canonical: "https://rong-rise.com/ai-governance-scan",
  },
  openGraph: {
    title: "AI 治理五檢查自評｜5 分鐘測出治理體質 — 榕耀管顧",
    description:
      "測 Pilot Trap 測的是點卡關，測治理五檢查測的是體質。20 題，五大維度，立即診斷你的 AI 治理成熟度。",
    url: "https://rong-rise.com/ai-governance-scan",
    type: "website",
    images: [{ url: "https://rong-rise.com/images/og-image.jpg", width: 1200, height: 630, alt: "榕耀管顧 RongRise Consulting" }],
  },
};

export default function AIGovernanceScanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}