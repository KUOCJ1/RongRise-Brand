import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 投資配置體檢（10-20-70）｜你的預算花對地方了嗎？ ｜ 榕耀管顧",
  description:
    "輸入年度 AI 預算與技術／流程／人三桶配置，兩分鐘看出哪一桶失衡：10-20-70 建議區間、金額缺口、症狀自檢與 30/40/30 預算釋出節奏，免費即開即用。",
  alternates: {
    canonical: "https://rong-rise.com/ai-investment-split",
  },
  openGraph: {
    title: "AI 投資配置體檢（10-20-70）— 榕耀管顧",
    description:
      "技術 10% / 流程 20% / 人 70%：輸入預算與配置，立即診斷哪一桶失衡、該把錢移到哪裡。",
    url: "https://rong-rise.com/ai-investment-split",
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
  twitter: {
    card: "summary_large_image",
    title: "AI 投資配置體檢（10-20-70）— 榕耀管顧",
    description: "技術 10% / 流程 20% / 人 70%：輸入預算與配置，立即診斷哪一桶失衡。",
    images: ["https://rong-rise.com/images/og-image.jpg"],
  },
};

export default function AIInvestmentSplitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
