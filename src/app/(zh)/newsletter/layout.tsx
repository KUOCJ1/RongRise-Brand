import type { Metadata } from "next";

/* ============================================
   電子報專區 metadata（頁面為 client component，metadata 統一放 layout）
   /newsletter → 全期數典藏閱讀器；/newsletter/[slug] 由子頁自行覆寫
   ============================================ */

export const metadata: Metadata = {
  title: {
    absolute: "電子報典藏｜榕賀觀點 AI 週報 全期數全文檢索｜榕耀管顧",
  },
  description:
    "《榕賀觀點》全期數典藏：AI 轉型、人才策略、成本結構與 ESG 的跨領域觀點，每一期都可全文檢索、按主題標籤瀏覽。小賀每週一與週四為企業決策者整理最重要的產業變化與管理洞察。",
  keywords: [
    "榕賀觀點",
    "AI 週報",
    "電子報典藏",
    "AI 轉型電子報",
    "人才策略",
    "ESG 永續",
    "企業 AI 落地",
    "榕耀管顧",
  ],
  alternates: {
    canonical: "https://rong-rise.com/newsletter",
  },
  openGraph: {
    title: "電子報典藏｜榕賀觀點 AI 週報",
    description: "全期數典藏與全文檢索——每一期《榕賀觀點》都在這裡，找得到我們當時怎麼判斷。",
    url: "https://rong-rise.com/newsletter",
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

export default function NewsletterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
