import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 轉型 FAQ 知識卡｜常見問題與實戰解答｜榕耀管顧",
  description:
    "從榕耀管顧知識庫、電子報與陪跑案例萃取的 AI 轉型常見問題知識卡。按角色與主題分類，每題附短答、關鍵重點與延伸閱讀，強化 AEO/SEO 長尾搜尋。",
  alternates: {
    canonical: "https://rong-rise.com/ai-faq",
  },
  openGraph: {
    title: "AI 轉型 FAQ 知識卡｜常見問題與實戰解答 — 榕耀管顧",
    description:
      "搜尋、瀏覽、篩選 AI 轉型常見問題。每張知識卡連結知識庫文章、電子報或陪跑案例，把答案變成可驗證的品牌資產。",
    url: "https://rong-rise.com/ai-faq",
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

export default function AIFaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
