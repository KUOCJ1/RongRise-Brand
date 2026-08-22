import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pilot Trap 診斷量表 — 你的 AI 部隊在鋪路還是卡進陷阱？｜榕耀管顧",
  description:
    "25 題五分鐘，測出你的 AI 應用是在為未來營運鋪路，還是在把舊流程硬化成無人治理的 code。立即得到五維度健康雷達圖（平台歸屬／員工信任／人才培養／治理成熟／Pilot 陷阱）與具體行動建議。方法論源自 McKinsey《逃離 Pilot 陷阱》。",
  alternates: {
    canonical: "https://rong-rise.com/pilot-trap-scan",
  },
  openGraph: {
    title: "Pilot Trap 診斷量表 — 你的 AI 部隊在鋪路還是卡進陷阱？",
    description:
      "25 題五分鐘，測出你的 AI 應用是在為未來營運鋪路，還是在把舊流程硬化成無人治理的 code。免費線上工具。",
    url: "https://rong-rise.com/pilot-trap-scan",
    type: "website",
    images: [{ url: "https://rong-rise.com/images/article-managing-agents.jpg", width: 1200, height: 630, alt: "榕耀管顧 Pilot Trap 診斷" }],
  },
};

export default function PilotTrapScanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
