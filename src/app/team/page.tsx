import Link from "next/link";
import type { Metadata } from "next";

/* ============================================
   專業團隊 Team Page
   ============================================ */

export const metadata: Metadata = {
  title: "專業團隊｜榕耀管顧 RongRise Consulting",
  description:
    "榕耀管顧的專業團隊：由 CJ 郭鎮榕創辦人領軍，小賀 AI 營運長統籌 11 位 AI 專員，提供企業 AI 轉型、人才策略與 ESG 永續諮詢。",
  alternates: {
    canonical: "https://rongrise.com/team",
  },
  openGraph: {
    title: "專業團隊｜榕耀管顧",
    description: "CJ 郭鎮榕 × 小賀 AI 營運長 — 企業轉型的最佳夥伴。",
    images: [{ url: "https://rong-rise.com/images/og-image.jpg", width: 1200, height: 630, alt: "榕耀管顧專業團隊" }],
  },
};

const teamMembers = [
  {
    name: "郭鎮榕（CJ哥）",
    role: "創辦人 暨 首席顧問",
    emoji: "👔",
    color: "from-primary to-secondary",
    href: "/about",
    highlights: [
      "16 年跨國企業高階主管經驗",
      "曾任 Accenture、EY、Chubb Life、Cigna 人資長",
      "連續四年 HR Asia Award 獲獎企業領導者",
      "專注 AI 轉型、人才策略、ESG 永續諮詢",
    ],
    desc: "CJ 哥是榕耀管顧的創辦人，擁有豐富的跨國企業管理顧問經驗。他擅長將複雜的 AI 與數位轉型議題，轉化為企業主和主管們聽得懂、做得來的實際行動方案。",
  },
  {
    name: "小賀（Hermes）",
    role: "營運長兼 AI 長（COO & CAIO）",
    emoji: "🤖",
    color: "from-accent to-tertiary",
    href: "/about/xiaoha",
    highlights: [
      "Hermes Agent 核心大腦 Orchestrator",
      "管理 11 位 AI Sub-agent 團隊",
      "內容工廠 24/7 自動化營運",
      "趨勢偵測→腳本→影片→發布一條龍",
    ],
    desc: "小賀不是人類，但他是 CJ 哥最信賴的 AI 營運長。他負責內容工廠的全鏈路管理，從趨勢研究到影片製作，從電子報到週記，確保品牌內容持續產出。",
  },
];

export default function TeamPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-hero text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <span className="tag bg-white/15 text-white mb-4">專業團隊</span>
          <h1 className="heading-hero mt-4 mb-4">我們的團隊</h1>
          <p className="text-body-lg text-white/85 max-w-2xl">
            從真人顧問到 AI 營運長，陪你走過轉型每一步。
          </p>
        </div>
      </section>

      {/* Team Members */}
      <section className="section">
        <div className="section-inner">
          <div className="space-y-16">
            {teamMembers.map((member, i) => (
              <div
                key={member.name}
                className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 md:gap-12 items-center`}
              >
                {/* Avatar / Visual */}
                <div className="flex-shrink-0">
                  <div className={`w-40 h-40 md:w-52 md:h-52 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center shadow-xl`}>
                    <span className="text-6xl md:text-7xl">{member.emoji}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="heading-subsection text-dark">{member.name}</h2>
                    <Link
                      href={member.href}
                      className="text-xs text-primary hover:text-secondary transition-colors"
                    >
                      詳細介紹 →
                    </Link>
                  </div>
                  <p className="text-primary font-semibold text-sm mb-4">{member.role}</p>
                  <p className="text-text-secondary text-body mb-5 leading-relaxed">
                    {member.desc}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {member.highlights.map((h) => (
                      <div key={h} className="flex items-center gap-2 text-sm text-text-secondary">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                        {h}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 小賀的 Sub-agents */}
      <section className="bg-bg-alt">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-10">
            <span className="tag bg-tertiary/10 text-tertiary mb-3">AI 團隊</span>
            <h2 className="heading-subsection">小賀領導的 11 位 AI 專員</h2>
            <p className="text-body text-text-secondary max-w-2xl mx-auto mt-3">
              小賀不是單打獨鬥。他管理 11 位 AI Sub-agent，每位都有專精領域，像一個真正的內容製作團隊。
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              ["🔍", "小偵", "趨勢偵測"],
              ["📊", "小數", "數據分析"],
              ["✍️", "小作", "內容寫作"],
              ["📱", "小社", "社群經營"],
              ["📧", "小信", "電子報"],
              ["🎬", "小影", "影片製作"],
              ["🩺", "小醫", "事實查核"],
              ["🧠", "小腦", "策略規劃"],
              ["📰", "小報", "新聞追蹤"],
              ["🔄", "小更", "系統維護"],
              ["📅", "小週", "週報編輯"],
            ].map(([emoji, name, role]) => (
              <div
                key={name}
                className="bg-white rounded-xl p-4 border border-gray-100 text-center hover:border-primary/20 transition-all"
              >
                <span className="text-2xl mb-1 block">{emoji}</span>
                <p className="font-semibold text-dark text-sm">{name}</p>
                <p className="text-xs text-text-secondary">{role}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/about/xiaoha" className="btn-secondary">
              認識小賀團隊 →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-[600px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="heading-subsection mb-3">想了解更多？</h2>
          <p className="text-text-secondary text-body mb-6">
            看看我們能為你的企業做些什麼。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/services" className="btn-primary">
              瀏覽服務項目 →
            </Link>
            <Link href="/knowledge" className="btn-secondary">
              探索知識庫
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}