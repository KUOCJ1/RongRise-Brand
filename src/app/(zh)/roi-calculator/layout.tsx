import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 轉型 ROI 估算器 — 三分鐘算出你的投資回報｜榕耀管顧",
  description:
    "輸入產業、員工人數與導入範圍，三分鐘估算 AI 轉型的投入成本、時間節省與投資回報率（ROI）。免費線上工具，立即得到客觀的效益預估與導入範圍建議。",
  alternates: {
    canonical: "https://rong-rise.com/roi-calculator",
  },
  openGraph: {
    title: "AI 轉型 ROI 估算器 — 三分鐘算出你的投資回報",
    description:
      "輸入產業、員工人數與導入範圍，三分鐘估算 AI 轉型的投資回報率。免費線上工具。",
    url: "https://rong-rise.com/roi-calculator",
    type: "website",
    images: [
      {
        url: "https://rong-rise.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "榕耀管顧 RongRise Consulting",
      },
    ],
  },
};

export default function RoiCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
