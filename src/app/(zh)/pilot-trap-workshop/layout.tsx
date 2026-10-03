import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agentic HR 診斷工作坊 — 團隊彙總工具 ｜ 榕耀管顧",
  description:
    "Pilot Trap 診斷量表的工作坊模式：把團隊成員的個人診斷分數彙總，三分鐘產生團隊平均雷達圖、健康分佈與高分歧維度，可直接列印 A4 診斷報告。",
  openGraph: {
    title: "Agentic HR 診斷工作坊 — 團隊彙總工具",
    description:
      "把團隊成員的 Pilot Trap 診斷分數彙總成雷達圖與行動建議，可列印 A4 報告。",
    type: "website",
    url: "https://rong-rise.com/pilot-trap-workshop/",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
