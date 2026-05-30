import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ESG + AI 轉型自評量表｜互動評估工具 — 榕耀管顧",
  description:
    "25 題快速評估您的企業在 ESG 永續和 AI 轉型的成熟度。涵蓋環境保護、社會責任、公司治理、AI 轉型、永續策略五大維度，獲得個人化改善建議。",
};

export default function EsgAssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
