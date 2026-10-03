"use client";

import { useEffect, useState } from "react";

/* ============================================
   內容引擎戰情室（Content Ops Dashboard）
   小哈內容引擎的營運數據彙整頁：知識掃描、官網文章、
   電子報、YouTube、競對監測、訂閱數——每日自動更新。
   資料源：/content-ops-data.json（content-ops-build.py 聚合）
   2026-08-25 小賀開發（P1-5 微型工具）
   ============================================ */

type LatestArticle = { title: string; date: string; url: string } | null;
type LatestVideo = { title: string; date: string; url: string } | null;

type OpsData = {
  generatedAt: string;
  engine: { name: string; startDate: string; daysRunning: number };
  stats: {
    scanDays: number;
    weekArticles: number;
    articles: number;
    newsItems: number;
    newsletterIssues: number;
    subscribers: number;
    confirmedSubscribers: number;
    videos: number;
    views: number;
    channelSubscribers: number;
    insights: number;
    socialPosts: number;
    igCards: number;
    competitorReports: number;
  };
  activity: { date: string; count: number; topics: string[] }[];
  latest: {
    article: LatestArticle;
    newsletter: string;
    video: LatestVideo;
    insight: string | null;
  };
  trends: { keyword: string; icon: string; count: number; momentum: string }[];
};

const MOMENTUM_META: Record<string, { label: string; cls: string; arrow: string }> = {
  up: { label: "升溫", cls: "bg-[#2EC4B6]/15 border-[#2EC4B6]/40 text-[#2EC4B6]", arrow: "↑" },
  down: { label: "降溫", cls: "bg-white/5 border-white/15 text-[#7CB8E8]", arrow: "↓" },
  flat: { label: "持平", cls: "bg-white/5 border-white/15 text-[#A0C4E8]", arrow: "→" },
  new: { label: "新話題", cls: "bg-[#E8912A]/15 border-[#E8912A]/40 text-[#E8912A]", arrow: "🆕" },
};

const PIPELINE = [
  {
    icon: "🛰️",
    step: "01",
    title: "每日知識掃描",
    desc: "12+ 國際與台灣產業來源（HBR、MIT TR、McKinsey、BCG、科技新報、iThome、經理人等）每天自動收錄，風雨無阻。",
  },
  {
    icon: "🧠",
    step: "02",
    title: "趨勢分析",
    desc: "每週從掃描結果萃取出五大趨勢、跨領域洞見與話題排行，成為內容選題的決策依據。",
  },
  {
    icon: "🏭",
    step: "03",
    title: "內容產出",
    desc: "知識庫文章、YouTube 影片、IG 圖卡、社群貼文與《榕賀觀點》電子報（每週一、四出刊）全自動生產。",
  },
  {
    icon: "📈",
    step: "04",
    title: "數據回饋",
    desc: "訂閱數、觀看數、競對監測報告彙整回戰情室，讓內容引擎持續自我優化。",
  },
];

export default function ContentOpsPage() {
  const [data, setData] = useState<OpsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/content-ops-data.json")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => {
        if (!cancelled) {
          setData(d);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("營運數據暫時無法載入，請稍後再試。");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-gradient-to-b from-[#0D2B4E] via-[#0D2B4E] to-[#0A1F3A] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🦞</div>
          <p className="text-[#A0C4E8]">正在彙整營運數據…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[70vh] bg-gradient-to-b from-[#0D2B4E] via-[#0D2B4E] to-[#0A1F3A] text-white flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="text-4xl mb-4">🦞</div>
          <p className="text-lg mb-2 font-semibold">戰情室暫時離線</p>
          <p className="text-sm text-[#A0C4E8] mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#E8912A] hover:bg-[#F0A040] text-[#0D2B4E] font-bold px-6 py-3 rounded-full transition-colors"
          >
            重新載入
          </button>
        </div>
      </div>
    );
  }

  const s = data.stats;
  const fmt = (n: number) => n.toLocaleString("zh-TW");
  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  const maxCount = Math.max(1, ...data.activity.map((a) => a.count));

  const coreCards = [
    { icon: "🗞️", value: fmt(s.scanDays), label: "知識掃描天數", sub: `自 ${(data.engine.startDate || "").slice(5).replace("-", "/")} 起` },
    { icon: "📰", value: fmt(s.weekArticles), label: "本週掃描文章", sub: "近 7 天精選收錄" },
    { icon: "📚", value: fmt(s.articles), label: "官網知識庫文章", sub: "第一人稱顧問觀點" },
    { icon: "📬", value: fmt(s.newsletterIssues), label: "電子報期數", sub: "《榕賀觀點》週一/四出刊" },
    { icon: "👥", value: fmt(s.subscribers), label: "訂閱者", sub: `${s.confirmedSubscribers} 位已確認` },
    { icon: "🎬", value: fmt(s.videos), label: "YouTube 影片", sub: `累計 ${fmt(s.views)} 次觀看` },
  ];

  const assetCards = [
    { icon: "🧭", value: fmt(s.insights), label: "週趨勢分析" },
    { icon: "🔭", value: fmt(s.competitorReports), label: "競對監測報告" },
    { icon: "💬", value: fmt(s.socialPosts), label: "社群貼文" },
    { icon: "🖼️", value: fmt(s.igCards), label: "IG 圖卡系列" },
  ];

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-[#0D2B4E] via-[#0D2B4E] to-[#0A1F3A] text-white">
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        {/* ===== Hero ===== */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#1A6DB5]/20 border border-[#2EC4B6]/30 rounded-full px-4 py-1.5 mb-6">
            <span className="text-sm text-[#2EC4B6] font-semibold">🦞 每日自動更新 · 內容引擎戰情室</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-5">
            一台<span className="text-[#E8912A]">每天自己運作</span>的內容引擎
          </h1>
          <p className="text-lg md:text-xl text-[#A0C4E8] max-w-2xl mx-auto leading-relaxed">
            「{data.engine.name}」已連續運作{" "}
            <strong className="text-[#E8912A]">{data.engine.daysRunning} 天</strong>
            ，自動完成產業掃描、趨勢分析、內容產出與數據回饋——這是它的公開戰情室。
          </p>
          {/* 數據列 */}
          <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mt-10">
            {[
              { v: `${data.engine.daysRunning}`, l: "引擎上線天數" },
              { v: fmt(s.scanDays), l: "累計掃描天數" },
              { v: fmt(s.weekArticles), l: "本週監測文章" },
            ].map((st) => (
              <div key={st.l} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-xl md:text-2xl font-black text-[#E8912A] mb-1">{st.v}</div>
                <div className="text-xs text-[#A0C4E8]">{st.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== 核心產能 ===== */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">⚙️ 核心產能</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {coreCards.map((c) => (
              <div key={c.label} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-[#1A6DB5]/60 transition-colors">
                <div className="text-2xl mb-2">{c.icon}</div>
                <div className="text-2xl md:text-3xl font-black text-white mb-1">{c.value}</div>
                <div className="text-sm font-semibold text-[#A0C4E8]">{c.label}</div>
                <div className="text-xs text-[#5A7A9E] mt-1">{c.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== 近 7 天營運脈動 ===== */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">📈 近 7 天營運脈動</h2>
          <p className="text-sm text-[#A0C4E8] mb-6">每日知識掃描收錄的文章數（本週 7 天全勤）</p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-end justify-between gap-2 md:gap-4 h-44">
              {data.activity.map((a) => (
                <div key={a.date} className="flex-1 flex flex-col items-center justify-end h-full gap-2">
                  <span className="text-xs font-bold text-[#E8912A]">{a.count}</span>
                  <div
                    className="w-full max-w-[52px] rounded-t-lg bg-gradient-to-t from-[#1A6DB5] to-[#2EC4B6]"
                    style={{ height: `${Math.max(8, Math.round((a.count / maxCount) * 100))}%` }}
                  />
                  <span className="text-[10px] md:text-xs text-[#5A7A9E]">{a.date.slice(5)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 本週話題（跨工具） ===== */}
        {data.trends.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold">🔥 本週熱門話題</h2>
              <a href="/trend-radar" className="text-sm text-[#2EC4B6] hover:text-white transition-colors">
                完整趨勢雷達 →
              </a>
            </div>
            <div className="space-y-2">
              {data.trends.map((t, i) => {
                const mom = MOMENTUM_META[t.momentum] ?? MOMENTUM_META.flat;
                return (
                  <div key={t.keyword} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                    <span className="text-xs font-black text-[#5A7A9E] w-5 text-right">{i + 1}</span>
                    <span className="text-lg">{t.icon}</span>
                    <span className="font-bold flex-1">{t.keyword}</span>
                    <span className="text-sm font-bold text-[#E8912A]">×{t.count}</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold whitespace-nowrap ${mom.cls}`}>
                      {mom.arrow} {mom.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ===== 內容資產庫 + 最新產出 ===== */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">📦 內容資產庫</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {assetCards.map((c) => (
              <div key={c.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-xl font-black text-white">{c.value}</div>
                <div className="text-xs text-[#A0C4E8] mt-1">
                  {c.icon} {c.label}
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-bold text-[#A0C4E8] mb-4">最新產出</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.latest.article && (
              <a href={data.latest.article.url} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-[#2EC4B6]/50 transition-colors block">
                <div className="text-xs text-[#5A7A9E] mb-2">📚 最新文章 · {data.latest.article.date}</div>
                <div className="font-bold leading-snug hover:text-[#2EC4B6] transition-colors">{data.latest.article.title}</div>
              </a>
            )}
            <a href="/newsletter" className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-[#2EC4B6]/50 transition-colors block">
              <div className="text-xs text-[#5A7A9E] mb-2">📬 最新電子報</div>
              <div className="font-bold leading-snug hover:text-[#2EC4B6] transition-colors">{data.latest.newsletter || "《榕賀觀點》"}</div>
            </a>
            {data.latest.video && (
              <a href={data.latest.video.url} target="_blank" rel="noopener noreferrer" className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-[#2EC4B6]/50 transition-colors block">
                <div className="text-xs text-[#5A7A9E] mb-2">🎬 最新影片 · {data.latest.video.date}</div>
                <div className="font-bold leading-snug hover:text-[#2EC4B6] transition-colors">{data.latest.video.title}</div>
              </a>
            )}
            {data.latest.insight && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="text-xs text-[#5A7A9E] mb-2">🧭 最新週趨勢分析</div>
                <div className="font-bold leading-snug">{data.latest.insight}</div>
              </div>
            )}
          </div>
        </section>

        {/* ===== 營運方法 ===== */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">🔧 它怎麼運作</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PIPELINE.map((p) => (
              <div key={p.step} className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{p.icon}</span>
                  <div>
                    <div className="text-xs text-[#5A7A9E]">STEP {p.step}</div>
                    <div className="font-bold">{p.title}</div>
                  </div>
                </div>
                <p className="text-sm text-[#A0C4E8] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== 方法說明 ===== */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-10">
          <p className="text-xs text-[#A0C4E8] leading-relaxed">
            <strong className="text-white">資料方法：</strong>
            本頁數據由榕耀管顧「小哈內容引擎」自動彙整，每日更新。數字直接來自內容引擎的產出記錄（知識掃描、文章、電子報、競對監測）、
            YouTube 頻道公開統計與電子報訂閱資料庫。訂閱數與影片數據為真實統計，非估算值。最後更新：
            {fmtDate(data.generatedAt)}。
          </p>
        </div>

        {/* ===== CTA ===== */}
        <div className="text-center">
          <h3 className="text-xl md:text-2xl font-bold mb-3">想看引擎每天產出什麼？</h3>
          <p className="text-[#A0C4E8] mb-6 max-w-xl mx-auto">
            訂閱《榕賀觀點》電子報，每週一、四自動收到趨勢分析與獨家觀點——你也能擁有自己的 AI 內容引擎。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/newsletter"
              className="inline-block bg-[#E8912A] hover:bg-[#F0A040] text-[#0D2B4E] font-bold text-lg px-8 py-4 rounded-full transition-colors shadow-lg shadow-[#E8912A]/20"
            >
              訂閱電子報 →
            </a>
            <a
              href="/about/#contact"
              className="inline-block bg-[#1A6DB5]/20 border border-[#2EC4B6]/50 text-[#2EC4B6] hover:bg-[#1A6DB5]/40 font-bold text-lg px-8 py-4 rounded-full transition-colors"
            >
              預約免費諮詢 →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
