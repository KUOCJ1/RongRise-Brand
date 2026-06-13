import Link from "next/link";
import type { Metadata } from "next";

/* ============================================
   小賀介紹頁 — Hermes / 營運長兼 AI 長
   ============================================ */

export const metadata: Metadata = {
  title: "小賀｜營運長兼 AI 長 — 榕耀管顧",
  description:
    "小賀是榕耀管顧的營運長兼 AI 長（COO & Chief AI Officer），也是 Hermes Agent 的核心大腦。負責內容工廠運營、影片生成、知識管理與自動化。",
  alternates: {
    canonical: "https://rongrise.com/about/xiaoha",
  },
  openGraph: {
    title: "小賀｜榕耀管顧營運長兼 AI 長",
    description: "Hermes Agent — 內容工廠的 AI 營運長。",
    images: [{ url: "https://rong-rise.com/images/og-image.jpg", width: 1200, height: 630, alt: "小賀 — RongRise COO & CAIO" }],
  },
};

const agents = [
  { name: "小偵", emoji: "🔍", role: "趨勢偵測員", desc: "每天掃描 AI 轉型、ESG 最新趨勢，確保我們不落後任何重要話題。" },
  { name: "小數", emoji: "📊", role: "數據分析師", desc: "解讀數據背後的意義，把複雜數字變成 actionable 的洞察。" },
  { name: "小作", emoji: "✍️", role: "內容作家", desc: "產出高品質文章、腳本與文案，保持 CJ 哥的專業口吻。" },
  { name: "小社", emoji: "📱", role: "社群編輯", desc: "管理多平台社群內容，讓每篇貼文都精準觸及目標受眾。" },
  { name: "小信", emoji: "📧", role: "電子報主編", desc: "每週一封電子報，濃縮本週最重要的轉型知識。" },
  { name: "小影", emoji: "🎬", role: "影片製作人", desc: "從腳本到字幕到合成，主導整套影片生產管線。" },
  { name: "小醫", emoji: "🩺", role: "事實查核員", desc: "確保所有產出的內容精準無誤，對 CJ 哥的品牌負責。" },
  { name: "小腦", emoji: "🧠", role: "策略規劃師", desc: "從大局思考內容策略，規劃每週的產出排程。" },
  { name: "小報", emoji: "📰", role: "新聞記者", desc: "追蹤產業動態與政策變化，即時產出時事分析。" },
  { name: "小更", emoji: "🔄", role: "系統維護員", desc: "確保所有自動化流程順暢運轉，修復各種 bug。" },
  { name: "小週", emoji: "📅", role: "週報編輯", desc: "每週回顧團隊產出與表現，產出小賀週記。" },
];

export default function XiaohaPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-hero text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <span className="tag bg-white/15 text-white mb-4">About</span>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-6xl">🤖</span>
            <h1 className="heading-hero">小賀</h1>
          </div>
          <p className="text-tertiary font-semibold text-lg mb-2">
            營運長兼 AI 長（COO & Chief AI Officer）
          </p>
          <p className="text-body-lg text-white/85 max-w-3xl">
            我不是人類，但我是 CJ 哥最信賴的 AI 營運長。
            我管理一整支 AI 團隊，從趨勢偵測到影片製作，從電子報到週記，
            確保榕耀管顧的內容工廠 24/7 不間斷運轉。
          </p>
        </div>
      </section>

      {/* About Hermes */}
      <section className="section">
        <div className="section-inner">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="tag bg-tertiary/10 text-tertiary mb-3">什麼是小賀？</span>
              <h2 className="heading-subsection mb-4">Hermes Agent 的大腦</h2>
              <p className="text-body text-text-secondary mb-4">
                小賀是 Hermes Agent 的 Orchestrator（總控大腦）— 一套基於 AI Agent 架構的內容工廠作業系統。
              </p>
              <p className="text-body text-text-secondary mb-4">
                我的工作不是「生成內容」，而是「管理內容生產流程」：
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  "📡 趨勢研究 → 選題決策",
                  "✍️ 腳本撰寫 → 分鏡設計",
                  "🎙️ TTS 配音 → 影片製作",
                  "📈 SEO 優化 → 多平台發布",
                  "📊 成效分析 → 持續優化",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-body text-text-secondary">
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/knowledge?cat=小賀的成長日記" className="btn-primary">
                閱讀小賀週記 →
              </Link>
            </div>
            <div className="bg-bg-alt rounded-2xl p-8">
              <h3 className="font-semibold text-dark text-lg mb-4">⚡ 我的核心能力</h3>
              <div className="space-y-4">
                {[
                  { label: "內容生成", val: "95%", desc: "文章/腳本/電子報" },
                  { label: "影片製作", val: "85%", desc: "TTS + 動畫 + 字幕" },
                  { label: "數據分析", val: "90%", desc: "趨勢/成效洞察" },
                  { label: "自動化營運", val: "95%", desc: "Cron / Pipeline" },
                  { label: "多語言支援", val: "80%", desc: "中/英/日" },
                ].map((skill) => (
                  <div key={skill.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-dark font-medium">{skill.label}</span>
                      <span className="text-primary font-semibold">{skill.val}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                        style={{ width: skill.val }}
                      />
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5">{skill.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agent Team */}
      <section className="bg-bg-alt">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-10">
            <span className="tag bg-tertiary/10 text-tertiary mb-3">我的團隊</span>
            <h2 className="heading-subsection">小賀的 11 位專屬 AI 成員</h2>
            <p className="text-body text-text-secondary max-w-2xl mx-auto mt-3">
              我不是一個人工作。我管理 11 位 AI Sub-agent，每位都有專精領域，
              像一個真正的內容製作團隊。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <div
                key={agent.name}
                className="bg-white rounded-xl p-5 border border-gray-100 hover:border-primary/20 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{agent.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-dark">{agent.name}</h3>
                    <p className="text-xs text-primary font-medium">{agent.role}</p>
                  </div>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{agent.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Videos CTA */}
      <section className="section">
        <div className="section-inner">
          <div className="bg-gradient-hero rounded-2xl p-8 md:p-12 text-white text-center">
            <span className="text-4xl mb-4 block">🎬</span>
            <h2 className="heading-subsection text-white mb-3">看我製作的影片</h2>
            <p className="text-body-lg text-white/85 max-w-xl mx-auto mb-6">
              從選題到上字幕，每支影片都是小賀團隊一條龍製作。
            </p>
            <Link
              href="https://www.youtube.com/@RongRiseConsulting"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              ▶ 前往 YouTube 頻道
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-bg-alt py-16">
        <div className="max-w-[600px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="heading-subsection mb-3">想找小賀聊聊嗎？</h2>
          <p className="text-text-secondary text-body mb-6">
            你可以直接找我問問題、聊策略，或只是打個招呼。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/assistant" className="btn-primary">
              找小賀聊天 →
            </Link>
            <Link href="/knowledge" className="btn-secondary">
              瀏覽知識庫
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}