import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "人機策略對齊度自評｜四層 12 題｜榕耀管顧",
  description:
    "榕耀管顧「人機策略四層」框架自評：人機策略、人機流程、管理機制、系統實作，四層 × 12 題。4 分鐘看出哪一層在空談、哪一層白做，並給出可執行的優先行動。",
  alternates: {
    canonical: "https://rong-rise.com/human-ai-alignment",
  },
  openGraph: {
    title: "人機策略對齊度自評｜榕耀管顧",
    description:
      "AI 預算編在 IT、錯誤落法務、人資只拿一半責任？四層 × 12 題，診斷你的人機策略對齊程度。",
    url: "https://rong-rise.com/human-ai-alignment",
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

export default function HumanAIAlignmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
