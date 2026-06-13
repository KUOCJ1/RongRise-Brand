import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "知識分享｜AI 轉型、人才策略、ESG 永續｜榕耀管顧",
  description: "AI 轉型、人才策略、ESG 永續的實戰經驗與洞察，協助您在轉型路上少走彎路。C.J. Kuo 老師專業文章分享。",
  alternates: {
    canonical: "https://rongrise.com/knowledge",
    languages: {
      en: "https://rongrise.com/en/knowledge",
    },
  },
  openGraph: {
    title: "知識分享｜AI 轉型、人才策略、ESG 永續 — 榕耀管顧",
    description: "AI 轉型、人才策略、ESG 永續的實戰經驗與洞察，協助您在轉型路上少走彎路。",
    images: [{ url: "https://rong-rise.com/images/og-image.jpg", width: 1200, height: 630, alt: "榕耀管顧 RongRise Consulting" }],
  },
};

export default function KnowledgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
