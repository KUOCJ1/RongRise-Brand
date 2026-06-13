import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ESG + AI 轉型自評｜互動評估工具｜榕耀管顧",
  description: "25 題快速評估，了解您的企業在 ESG 永續和 AI 轉型上的成熟度，獲得個人化建議。免費線上工具，數據不被儲存。",
  alternates: {
    canonical: "https://rongrise.com/esg-assessment",
    languages: {
      en: "https://rongrise.com/en/esg-assessment",
    },
  },
  openGraph: {
    title: "ESG + AI 轉型自評｜互動評估工具 — 榕耀管顧",
    description: "25 題快速評估，了解您的企業在 ESG 永續和 AI 轉型上的成熟度，獲得個人化建議。",
    images: [{ url: "https://rong-rise.com/images/og-image.jpg", width: 1200, height: 630, alt: "榕耀管顧 RongRise Consulting" }],
  },
};

export default function EsgAssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
