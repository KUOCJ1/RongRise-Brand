import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "知識庫｜AI 轉型實戰攻略 × 企業案例",
  description:
    "榕耀管顧知識庫：AI 轉型、人才策略、ESG 永續的深度文章與實戰案例。由 C.J. Kuo 老師撰寫，協助企業少走轉型彎路。",
  openGraph: {
    title: "知識庫｜AI 轉型實戰攻略 x 企業案例 — 榕耀管顧",
    description: "AI 轉型、人才策略、ESG 永續的深度文章與實戰案例。",
    images: [
      {
        url: "https://rong-rise.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "榕耀管顧知識庫",
      },
    ],
  },
};

export default function KnowledgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
