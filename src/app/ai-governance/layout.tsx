import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 治理專區 — 實錄、診斷、量表、工作坊｜榕耀管顧",
  description:
    "沒人治理的 AI 實驗，會把舊流程硬化成無人能解的 code。榕耀管顧 AI 治理系列：31 個 AI 員工的實戰紀錄、Pilot Trap 診斷框架、25 題線上量表、Agentic HR 診斷工作坊。",
  alternates: {
    canonical: "https://rong-rise.com/ai-governance",
  },
  openGraph: {
    title: "AI 治理專區 — AI 用得滿好，不等於用得健康",
    description:
      "實錄、診斷、量表、工作坊：把 AI 治理從抽象名詞變成可以檢查、可以計分、可以行動的方法。",
    url: "https://rong-rise.com/ai-governance",
    type: "website",
    images: [{ url: "https://rong-rise.com/images/article-managing-agents.jpg" }],
  },
};

export default function AIGovernanceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
