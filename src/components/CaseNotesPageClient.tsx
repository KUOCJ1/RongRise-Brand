"use client";

import { useMemo, useState } from "react";
import { cases, filters, getCasesByFilter, searchCases, getFilterLabel, meta, type CaseNote } from "@/lib/case-notes";

const id = (prefix: string, value: string) => `${prefix}-${value}`;

const brand = {
  primary: "#1A6DB5",
  deep: "#0D2B4E",
  teal: "#2EC4B6",
  amber: "#E8912A",
};

function CaseCard({ c }: { c: CaseNote }) {
  return (
    <article className="bg-white rounded-2xl border border-border p-6 md:p-8 flex flex-col gap-4 hover:shadow-lg hover:border-primary/30 transition-all">
      <div className="flex flex-wrap gap-2">
        {c.tags.map((t) => (
          <span key={t} className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal/10 text-teal">
            {t}
          </span>
        ))}
      </div>
      <h2 className="font-bold text-xl md:text-[22px] text-text-primary leading-snug">{c.title}</h2>
      <p className="text-text-secondary leading-relaxed">{c.summary}</p>

      <div className="grid gap-4 mt-2">
        <div className="rounded-xl bg-bg-alt p-4">
          <h3 className="text-sm font-bold text-primary mb-1.5 flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
            情境
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">{c.situation}</p>
        </div>
        <div className="rounded-xl bg-bg-alt p-4">
          <h3 className="text-sm font-bold text-primary mb-1.5 flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
            做法
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">{c.action}</p>
        </div>
        <div className="rounded-xl bg-bg-alt p-4">
          <h3 className="text-sm font-bold text-primary mb-1.5 flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
            結果
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">{c.result}</p>
        </div>
      </div>

      <div className="rounded-xl border-l-4 border-tertiary bg-tertiary/5 p-4 mt-1">
        <h3 className="text-sm font-bold text-tertiary mb-1.5">
          學到的教訓
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed">{c.lesson}</p>
      </div>

      <div className="pt-2">
        <a
          href={c.source.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
        >
          {c.source.label}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" x2="21" y1="14" y2="3" />
          </svg>
        </a>
      </div>
    </article>
  );
}

export default function CaseNotesPageClient() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const byFilter = getCasesByFilter(activeFilter);
    return searchCases(query, byFilter);
  }, [activeFilter, query]);

  const searchId = id("case-search", "input");
  const resultsId = id("case-search", "results");

  return (
    <main className="min-h-screen bg-bg-alt">
      {/* Hero */}
      <section
        className="relative overflow-hidden text-white"
        style={{ background: `linear-gradient(135deg, ${brand.deep} 0%, #123A66 50%, ${brand.primary} 100%)` }}
      >
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full opacity-25 blur-3xl" style={{ backgroundColor: brand.teal }} />
        <div className="absolute -bottom-32 right-40 w-80 h-80 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: brand.amber }} />
        <div className="relative max-w-[1000px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <span
            className="inline-block text-sm font-bold tracking-[0.2em] border-2 rounded-full px-4 py-1.5 mb-6"
            style={{ color: brand.amber, borderColor: `${brand.amber}99` }}
          >
            FIELD NOTES · 陪跑筆記
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-tight">{meta.title}</h1>
          <p className="mt-5 text-lg text-white/75 leading-relaxed max-w-2xl">{meta.subtitle}</p>
        </div>
      </section>

      {/* Filter + Search */}
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-10 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => {
              const active = activeFilter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  aria-pressed={active}
                  className={`text-sm font-bold px-4 py-2 rounded-full border transition-colors ${
                    active
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-text-secondary border-border hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
          <div className="relative md:ml-auto md:w-72">
            <input
              id={searchId}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜尋案例..."
              aria-label="搜尋案例"
              aria-describedby={resultsId}
              className="w-full bg-white border border-border rounded-full pl-10 pr-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>

        <p id={resultsId} className="text-sm text-text-muted mt-4" aria-live="polite" role="status">
          {query ? `「${query}」篩選結果：` : `當前類別：${getFilterLabel(activeFilter)}`}
          {filtered.length} 則案例
        </p>

        {/* Case list */}
        <div className="mt-8 grid gap-6" aria-describedby={resultsId}>
          {filtered.map((c) => (
            <CaseCard key={c.id} c={c} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-border">
              <p className="text-text-secondary">沒有符合條件的案例，試試其他關鍵字或類別。</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <section
          className="mt-14 rounded-3xl p-10 md:p-14 text-white text-center relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${brand.deep} 0%, #123A66 50%, ${brand.primary} 100%)` }}
        >
          <div className="absolute -left-20 -top-20 w-72 h-72 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: brand.teal }} />
          <div className="relative">
            <h2 className="font-display text-2xl md:text-3xl font-extrabold">想把案例變成你的行動？</h2>
            <p className="mt-4 text-white/75 leading-relaxed max-w-xl mx-auto">
              每個教訓背後都是一次可以被避免的決策。預約 30 分鐘免費諮詢，我們一起找出你組織裡最相似的隱患。
            </p>
            <a
              href="/about/#contact"
              className="inline-block mt-8 text-white font-bold px-8 py-3.5 rounded-full transition-colors hover:opacity-90"
              style={{ backgroundColor: brand.amber }}
            >
              預約免費諮詢
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
