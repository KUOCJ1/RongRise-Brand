import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agentic AI 員工管理學五階自評｜5 分鐘診斷你的 AI 是否被管理｜榕耀管顧",
  description:
    "榕耀管顧原創 Agentic AI 員工管理學五階自評：招募、入職、考核、治理、成長。五大階段 × 15 題，即刻了解企業 AI 員工管理成熟度，給出優先行動建議。",
  alternates: {
    canonical: "https://rong-rise.com/ai-employee-diagnosis",
  },
  openGraph: {
    title: "Agentic AI 員工管理學五階自評｜榕耀管顧",
    description:
      "你的 AI 是被管理的員工，還是被當成工具採購？五階生命週期 × 15 題，5 分鐘診斷。",
    url: "https://rong-rise.com/ai-employee-diagnosis",
    type: "website",
    images: [{ url: "https://rong-rise.com/images/og-image.jpg", width: 1200, height: 630, alt: "榕耀管顧 RongRise Consulting" }],
  },
};

export default function AIEmployeeDiagnosisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
