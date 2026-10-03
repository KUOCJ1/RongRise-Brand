import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "員工 AI 技能路徑圖｜90 天部門專屬 AI 養成計畫 ｜ 榕耀管顧",
  description:
    "選你的部門和 AI 熟度，立即獲得專屬的 90 天 AI 技能養成路徑。人力資源、行銷、業務、IT、管理層五大角色，入門到領導三級熟度，具體到每週做什麼、用什麼工具。免費工具，即開即用。",
  alternates: {
    canonical: "https://rong-rise.com/ai-skill-path",
  },
  openGraph: {
    title: "員工 AI 技能路徑圖｜90 天部門專屬養成計畫 — 榕耀管顧",
    description:
      "10-20-70 × 角色化技能養成。五大部門 × 三級熟度，立即生成你的 90 天 AI 技能養成路徑。",
    images: [{ url: "https://rong-rise.com/images/og-image.jpg", width: 1200, height: 630, alt: "榕耀管顧 RongRise Consulting" }],
  },
};

export default function AiSkillPathLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}