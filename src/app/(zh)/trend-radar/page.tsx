"use client";

import { useEffect, useMemo, useState } from "react";

/* ============================================
   AI 轉型趨勢雷達（Trend Radar）
   每週監測 12+ 來源、83+ 篇文章，追蹤企業 AI 轉型的熱門話題
   資料源：/trend-radar-data.json（每日知識掃描 digest 聚合，每週更新）
   2026-08-25 小賀開發（P1-4 微型工具）
   ============================================ */

type Article = {
  title: string;
  url: string;
  summary: string;
  date: string;
  category: string;
};

type Trend = {
  keyword: string;
  icon: string;
  category: string;
  count: number;
  prevCount: number;
  momentum: "up" | "down" | "flat" | "new";
};

type RadarData = {
  generatedAt: string;
  window: { from: string; to: string; days: number; digestCount: number };
  stats: { totalArticles: number; categories: Record<string, number> };
  trends: Trend[];
  articles: Article[];
  insights: string[];
};

const MOMENTUM_META: Record<Trend["momentum"], { label: string; cls: string; arrow: string }> = {
  up: { label: "升溫", cls: "bg-[#2EC4B6]/15 border-[#2EC4B6]/40 text-[#2EC4B6]", arrow: "↑" },
  down: { label: "降溫", cls: "bg-white/5 border-white/15 text-[#7CB8E8]", arrow: "↓" },
  flat: { label: "持平", cls: "bg-white/5 border-white/15 text-[#A0C4E8]", arrow: "→" },
  new: { label: "新話題", cls: "bg-[#E8912A]/15 border-[#E8912A]/40 text-[#E8912A]", arrow: "🆕" },
};

const CATEGORY_BADGES: Record<string, string> = {
  "AI 轉型": "🚀",
  "ESG 永續": "🌱",
  "人才策略": "🧠",
  "管理趨勢": "🏢",
  "𝕏 社群脈動": "𝕏",
};

export default function TrendRadarPage() {
  const [data, setData] = useState<RadarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCat, setActiveCat] = useState("全部");
  const [copied, setCopied] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    fetch("/trend-radar-data.json")
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
      .catch((e) => {
        if (!cancelled) {
          setError("趨勢資料暫時無法載入，請稍後再試。");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const copyText = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const categories = useMemo(() => {
    if (!data) return [];
    return ["全部", ...Object.keys(data.stats.categories)];
  }, [data]);

  const visibleArticles = useMemo(() => {
    if (!data) return [];
    if (activeCat === "全部") return data.articles;
    return data.articles.filter((a) => a.category === activeCat);
  }, [data, activeCat]);

  const maxCount = useMemo(() => (data ? Math.max(...data.trends.map((t) => t.count)) : 1), [data]);

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-gradient-to-b from-[#0D2B4E] via-[#0D2B4E] to-[#0A1F3A] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">📡</div>
          <p className="text-[#A0C4E8]">正在接收產業脈動…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[70vh] bg-gradient-to-b from-[#0D2B4E] via-[#0D2B4E] to-[#0A1F3A] text-white flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="text-4xl mb-4">📡</div>
          <p className="text-lg mb-2 font-semibold">訊號暫時中斷</p>
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

  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-[#0D2B4E] via-[#0D2B4E] to-[#0A1F3A] text-white">
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        {/* ===== Hero ===== */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#1A6DB5]/20 border border-[#2EC4B6]/30 rounded-full px-4 py-1.5 mb-6">
            <span className="text-sm text-[#2EC4B6] font-semibold">📡 每週更新 · 12+ 來源監測</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-5">
            AI 轉型<span className="text-[#E8912A]">趨勢雷達</span>
          </h1>
          <p className="text-lg md:text-xl text-[#A0C4E8] max-w-2xl mx-auto leading-relaxed">
            榕耀管顧每天掃描全球 12+ 個產業來源，為你彙整
            <strong className="text-white"> 企業 AI 轉型最熱的話題</strong>
            、每週發生的變化，以及值得關注的焦點文章。
          </p>
          {/* 數據列 */}
          <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mt-10">
            {[
              { v: String(data.stats.totalArticles), l: "本週監測文章" },
              { v: String(Object.keys(data.stats.categories).length), l: "追蹤主題分類" },
              { v: `${data.window.from.slice(5)} ~ ${data.window.to.slice(5)}`, l: "觀察窗口" },
            ].map((s) => (
              <div key={s.l} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-xl md:text-2xl font-black text-[#E8912A] mb-1">{s.v}</div>
                <div className="text-xs text-[#A0C4E8]">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== 熱門話題排行 ===== */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              🔥 本週熱門話題
              <span className="ml-3 text-sm font-normal text-[#A0C4E8]">依本週文章提及次數排行</span>
            </h2>
          </div>
          <div className="space-y-3">
            {data.trends.slice(0, 10).map((t, i) => {
              const mom = MOMENTUM_META[t.momentum];
              const pct = Math.max(8, Math.round((t.count / maxCount) * 100));
              return (
                <div key={t.keyword} className="bg-white/5 border border-white/10 rounded-xl px-5 py-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-black text-[#5A7A9E] w-6 text-right">{i + 1}</span>
                    <span className="text-xl">{t.icon}</span>
                    <span className="font-bold">{t.keyword}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#1A6DB5]/20 text-[#7CB8E8] border border-[#1A6DB5]/30">
                      {CATEGORY_BADGES[t.category] ?? ""} {t.category}
                    </span>
                    <span className={`ml-auto text-xs px-2.5 py-1 rounded-full border font-semibold whitespace-nowrap ${mom.cls}`}>
                      {mom.arrow} {mom.label}
                      <span className="ml-1 opacity-70">（上週 {t.prevCount}）</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 pl-9">
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#1A6DB5] to-[#2EC4B6]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-[#E8912A] w-14 text-right">×{t.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===== 本週焦點文章 ===== */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">📰 本週焦點文章</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCat(c)}
                className={`text-sm px-4 py-2 rounded-full border font-semibold transition-colors ${
                  activeCat === c
                    ? "bg-[#E8912A] border-[#E8912A] text-[#0D2B4E]"
                    : "bg-white/5 border-white/10 text-[#A0C4E8] hover:border-[#1A6DB5]"
                }`}
              >
                {c === "全部" ? "全部" : `${CATEGORY_BADGES[c] ?? ""} ${c}`}
                <span className="ml-1.5 opacity-70">
                  {c === "全部" ? data.articles.length : data.stats.categories[c] ?? 0}
                </span>
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {visibleArticles.slice(0, 12).map((a) => (
              <div key={a.url} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-[#1A6DB5]/60 transition-colors">
                <div className="flex items-center gap-2 mb-2 text-xs">
                  <span className="text-[#5A7A9E]">{a.date}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#1A6DB5]/20 text-[#7CB8E8] border border-[#1A6DB5]/30">
                    {CATEGORY_BADGES[a.category] ?? ""} {a.category}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold hover:text-[#2EC4B6] transition-colors leading-snug"
                  >
                    {a.title}
                  </a>
                  <button
                    onClick={() => copyText(a.url, a.url)}
                    className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-white/15 text-[#A0C4E8] hover:border-[#2EC4B6] hover:text-[#2EC4B6] transition-colors whitespace-nowrap"
                    aria-label="複製文章連結"
                  >
                    {copied === a.url ? "✓ 已複製" : "🔗 分享"}
                  </button>
                </div>
                {a.summary && <p className="mt-2 text-sm text-[#A0C4E8] leading-relaxed">{a.summary}</p>}
              </div>
            ))}
          </div>
          {visibleArticles.length > 12 && (
            <p className="text-center text-xs text-[#5A7A9E] mt-4">
              顯示前 12 篇，完整 {visibleArticles.length} 篇見每日知識掃描。
            </p>
          )}
        </section>

        {/* ===== 趨勢觀察 ===== */}
        {data.insights.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">🧭 趨勢觀察</h2>
            <div className="space-y-4">
              {data.insights.map((ins, i) => (
                <div key={i} className="bg-[#1A6DB5]/10 border border-[#1A6DB5]/30 rounded-xl p-5">
                  <p className="text-sm md:text-base text-[#D6E8F8] leading-relaxed">{ins}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===== 方法說明 ===== */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-10">
          <p className="text-xs text-[#A0C4E8] leading-relaxed">
            <strong className="text-white">資料方法：</strong>
            本雷達每週聚合榕耀管顧每日知識掃描（12+ 國際與台灣來源：HBR、MIT Technology Review、McKinsey、BCG、
            TechCrunch、Wired、科技新報、iThome、經理人 等）的最近 {data.window.days} 天內容，
            以關鍵字統計文章提及次數形成話題排行；「升溫／降溫」與前一週比較。
            排行反映報導熱度，不構成投資或導入建議。最後更新：{fmtDate(data.generatedAt)}。
          </p>
        </div>

        {/* ===== CTA ===== */}
        <div className="text-center">
          <h3 className="text-xl md:text-2xl font-bold mb-3">讓趨勢雷達每週自動送到你信箱</h3>
          <p className="text-[#A0C4E8] mb-6 max-w-xl mx-auto">
            訂閱《榕賀觀點》電子報，每週一收到完整分析——從熱門話題到趨勢觀察，一次讀懂企業 AI 轉型。
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
