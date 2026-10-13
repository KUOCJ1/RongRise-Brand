"use client";

import { useMemo, useState } from "react";

export interface AIFaqCard {
  id: string;
  category: string;
  question: string;
  shortAnswer: string;
  keyPoints: string[];
  source: {
    type: "article" | "newsletter" | "case-note";
    slug: string;
    title: string;
    href: string;
  };
  tags: string[];
  readiness: string;
  forRoles: string[];
}

export interface AIFaqData {
  meta: {
    title: string;
    subtitle: string;
    description: string;
    generatedAt: string;
  };
  categories: { key: string; name: string; count: number }[];
  cards: AIFaqCard[];
}

const brand = {
  primary: "#1A6DB5",
  deep: "#0D2B4E",
  teal: "#2EC4B6",
  amber: "#E8912A",
};

const readinessClass: Record<string, string> = {
  入門: "bg-teal/10 text-teal",
  實作: "bg-primary/10 text-primary",
  進階: "bg-tertiary/10 text-tertiary",
};

const sourceLabel: Record<string, string> = {
  article: "知識庫文章",
  newsletter: "電子報",
  "case-note": "陪跑案例",
};

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const q = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${q})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-amber/30 text-text-primary rounded px-0.5">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function FaqCard({
  card,
  query,
  isOpen,
  onToggle,
}: {
  card: AIFaqCard;
  query: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-md hover:border-primary/30 transition-all">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full text-left p-5 md:p-6 flex flex-col gap-3"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
            {card.category}
          </span>
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              readinessClass[card.readiness] || "bg-bg-alt text-text-secondary"
            }`}
          >
            {card.readiness}
          </span>
          {card.forRoles.map((role) => (
            <span
              key={role}
              className="text-xs font-medium px-2 py-0.5 rounded-full bg-bg-alt text-text-muted"
            >
              {role}
            </span>
          ))}
        </div>

        <h2 className="font-bold text-lg md:text-xl text-text-primary leading-snug pr-6 relative">
          {highlightMatch(card.question, query)}
          <span className="absolute right-0 top-1/2 -translate-y-1/2 text-primary transition-transform duration-200">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </h2>

        <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
          {highlightMatch(card.shortAnswer, query)}
        </p>
      </button>

      {isOpen && (
        <div className="px-5 md:px-6 pb-6 pt-0 border-t border-border">
          <div className="pt-5 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-text-primary mb-2">
                短答
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {card.shortAnswer}
              </p>
            </div>

            {card.keyPoints.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-text-primary mb-2">
                  關鍵重點
                </h3>
                <ul className="space-y-2">
                  {card.keyPoints.map((point, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-sm text-text-secondary"
                    >
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: brand.teal }}
                      />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {card.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-2 py-0.5 rounded-full bg-bg-alt text-text-muted"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <a
              href={card.source.href}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
            >
              閱讀原文：{card.source.title}
              <span className="text-xs text-text-muted">
                ({sourceLabel[card.source.type] || card.source.type})
              </span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" x2="21" y1="14" y2="3" />
              </svg>
            </a>
          </div>
        </div>
      )}
    </article>
  );
}

export default function AIFaqClient({ data }: { data: AIFaqData }) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const allRoles = useMemo(() => {
    const set = new Set<string>();
    data.cards.forEach((c) => c.forRoles.forEach((r) => set.add(r)));
    return Array.from(set).sort();
  }, [data.cards]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.cards.filter((c) => {
      const catOk =
        activeCategory === "all" || c.category === activeCategory;
      const roleOk = roleFilter === "all" || c.forRoles.includes(roleFilter);
      if (!q) return catOk && roleOk;
      const hit =
        c.question.toLowerCase().includes(q) ||
        c.shortAnswer.toLowerCase().includes(q) ||
        c.keyPoints.some((p) => p.toLowerCase().includes(q)) ||
        c.tags.some((t) => t.toLowerCase().includes(q));
      return catOk && roleOk && hit;
    });
  }, [data.cards, activeCategory, query, roleFilter]);

  const resultsId = "ai-faq-results";

  return (
    <main className="min-h-screen bg-bg-alt">
      {/* Hero */}
      <section
        className="relative overflow-hidden text-white"
        style={{
          background: `linear-gradient(135deg, ${brand.deep} 0%, #123A66 50%, ${brand.primary} 100%)`,
        }}
      >
        <div
          className="absolute -right-24 -top-24 w-96 h-96 rounded-full opacity-25 blur-3xl"
          style={{ backgroundColor: brand.teal }}
        />
        <div
          className="absolute -bottom-32 right-40 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: brand.amber }}
        />
        <div className="relative max-w-[1000px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <span
            className="inline-block text-sm font-bold tracking-[0.2em] border-2 rounded-full px-4 py-1.5 mb-6"
            style={{ color: brand.amber, borderColor: `${brand.amber}99` }}
          >
            AI FAQ · 知識卡
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-tight">
            {data.meta.title}
          </h1>
          <p className="mt-5 text-lg text-white/75 leading-relaxed max-w-2xl">
            {data.meta.subtitle}
          </p>
        </div>
      </section>

      {/* Search + Filters */}
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-10 md:py-12">
        <div className="flex flex-col gap-4">
          <div className="relative w-full md:w-[420px]">
            <input
              id="ai-faq-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜尋問題、關鍵字、角色..."
              aria-label="搜尋知識卡"
              aria-describedby={resultsId}
              className="w-full bg-white border border-border rounded-full pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
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

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              aria-pressed={activeCategory === "all"}
              className={`text-sm font-bold px-4 py-2 rounded-full border transition-colors ${
                activeCategory === "all"
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-text-secondary border-border hover:border-primary/40 hover:text-primary"
              }`}
            >
              全部 ({data.cards.length})
            </button>
            {data.categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                aria-pressed={activeCategory === cat.key}
                className={`text-sm font-bold px-4 py-2 rounded-full border transition-colors ${
                  activeCategory === cat.key
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-text-secondary border-border hover:border-primary/40 hover:text-primary"
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="self-center text-sm text-text-muted mr-1">
              適合角色：
            </span>
            <button
              onClick={() => setRoleFilter("all")}
              aria-pressed={roleFilter === "all"}
              className={`text-sm font-medium px-3 py-1.5 rounded-full border transition-colors ${
                roleFilter === "all"
                  ? "bg-deep text-white border-deep"
                  : "bg-white text-text-secondary border-border hover:border-primary/40 hover:text-primary"
              }`}
            >
              全部
            </button>
            {allRoles.map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                aria-pressed={roleFilter === role}
                className={`text-sm font-medium px-3 py-1.5 rounded-full border transition-colors ${
                  roleFilter === role
                    ? "bg-deep text-white border-deep"
                    : "bg-white text-text-secondary border-border hover:border-primary/40 hover:text-primary"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <p
          id={resultsId}
          className="text-sm text-text-muted mt-5"
          aria-live="polite"
          role="status"
        >
          {query
            ? `「${query}」篩選結果：${filtered.length} 張知識卡`
            : `當前類別：${
                activeCategory === "all"
                  ? "全部"
                  : data.categories.find((c) => c.key === activeCategory)?.name || activeCategory
              }${roleFilter !== "all" ? ` / ${roleFilter}` : ""}　共 ${filtered.length} 張`}
        </p>

        {/* FAQ list */}
        <div className="mt-8 grid gap-4" aria-describedby={resultsId}>
          {filtered.map((card) => (
            <FaqCard
              key={card.id}
              card={card}
              query={query}
              isOpen={openId === card.id}
              onToggle={() =>
                setOpenId((prev) => (prev === card.id ? null : card.id))
              }
            />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-border">
              <p className="text-text-secondary">
                沒有符合條件的知識卡，試試其他關鍵字、類別或角色。
              </p>
            </div>
          )}
        </div>

        {/* CTA */}
        <section
          className="mt-14 rounded-3xl p-10 md:p-14 text-white text-center relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${brand.deep} 0%, #123A66 50%, ${brand.primary} 100%)`,
          }}
        >
          <div
            className="absolute -left-20 -top-20 w-72 h-72 rounded-full opacity-20 blur-3xl"
            style={{ backgroundColor: brand.teal }}
          />
          <div className="relative">
            <h2 className="font-display text-2xl md:text-3xl font-extrabold">
              找不到你的問題？
            </h2>
            <p className="mt-4 text-white/75 leading-relaxed max-w-xl mx-auto">
              知識卡來自知識庫、電子報與陪跑案例，但每家公司的情境都不一樣。預約 30 分鐘免費諮詢，讓我們幫你找出最適合的下一步。
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
