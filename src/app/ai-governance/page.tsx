import Link from "next/link";

/* ============================================
   AI 治理專區（AI Governance Hub）
   彙整榕耀管顧的 agent 治理四件套：
   實錄文章 → 診斷文章 → 線上量表 → 診斷工作坊
   2026-08-20 小賀開發（W4 收尾）
   ============================================ */

const ITEMS = [
  {
    icon: "📖",
    tag: "實戰紀錄",
    title: "我們公司有 31 個員工，上個月他們把公司給弄掛了。",
    desc: "榕耀管顧自己的 agent 治理實錄：資產盤點、五檢查、月檢機制、16 筆事故教訓，全部從真實踩坑中長出來。",
    href: "/knowledge/managing-31-ai-agents/",
    cta: "閱讀實錄 →",
  },
  {
    icon: "🩺",
    tag: "診斷框架",
    title: "你的 AI 部隊健康嗎？五分鐘測出 Pilot Trap 陷阱深度",
    desc: "五個維度（平台歸屬／員工信任／人才培養／治理成熟／Pilot 陷阱）快速檢驗 AI 治理體質，附免費線上量表。",
    href: "/knowledge/pilot-trap-self-check/",
    cta: "閱讀診斷 →",
  },
  {
    icon: "📡",
    tag: "線上工具",
    title: "Pilot Trap 診斷量表",
    desc: "25 題，五分鐘，立即得到五維度健康雷達圖、陷阱深度百分比與具體行動建議。免費使用，立即開始。",
    href: "/pilot-trap-scan",
    cta: "開始診斷 →",
  },
  {
    icon: "🧭",
    tag: "顧問服務",
    title: "Agentic HR 診斷工作坊",
    desc: "三小時，把雷達圖變成你的 AI 轉型 North Star 一頁圖與 30/60/90 天行動計畫。適合 HR 主管與企業主。",
    href: "/contact",
    cta: "預約諮詢 →",
  },
];

export default function AIGovernancePage() {
  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-[#0D2B4E] via-[#0D2B4E] to-[#0A1F3A] text-white">
      <div className="max-w-5xl mx-auto px-4 py-14 md:py-20">
        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#1A6DB5]/20 border border-[#2EC4B6]/30 rounded-full px-4 py-1.5 mb-6">
            <span className="text-sm text-[#2EC4B6] font-semibold">榕耀管顧 · AI 治理系列</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6">
            AI 用得滿好，
            <br />
            不等於<span className="text-[#E8912A]">用得健康</span>
          </h1>
          <p className="text-lg md:text-xl text-[#A0C4E8] max-w-2xl mx-auto leading-relaxed">
            沒人治理的 AI 實驗，會把舊流程硬化成無人能解的 code。
            我們用親身經驗，把「AI 治理」從抽象名詞變成
            <strong className="text-white">可以檢查、可以計分、可以行動</strong>的方法。
          </p>
        </div>

        {/* 四件套 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          {ITEMS.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="group bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 hover:border-[#2EC4B6]/50 hover:bg-white/10 transition-all"
            >
              <div className="text-3xl mb-3">{it.icon}</div>
              <div className="inline-block text-xs font-bold text-[#2EC4B6] bg-[#2EC4B6]/10 rounded-full px-3 py-1 mb-3">
                {it.tag}
              </div>
              <h2 className="text-xl md:text-2xl font-bold leading-snug mb-3">{it.title}</h2>
              <p className="text-[#A0C4E8] leading-relaxed mb-4">{it.desc}</p>
              <span className="text-[#E8912A] font-semibold group-hover:translate-x-1 inline-block transition-transform">
                {it.cta}
              </span>
            </Link>
          ))}
        </div>

        {/* 為什麼 AI 治理 */}
        <div className="bg-gradient-to-br from-[#1A6DB5]/20 to-[#2EC4B6]/10 border border-[#2EC4B6]/30 rounded-2xl p-8 md:p-10 mb-10">
          <h2 className="text-2xl font-bold mb-4">為什麼是「治理」？</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[#D6E6F5]">
            <div>
              <div className="text-2xl mb-2">🚨</div>
              <p className="leading-relaxed">
                <strong className="text-white">pilot 會長大，不會自清。</strong>
                沒有治理的自動化，數量只會增加、不會收斂。我們盤點時發現 31 個任務只有 1 個有負責人。
              </p>
            </div>
            <div>
              <div className="text-2xl mb-2">⚖️</div>
              <p className="leading-relaxed">
                <strong className="text-white">信任是地基。</strong>
                同樣的 AI 個人化技術，透明是投資、不透明是監視。界線是員工相不相信這是為他們好。
              </p>
            </div>
            <div>
              <div className="text-2xl mb-2">🔄</div>
              <p className="leading-relaxed">
                <strong className="text-white">治理是紀律，不是束縛。</strong>
                每個月一號檢查一次、紅燈當月處置，AI 部隊就能跑得久、跑得穩。
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">不確定從哪裡開始？</h2>
          <p className="text-[#A0C4E8] mb-6 max-w-lg mx-auto">
            先花五分鐘做線上診斷，用雷達圖找到你的最弱維度。
          </p>
          <Link
            href="/pilot-trap-scan"
            className="inline-block bg-[#E8912A] hover:bg-[#F0A040] text-[#0D2B4E] font-bold text-lg px-10 py-4 rounded-full transition-colors shadow-lg shadow-[#E8912A]/20"
          >
            免費診斷我的 AI 部隊 →
          </Link>
        </div>
      </div>
    </div>
  );
}
