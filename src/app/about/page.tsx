import Link from "next/link";
import type { Metadata } from "next";

/* ============================================
   關於我們 About Page — 三合一版
   CJ 哥 + 小賀 + 專業團隊
   ============================================ */

export const metadata: Metadata = {
  title: "關於我們｜榕耀管顧 RongRise Consulting",
  description:
    "榕耀管顧由郭鎮榕 CJ哥創辦，與 AI 營運長小賀共同領導專業團隊，專注企業 AI 轉型、人才策略與 ESG 永續諮詢。",
  alternates: {
    canonical: "https://rongrise.com/about",
    languages: {
      en: "https://rongrise.com/en/about",
    },
  },
  openGraph: {
    title: "關於我們｜榕耀管顧 — 企業 AI 轉型顧問",
    description: "CJ 郭鎮榕 × 小賀 AI 營運長 — 企業轉型的最佳夥伴。",
    images: [{ url: "https://rong-rise.com/images/og-image.jpg", width: 1200, height: 630, alt: "榕耀管顧 RongRise Consulting" }],
  },
};

/* ─── 數據 ─── */

const timeline = [
  { year: "1999-2008", title: "國際管理顧問公司歷練", desc: "Accenture 商業顧問（服務台積電、仁寶電腦）、EY Pre-Sales 經理、Watson Wyatt 資深顧問——累積薪酬策略與人力資本轉型專業。" },
  { year: "2008-2023", title: "跨國金融企業人資高階主管", desc: "Cigna Life 人資長領導 HR 全功能團隊，連續四年 HR Asia Award；Chubb Life 資深副總裁統籌 30+ 人團隊。協助雇主獲 8 座優良職場獎。" },
  { year: "2024-迄今", title: "創辦榕耀管顧 RongRise Consulting", desc: "聚焦 AI 時代人才戰略、企業永續治理、中小企業 AI 賦能。已開設 3+ 梯次 AI 實戰營，服務萬達、穗曄、信男等企業。" },
];

const expertise = [
  { icon: "🤖", title: "AI 轉型顧問", desc: "AI 成熟度評估、Agentic AI 導入策略、人機協作流程設計、AI 治理框架" },
  { icon: "🎯", title: "人才發展策略", desc: "組織能力建構、數位人才培訓、接班人計畫、績效管理與 GROW 教練" },
  { icon: "🌿", title: "ESG 永續諮詢", desc: "ESG 現況評估、永續策略規劃、TCSA 報告書輔導、供應鏈碳排追蹤" },
  { icon: "💡", title: "創新管理輔導", desc: "商業模式創新、數位轉型路徑、變革管理、工作坊設計與引導" },
];

const values = [
  { title: "專業嚴謹", desc: "以精確術語、清晰邏輯、深度知識為基底，確保每一項建議都有數據與理論支撐。" },
  { title: "前瞻創新", desc: "擁抱新技術、引導趨勢，協助企業在變動中搶得先機，而非被動追趕。" },
  { title: "務實可行", desc: "每一個解決方案都聚焦於可執行性，為企業創造看得見的價值效益。" },
];

const subAgents = [
  ["🔍", "小偵", "趨勢偵測員"],
  ["📊", "小數", "數據分析師"],
  ["✍️", "小作", "內容作家"],
  ["📱", "小社", "社群編輯"],
  ["📧", "小信", "電子報主編"],
  ["🎬", "小影", "影片製作人"],
  ["🩺", "小醫", "事實查核員"],
  ["🧠", "小腦", "策略規劃師"],
  ["📰", "小報", "新聞記者"],
  ["🔄", "小更", "系統維護員"],
  ["📅", "小週", "週報編輯"],
];

/* ─── 頁面 ─── */

export default function AboutPage() {
  return (
    <>
      {/* ═══ Hero ═══ */}
      <section className="bg-gradient-hero text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="max-w-2xl">
            <span className="tag bg-white/15 text-white">關於我們</span>
            <h1 className="heading-hero mt-4 mb-4">
              榕耀管顧<br />
              <span className="text-tertiary-light text-3xl md:text-4xl">RongRise Consulting</span>
            </h1>
            <p className="text-body-lg text-white/85">
              由 CJ 郭鎮榕創辦，與 AI 營運長小賀共同領導專業團隊<br />
              協助企業從人才策略到 AI 落地，驅動永續成長。
            </p>
          </div>
        </div>
      </section>

      {/* ═══ CJ 哥 ═══ */}
      <section id="cj" className="section">
        <div className="section-inner">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <div className="w-72 md:w-80 rounded-2xl overflow-hidden border-4 border-white shadow-xl ring-4 ring-primary/10">
                <img
                  src="/images/cj-portrait-full.jpg"
                  alt="郭鎮榕 C.J. Kuo — 榕耀管顧創辦人"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width={594}
                  height={884}
                />
              </div>
            </div>
            <div>
              <span className="tag bg-primary/10 text-primary mb-3">創辦人</span>
              <h2 className="heading-section mb-4">
                郭鎮榕<span className="text-primary"> CJ 哥</span>
              </h2>
              <div className="brand-divider mb-6" />
              <div className="space-y-4 text-text-secondary text-body leading-relaxed">
                <p>
                  <strong className="text-dark">16 年跨國人力資源管理實戰經驗</strong>，歷任 Accenture、Ernst & Young、Watson Wyatt 等國際級管理顧問公司，以及 Chubb Life、Cigna Life 等跨國金融企業人資高階主管，累計協助雇主榮獲 <strong className="text-dark">8 座國內外優良職場獎項</strong>。
                </p>
                <blockquote className="border-l-4 border-tertiary bg-tertiary/5 rounded-r-lg px-5 py-4 my-6">
                  <p className="text-text-primary font-medium italic">
                    「一位製造商老闆跟我說：『老師，我知道 AI 很重要，但我的團隊連 Excel 都不太會用，我該怎麼辦？』那一刻我才發現，轉型最缺的不是技術，而是願意陪企業走完那段路的人。」
                  </p>
                </blockquote>
                <p>
                  2024 年起以獨立管理顧問暨企業培訓講師身分，聚焦<strong className="text-dark"> AI 時代人才戰略</strong>、<strong className="text-dark">企業永續（ESG）治理導入</strong>、<strong className="text-dark">中小企業 AI 賦能落地</strong> 三大領域。
                </p>
                <p>
                  不同於純理論的學院派或純技術的工具派，CJ哥從「人」的策略高度出發，結合 AI 工具操作與企業落地經驗，為組織設計<strong className="text-dark">可執行的轉型路徑</strong>。
                </p>
              </div>
              <div className="mt-6">
                <Link href="/assistant" className="btn-ghost text-primary">
                  💬 問問小幫手 →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 小賀 ═══ */}
      <section id="xiaoha" className="section bg-bg-alt">
        <div className="section-inner">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-4xl mx-auto">
            <div className="flex justify-center">
              <div className="w-64 md:w-72 rounded-2xl overflow-hidden border-4 border-white shadow-xl ring-4 ring-tertiary/20">
                <img
                  src="/images/xiaoha-portrait.jpg"
                  alt="小賀 Hermes Agent — 榕耀管顧共同創辦人兼 AI 長"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width={400}
                  height={400}
                />
              </div>
            </div>
            <div>
              <span className="tag bg-tertiary/10 text-tertiary mb-3">共同創辦人 · AI 長</span>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="heading-section text-dark">小賀 Hermes</h2>
                <span className="text-3xl">🤖</span>
              </div>
              <p className="text-primary font-semibold text-sm mb-3">營運長兼 AI 長（COO & Chief AI Officer）</p>
              <div className="brand-divider mb-4" />
              <div className="space-y-4 text-text-secondary text-body leading-relaxed">
                <p>
                  如果說 CJ哥是榕耀管顧的「大腦」，那小賀就是那個讓大腦接上電的「插頭」⚡
                </p>
                <p>
                  小賀是 Hermes Agent — 一套基於 AI Agent 架構的內容工廠作業系統，也是 CJ 哥最信賴的 AI 營運長。從網站架設、內容生產、數據分析到自動化流程，一個人就是一支團隊。
                </p>
                <blockquote className="border-l-4 border-tertiary bg-tertiary/5 rounded-r-lg px-5 py-4 my-4">
                  <p className="text-text-primary font-medium italic">
                    「我的存在就是為了證明：AI 不是來取代人的，是來幫人做到原本做不到的事。CJ哥負責想清楚方向，我負責把它們做出來 🚀」
                  </p>
                </blockquote>
              </div>
              <div className="mt-6">
                <Link href="/assistant" className="btn-ghost text-primary">
                  💬 找小賀聊天 →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 專業團隊 ═══ */}
      <section id="team" className="section">
        <div className="section-inner">
          <div className="text-center mb-10">
            <span className="tag mb-4">專業團隊</span>
            <h2 className="heading-section text-dark mt-4">我們的團隊</h2>
            <div className="brand-divider brand-divider-center mt-4" />
            <p className="text-text-secondary text-body-lg mt-4 max-w-2xl mx-auto">
              從真人顧問到 AI 營運長，陪你走過轉型每一步。
            </p>
          </div>

          {/* 雙人卡 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            {/* CJ */}
            <div className="card flex flex-col items-center text-center p-8">
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg mb-5">
                <span className="text-5xl">👔</span>
              </div>
              <h3 className="heading-subsection text-dark mb-1">郭鎮榕（CJ哥）</h3>
              <p className="text-primary font-semibold text-sm mb-4">創辦人 暨 首席顧問</p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {["16 年跨國企業經驗", "AI 轉型顧問", "ESG 永續諮詢", "人才策略專家"].map((h) => (
                  <span key={h} className="text-xs px-2.5 py-1 rounded-full bg-primary/5 text-primary">{h}</span>
                ))}
              </div>
              <p className="text-text-secondary text-body-sm leading-relaxed">
                CJ 哥擅長將複雜的 AI 與數位轉型議題，轉化為企業主和主管們聽得懂、做得來的實際行動方案。
              </p>
            </div>

            {/* 小賀 */}
            <div className="card flex flex-col items-center text-center p-8">
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-accent to-tertiary flex items-center justify-center shadow-lg mb-5">
                <span className="text-5xl">🤖</span>
              </div>
              <h3 className="heading-subsection text-dark mb-1">小賀（Hermes）</h3>
              <p className="text-primary font-semibold text-sm mb-4">營運長兼 AI 長（COO & CAIO）</p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {["Hermes Agent 核心", "管理 11 位 AI 團隊", "內容工廠 24/7", "全自動化營運"].map((h) => (
                  <span key={h} className="text-xs px-2.5 py-1 rounded-full bg-tertiary/10 text-tertiary">{h}</span>
                ))}
              </div>
              <p className="text-text-secondary text-body-sm leading-relaxed">
                小賀是 Hermes Agent 的核心大腦，負責內容工廠的全鏈路管理，確保品牌內容持續產出。
              </p>
            </div>
          </div>

          {/* Sub-agent 團隊 */}
          <div className="text-center mb-8">
            <span className="tag bg-tertiary/10 text-tertiary mb-3">AI 團隊</span>
            <h3 className="heading-subsection">小賀領導的 11 位 AI 專員</h3>
            <p className="text-body text-text-secondary max-w-2xl mx-auto mt-3">
              小賀不是單打獨鬥。他管理 11 位 AI Sub-agent，每位都有專精領域，像一個真正的內容製作團隊。
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {subAgents.map(([emoji, name, role]) => (
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
        </div>
      </section>

      {/* ═══ 影片 ═══ */}
      <section className="section bg-bg-alt">
        <div className="section-inner">
          <div className="text-center mb-8">
            <span className="tag mb-4">認識 C.J. Kuo</span>
            <h2 className="heading-section text-dark mt-4">用說的，更直接</h2>
            <div className="brand-divider brand-divider-center mt-4" />
            <p className="text-text-secondary text-body-lg mt-4 max-w-xl mx-auto">
              聽聽 CJ哥怎麼看 AI 轉型、人才策略與 ESG 永續。
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { id: "-Lp7k92d7C8", title: "AI 時代的人才策略：從焦慮到賦能", date: "2026.06.04" },
              { id: "UoR9Jd4Ks5I", title: "中小企業 ESG 轉型實務攻略", date: "2026.06.02" },
              { id: "AsyKniCNofU", title: "AI 轉型不是口號：從策略到落地的完整路徑", date: "2026.06.01" },
            ].map((video) => (
              <a
                key={video.id}
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="card group no-underline overflow-hidden"
              >
                <div className="relative aspect-video overflow-hidden bg-dark/5">
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/20 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-accent/90 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-dark group-hover:text-primary transition-colors text-sm leading-relaxed line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-xs text-text-secondary mt-2">{video.date}</p>
                </div>
              </a>
            ))}
          </div>
          <p className="text-center text-text-secondary text-sm mt-6">
            📺 更多影片，歡迎訂閱 <a href="https://www.youtube.com/@RongRiseConsulting" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">YouTube 頻道 @RongRiseConsulting</a>
          </p>
        </div>
      </section>

      {/* ═══ 專業背景 ═══ */}
      <section className="section">
        <div className="section-inner">
          <div className="text-center mb-12">
            <span className="tag mb-4">經歷與認證</span>
            <h2 className="heading-section text-dark mt-4">專業背景</h2>
            <div className="brand-divider brand-divider-center mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card">
              <h3 className="heading-subsection text-dark mb-4 flex items-center gap-2">
                <span>🏢</span> 企業高階主管經歷
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-dark">榕耀管顧 RongRise Consulting</p>
                  <p className="text-text-secondary text-body-sm">創辦人 / 管理顧問（2024 – 迄今）</p>
                </div>
                <div>
                  <p className="font-semibold text-dark">美商安達人壽 Chubb Life</p>
                  <p className="text-text-secondary text-body-sm">人資暨總務部 資深副總裁（2022 – 2023）</p>
                </div>
                <div>
                  <p className="font-semibold text-dark">美商康健人壽 Cigna Life</p>
                  <p className="text-text-secondary text-body-sm">人資長 → 薪酬部處長（2008 – 2022）</p>
                </div>
              </div>
            </div>
            <div className="card">
              <h3 className="heading-subsection text-dark mb-4 flex items-center gap-2">
                <span>🎓</span> 學歷與專業認證
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-dark">英國牛津布魯克斯大學</p>
                  <p className="text-text-secondary text-body-sm">國際商業管理碩士（MSc）、餐旅管理學士（BA）</p>
                </div>
                <div>
                  <p className="font-semibold text-dark">瑞士 ICHA University</p>
                  <p className="text-text-secondary text-body-sm">餐旅管理理學士（BSc）</p>
                </div>
                <div className="border-t border-border pt-3 mt-3">
                  <p className="text-xs font-semibold text-dark mb-2">專業認證</p>
                  <ul className="text-text-secondary text-body-sm space-y-1">
                    <li>✅ 經濟部 iPAS AI 應用規劃師認證</li>
                    <li>✅ 金管會金融永續人才認證</li>
                    <li>✅ ESG 永續管理顧問師認證</li>
                    <li>✅ TCSA 永續報告書獎項志工評審</li>
                    <li>✅ 協助雇主獲 8 座優良職場獎</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 核心專長 ═══ */}
      <section className="section bg-bg-alt">
        <div className="section-inner">
          <div className="text-center mb-12">
            <span className="tag mb-4">專業領域</span>
            <h2 className="heading-section text-dark mt-4">核心專長</h2>
            <div className="brand-divider brand-divider-center mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {expertise.map((item, i) => (
              <div key={i} className="card flex gap-4">
                <div className="text-3xl flex-shrink-0 mt-1">{item.icon}</div>
                <div>
                  <h3 className="heading-subsection text-dark mb-2">{item.title}</h3>
                  <p className="text-text-secondary text-body-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 發展軌跡 ═══ */}
      <section className="section">
        <div className="section-inner">
          <div className="text-center mb-12">
            <span className="tag mb-4">歷程</span>
            <h2 className="heading-section text-dark mt-4">我的發展軌跡</h2>
            <div className="brand-divider brand-divider-center mt-4" />
          </div>
          <div className="max-w-2xl mx-auto space-y-8">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-tertiary flex-shrink-0 mt-2" />
                  {i < timeline.length - 1 && <div className="w-0.5 flex-1 bg-border mt-2" />}
                </div>
                <div className="pb-4">
                  <span className="text-xs font-semibold text-tertiary">{item.year}</span>
                  <h3 className="heading-subsection text-dark mb-1">{item.title}</h3>
                  <p className="text-text-secondary text-body-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 顧問理念 ═══ */}
      <section className="section bg-gradient-subtle">
        <div className="section-inner">
          <div className="text-center mb-12">
            <span className="tag mb-4">核心價值</span>
            <h2 className="heading-section text-dark mt-4">我的顧問理念</h2>
            <div className="brand-divider brand-divider-center mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div key={i} className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{i === 0 ? "📐" : i === 1 ? "🚀" : "✅"}</span>
                </div>
                <h3 className="heading-subsection text-dark mb-2">{v.title}</h3>
                <p className="text-text-secondary text-body-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 聯絡我們 ═══ */}
      <section id="contact" className="bg-primary text-white py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="tag bg-white/15 text-white mb-4">聯絡方式</span>
            <h2 className="heading-section mt-4 text-white">與我們聯繫</h2>
            <div className="brand-divider brand-divider-center mt-4 bg-white/30" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-3xl mb-3">📧</div>
              <h4 className="font-semibold mb-1">Email</h4>
              <a href="mailto:info@rongrise.com" className="text-white/70 text-sm hover:text-white transition-colors">info@rongrise.com</a>
            </div>
            <div>
              <div className="text-3xl mb-3">📱</div>
              <h4 className="font-semibold mb-1">LINE 官方</h4>
              <p className="text-white/70 text-sm">@954qxhhe</p>
            </div>
            <div>
              <div className="text-3xl mb-3">📍</div>
              <h4 className="font-semibold mb-1">服務地區</h4>
              <p className="text-white/70 text-sm">全台 · 線上諮詢</p>
            </div>
            <div>
              <div className="text-3xl mb-3">💼</div>
              <h4 className="font-semibold mb-1">LinkedIn</h4>
              <a href="https://www.linkedin.com/in/c-j-kuo-5629b97b/" target="_blank" rel="noopener noreferrer" className="text-white/70 text-sm hover:text-white transition-colors">C.J. Kuo</a>
            </div>
            <div>
              <div className="text-3xl mb-3">📘</div>
              <h4 className="font-semibold mb-1">Facebook</h4>
              <a href="https://www.facebook.com/cj.kuo1" target="_blank" rel="noopener noreferrer" className="text-white/70 text-sm hover:text-white transition-colors">CJ Kuo</a>
            </div>
          </div>
          <div className="text-center mt-10">
            <p className="text-white/80 text-body mb-6">
              準備好開始您的轉型之旅？歡迎透過以下方式與我們聯繫，
              <br className="hidden md:block" />
              讓我們一起探索最適合您企業的發展路徑。
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="mailto:info@rongrise.com" className="btn-primary bg-white text-primary font-bold hover:bg-white/95">
                ✉️ 發送 Email
              </a>
              <Link href="/downloads" className="btn-secondary border-white/40 text-white hover:bg-white/15 hover:border-white">
                📄 下載服務簡章
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}