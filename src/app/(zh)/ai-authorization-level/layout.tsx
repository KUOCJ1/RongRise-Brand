import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 員工授權等級測驗｜這件事該不該交給 AI？｜榕耀管顧",
  description:
    "依據榕耀管顧《人類與 AI 的授權悖論》授權四級：L1 建議、L2 可逆執行、L3 不可逆執行、L4 對外代表。四個維度、約三分鐘，判斷一個任務該交給 AI 到什麼程度。",
  alternates: {
    canonical: "https://rong-rise.com/ai-authorization-level",
  },
  openGraph: {
    title: "AI 員工授權等級測驗｜榕耀管顧",
    description:
      "這件事該不該交給 AI？四個維度判斷：資料穩定度、錯誤成本、人工覆核必要性、外部影響範圍。",
    url: "https://rong-rise.com/ai-authorization-level",
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

export default function AIAuthorizationLevelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
