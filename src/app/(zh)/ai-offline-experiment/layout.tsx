import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 轉型離線實驗計算器｜榕耀管顧",
  description:
    "輸入團隊人數、AI 員工數、預計離線天數與關鍵業務數，以榕耀 13 天公開實驗為基線，計算你需要預留多少檢查窗口、風險熱區與離線檢查清單。",
  alternates: {
    canonical: "https://rong-rise.com/ai-offline-experiment/",
  },
  openGraph: {
    title: "AI 轉型離線實驗計算器｜榕耀管顧",
    description:
      "以榕耀管顧 13 天公開實驗為基線，計算離線期間的檢查窗口、風險熱區與行動檢查清單。",
    url: "https://rong-rise.com/ai-offline-experiment/",
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

export default function AIOfflineExperimentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
