import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 工具箱 — 免費診斷與評估工具 ｜ 榕耀管顧",
  description:
    "榕耀管顧 AI 工具箱：Pilot Trap 診斷量表、AI 成熟度評測、ROI 估算器、任務變形蟲盤點器、趨勢雷達等免費工具——即開即用，三分鐘見結果。",
  alternates: { canonical: "https://rong-rise.com/tools" },
  openGraph: {
    type: "website",
    title: "AI 工具箱 — 免費診斷與評估工具 ｜ 榕耀管顧",
    description: "Pilot Trap 診斷、AI 成熟度評測、ROI 估算、任務盤點、趨勢雷達——全部免費，即開即用。",
    url: "https://rong-rise.com/tools",
  },
};

type Tool = {
  href: string;
  icon: string;
  name: string;
  desc: string;
  tag: string;
  tagClass: string;
};

const tools: Tool[] = [
  {
    href: "/pilot-trap-scan",
    icon: "📋",
    name: "Pilot Trap 診斷量表",
    desc: "25 題、五個維度，五分鐘測出你的 AI 部隊在鋪路，還是卡進 Pilot Trap，附雷達圖一眼看懂。",
    tag: "量表",
    tagClass: "bg-tertiary/10 text-tertiary",
  },
  {
    href: "/ai-assessment",
    icon: "📊",
    name: "AI 成熟度評測",
    desc: "以 HR 的 AI 轉型五層責任架構為基礎，評估你與團隊目前的 AI 成熟度落點。",
    tag: "自評",
    tagClass: "bg-teal/10 text-teal",
  },
  {
    href: "/esg-assessment",
    icon: "🌱",
    name: "ESG + AI 轉型自評",
    desc: "互動式評估工具，檢視 ESG 與 AI 轉型兩條主線在企業內的整合現況。",
    tag: "自評",
    tagClass: "bg-teal/10 text-teal",
  },
  {
    href: "/roi-calculator",
    icon: "💰",
    name: "AI 轉型 ROI 估算器",
    desc: "三分鐘算出你的 AI 導入投資回報，讓決策站在數字上，而不是感覺上。",
    tag: "估算",
    tagClass: "bg-primary/10 text-primary",
  },
  {
    href: "/amoeba-scan",
    icon: "🔍",
    name: "任務變形蟲盤點器",
    desc: "把你的工作拆解成任務，逐項檢視哪些可以交給 AI——任務級盤點。",
    tag: "盤點",
    tagClass: "bg-primary/10 text-primary",
  },
  {
    href: "/trend-radar",
    icon: "📡",
    name: "AI 轉型趨勢雷達",
    desc: "每週企業 AI 熱門話題排行，快速掌握市場現在在討論什麼。",
    tag: "監測",
    tagClass: "bg-teal/10 text-teal",
  },
  {
    href: "/assistant",
    icon: "🦞",
    name: "AI 小賀",
    desc: "企業 AI 轉型問答助手，從成熟度到落地路徑，任何問題直接問。",
    tag: "對話",
    tagClass: "bg-primary/10 text-primary",
  },
  {
    href: "/ai-roadmap",
    icon: "🗺️",
    name: "AI 轉型路線圖生成器",
    desc: "四個問題，三分鐘生成你的 12 個月導入藍圖——三階段行動、試點場景與投資配置一次到位。",
    tag: "規劃",
    tagClass: "bg-tertiary/10 text-tertiary",
  },
  {
    href: "/content-ops",
    icon: "📈",
    name: "內容引擎戰情室",
    desc: "AI 驅動內容引擎的營運儀表板，即時掌握知識庫與內容生產狀態。",
    tag: "營運",
    tagClass: "bg-tertiary/10 text-tertiary",
  },
];

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-bg-alt">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0D2B4E] via-[#123A66] to-[#1A6DB5] text-white relative overflow-hidden">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-teal/25 blur-3xl" />
        <div className="absolute -bottom-32 right-40 w-80 h-80 rounded-full bg-tertiary/20 blur-3xl" />
        <div className="relative max-w-[1000px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <span className="inline-block text-sm font-bold tracking-[0.2em] text-tertiary border-2 border-tertiary/60 rounded-full px-4 py-1.5 mb-6">
            AI TOOLBOX · 工具箱
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-tight">
            AI 工具箱
          </h1>
          <p className="mt-5 text-lg text-white/75 leading-relaxed max-w-2xl">
            把「你的 AI 走到哪一步」變成可以測量、可以估算、可以盤點的事。
            所有工具免費使用，即開即用，不用註冊。
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool) => (
            <a
              key={tool.href}
              href={tool.href}
              className="group bg-white rounded-2xl border border-border p-6 flex flex-col no-underline hover:shadow-lg hover:border-primary/30 transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{tool.icon}</span>
                <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full ${tool.tagClass}`}>
                  {tool.tag}
                </span>
              </div>
              <h2 className="font-bold text-text-primary text-[17px] group-hover:text-primary transition-colors">
                {tool.name}
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed mt-2 flex-1">{tool.desc}</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary mt-5">
                開始使用
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </a>
          ))}
        </div>

        {/* CTA */}
        <section className="mt-14 bg-gradient-to-br from-[#0D2B4E] via-[#123A66] to-[#1A6DB5] rounded-3xl p-10 md:p-14 text-white text-center relative overflow-hidden">
          <div className="absolute -left-20 -top-20 w-72 h-72 rounded-full bg-teal/20 blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-2xl md:text-3xl font-extrabold">
              測完之後，下一步呢？
            </h2>
            <p className="mt-4 text-white/75 leading-relaxed max-w-xl mx-auto">
              工具給你看見現況，顧問幫你把現況變成行動。預約 30 分鐘免費諮詢，我們一起找出最值得先做的那一步。
            </p>
            <a
              href="/about/#contact"
              className="inline-block mt-8 bg-tertiary hover:bg-[#F5A623] text-white font-bold px-8 py-3.5 rounded-full transition-colors"
            >
              預約免費諮詢
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
