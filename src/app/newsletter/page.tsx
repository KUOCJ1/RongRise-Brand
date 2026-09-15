"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import staticNewsletters from "@/data/newsletters.json";
import {
  type ArchiveData,
  type ArchiveIssue,
  buildItemList,
  fmtDate,
  highlightSegments,
  issuesFromStaticList,
  readTagHash,
  searchIssues,
  splitTokens,
} from "@/lib/newsletter-archive";

/* ============================================
   電子報歸檔閱讀器（Newsletter Archive Explorer）
   《榕賀觀點》全期數瀏覽 + 主題標籤 + 全文檢索。
   資料源：/newsletter-archive.json（newsletter-archive-build.py 產生，每次出刊後更新）
   靜態期數清單（newsletters.json）作為備援，SSR 先渲染，載入索引後再增強。
   2026-09-15 小賀開發（每週微型工具 B2-4）
   ============================================ */

const STATIC_ISSUES: ArchiveIssue[] = issuesFromStaticList(
  staticNewsletters.newsletters as {
    id: string;
    slug: string;
    title: string;
    date: string;
    week: string;
    summary: string;
  }[]
);

const TAG_HASH_PREFIX = "#tag=";

/** 關鍵字高亮（React 節點，不使用 dangerouslySetInnerHTML） */
function Highlight({ text, tokens }: { text: string; tokens: string[] }) {
  const segments = highlightSegments(text, tokens);
  return (
    <>
      {segments.map((seg, i) =>
        seg.hit ? (
          <mark key={i} className="bg-[#E8912A]/25 text-text-primary font-semibold rounded px-0.5">
            {seg.text}
          </mark>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </>
  );
}

export default function NewsletterArchivePage() {
  const [archive, setArchive] = useState<ArchiveData | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [sortAsc, setSortAsc] = useState(false);
  const deferredQuery = useDeferredValue(query);

  /* 載入全文檢索索引（失敗時退回靜態清單，不影響瀏覽期數） */
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      // 舊瀏覽器沒有 AbortSignal.timeout → 用 AbortController + setTimeout，
      // 任何環境都不讓 fetch 懸置，也不讓計時器 API 的缺失把頁面弄掛
      const controller = typeof AbortController === "function" ? new AbortController() : null;
      const timer = controller ? setTimeout(() => controller.abort(), 10000) : null;
      try {
        const res = await fetch("/newsletter-archive.json", controller ? { signal: controller.signal } : undefined);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const d: ArchiveData = await res.json();
        if (cancelled) return;
        if (Array.isArray(d?.issues) && d.issues.length > 0) {
          setArchive(d);
        } else {
          setLoadFailed(true); // 索引內容不合法 → 視為失敗，不要一直顯示載入中
        }
      } catch {
        if (!cancelled) setLoadFailed(true);
      } finally {
        if (timer) clearTimeout(timer);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  /* 支援分享的標籤連結（#tag=主題）：初載套用 + 後續 hash 變更同步 */
  useEffect(() => {
    const apply = () => {
      const tag = readTagHash(window.location.hash || "");
      setActiveTags(tag ? [tag] : []);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  useEffect(() => {
    const current = window.location.hash || "";
    // 只管理 #tag= 片段，不動使用者帶進來的其他 fragment
    if (current && !current.startsWith(TAG_HASH_PREFIX)) return;
    const next = activeTags.length ? `${TAG_HASH_PREFIX}${encodeURIComponent(activeTags[0])}` : "";
    if (current === next) return;
    try {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${next}`);
    } catch {
      /* 略過：無法改寫網址不影響瀏覽 */
    }
  }, [activeTags]);

  const issues = archive?.issues ?? STATIC_ISSUES;
  const tagList = archive?.stats.tags ?? [];
  const tokens = useMemo(() => splitTokens(deferredQuery), [deferredQuery]);

  const results = useMemo(
    () => searchIssues({ issues, query: deferredQuery, activeTags, sortAsc }),
    [issues, deferredQuery, activeTags, sortAsc]
  );

  const filtering = tokens.length > 0 || activeTags.length > 0;
  const stats = archive?.stats;
  const totalIssues = stats?.issues ?? STATIC_ISSUES.length;
  const latestSlug = issues[0]?.slug;
  const ld = useMemo(() => buildItemList(issues), [issues]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const clearAll = () => {
    setQuery("");
    setActiveTags([]);
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }}
      />

      {/* ── Hero ── */}
      <section className="bg-gradient-hero text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <span className="tag bg-white/15 text-white mb-4">電子報典藏</span>
          <h1 className="heading-hero mt-4 mb-4">榕賀觀點 全期數典藏</h1>
          <p className="text-body-lg text-white/85 max-w-2xl">
            {totalIssues} 期《榕賀觀點》，每一則快訊、每一篇深讀都收在這一個頁面。
            不用往回翻信箱，直接搜尋主題或關鍵字，就找得到我們當時怎麼判斷。
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-10 max-w-3xl">
            {[
              { v: `${totalIssues} 期`, l: "上架期數" },
              { v: stats ? `${stats.spanDays} 天` : "—", l: "涵蓋期間" },
              { v: stats ? `${stats.newsItems} 則` : "—", l: "產業快訊" },
              { v: stats ? `${stats.tagCount} 種` : "—", l: "主題標籤" },
            ].map((s) => (
              <div key={s.l} className="bg-white/10 border border-white/15 rounded-xl px-4 py-3">
                <div className="text-xl md:text-2xl font-black text-[#F5B84A]">{s.v}</div>
                <div className="text-xs text-white/75 mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 檢索區 ── */}
      <section className="section pt-10 md:pt-12">
        <div className="section-inner">
          <div className="max-w-5xl mx-auto">
            <div className="bg-surface border border-border rounded-2xl p-5 md:p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="relative flex-1">
                  <label htmlFor="archive-search" className="sr-only">
                    搜尋電子報全文
                  </label>
                  <svg
                    className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
                  </svg>
                  <input
                    id="archive-search"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="搜尋主題或關鍵字，例如：判斷力、能源、試點、第 14 期"
                    className="w-full rounded-xl border border-border bg-bg pl-11 pr-10 py-3 text-body text-text-primary placeholder:text-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      aria-label="清除搜尋"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-border text-text-secondary hover:bg-primary hover:text-white transition-colors text-xs leading-none"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setSortAsc((v) => !v)}
                  className="shrink-0 rounded-xl border border-border px-4 py-3 text-body-sm text-text-primary hover:border-primary hover:text-primary transition-colors"
                  aria-label={`切換排序，目前為${sortAsc ? "最舊在前" : "最新在前"}`}
                >
                  {sortAsc ? "↑ 最舊在前" : "↓ 最新在前"}
                </button>
              </div>

              {tagList.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <span className="text-body-sm text-text-secondary mr-1">主題：</span>
                  <button
                    type="button"
                    onClick={() => setActiveTags([])}
                    aria-pressed={activeTags.length === 0}
                    className={`text-[13px] px-3 py-1.5 rounded-full border font-semibold transition-colors ${
                      activeTags.length === 0
                        ? "bg-primary text-white border-primary"
                        : "border-border text-text-secondary hover:border-primary hover:text-primary"
                    }`}
                  >
                    全部
                  </button>
                  {tagList.map((t) => (
                    <button
                      key={t.name}
                      type="button"
                      onClick={() => toggleTag(t.name)}
                      aria-pressed={activeTags.includes(t.name)}
                      className={`text-[13px] px-3 py-1.5 rounded-full border font-semibold transition-colors ${
                        activeTags.includes(t.name)
                          ? "bg-primary text-white border-primary"
                          : "border-border text-text-secondary hover:border-primary hover:text-primary"
                      }`}
                    >
                      {t.name}
                      <span className="ml-1 opacity-60" aria-hidden="true">
                        {t.count}
                      </span>
                      <span className="sr-only">（{t.count} 期）</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-border">
                <p className="text-body-sm text-text-secondary" role="status" aria-live="polite">
                  {!archive && !loadFailed && "正在載入全文檢索索引…"}
                  {!archive && loadFailed && "檢索索引暫時無法載入（仍可瀏覽全期清單）· "}
                  {filtering ? "符合條件 " : "共 "}
                  <strong className="text-primary">{results.length}</strong> 期
                  {tokens.length > 0 && <span className="ml-1">（依命中相關度排序）</span>}
                </p>
                {filtering && (
                  <button type="button" onClick={clearAll} className="text-body-sm text-tertiary hover:underline shrink-0">
                    清除條件
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── 期數列表 ── */}
          <div className="max-w-5xl mx-auto mt-8">
            {results.length === 0 ? (
              <div className="bg-gradient-subtle rounded-2xl p-10 text-center">
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="heading-subsection text-text-primary mb-2">找不到符合的期數</h3>
                <p className="text-body text-text-secondary mb-5">
                  試試更短或更通用的關鍵字，例如「治理」「成本」「人才」，或改用主題標籤瀏覽。
                </p>
                <button type="button" onClick={clearAll} className="btn-secondary">
                  清除搜尋條件
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {results.map(({ issue, hits, snippet, matchedFields }, idx) => {
                  const d = fmtDate(issue.date);
                  const isLatest = !filtering && idx === 0 && issue.slug === latestSlug;
                  return (
                    <Link
                      key={issue.slug || issue.id}
                      href={`/newsletter/${issue.slug}`}
                      className={`card block no-underline group ${isLatest ? "border-l-4 border-l-tertiary" : ""}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                        <div className="flex-shrink-0 text-center sm:min-w-[76px]">
                          <div className="text-[13px] text-text-secondary font-medium">{d.month}</div>
                          <div className="text-3xl font-bold text-primary leading-tight">{d.day}</div>
                          <div className="text-[13px] text-text-secondary">{d.year}</div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            {isLatest && (
                              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-tertiary text-white">
                                最新一期
                              </span>
                            )}
                            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold border border-border text-text-secondary">
                              {issue.week}
                            </span>
                            {issue.issueLabel && !issue.title.includes(issue.issueLabel) && (
                              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-primary/10 text-primary">
                                {issue.issueLabel}
                              </span>
                            )}
                            {issue.theme && (
                              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-accent/20 text-text-primary">
                                {issue.theme}
                              </span>
                            )}
                            {hits > 0 && (
                              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-[#2EC4B6]/25 text-text-primary">
                                命中 {hits} 處
                              </span>
                            )}
                          </div>

                          <h2 className="heading-subsection text-text-primary group-hover:text-primary transition-colors mb-1">
                            <Highlight text={issue.title} tokens={tokens} />
                          </h2>

                          {issue.headline && (
                            <p className="text-body text-primary font-semibold mb-2">
                              🔥 本期深讀：<Highlight text={issue.headline} tokens={tokens} />
                            </p>
                          )}

                          <p className="text-text-secondary text-body leading-relaxed">
                            <Highlight text={tokens.length > 0 && snippet ? snippet : issue.summary} tokens={tokens} />
                          </p>

                          {tokens.length > 0 && matchedFields.length > 0 && (
                            <p className="text-[13px] text-text-secondary mt-2">命中欄位：{matchedFields.join("、")}</p>
                          )}

                          <div className="mt-3 space-y-2">
                            {issue.tags.length > 0 && (
                              <div className="flex items-center gap-2 flex-wrap">
                                {issue.tags.map((t) => (
                                  <span
                                    key={t}
                                    className={`text-xs px-2.5 py-1 rounded-full border ${
                                      activeTags.includes(t)
                                        ? "bg-primary text-white border-primary"
                                        : "border-border text-text-secondary"
                                    }`}
                                  >
                                    #{t}
                                  </span>
                                ))}
                              </div>
                            )}
                            <div className="text-[13px] text-text-secondary">
                              {[
                                issue.readingMinutes > 0 ? `閱讀約 ${issue.readingMinutes} 分鐘` : "",
                                issue.newsCount > 0 ? `快訊 ${issue.newsCount} 則` : "",
                                issue.sourceCount > 0 ? `引用 ${issue.sourceCount} 個來源` : "",
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </div>
                          </div>
                        </div>

                        <div className="hidden sm:flex items-center flex-shrink-0 text-primary/40 group-hover:text-primary transition-colors self-center">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── 使用說明 ── */}
          <div className="max-w-5xl mx-auto mt-10 grid gap-4 md:grid-cols-2">
            <div className="card-feature">
              <h3 className="heading-subsection text-text-primary mb-2">怎麼用這個典藏庫</h3>
              <ul className="text-body text-text-secondary space-y-2 list-disc pl-5">
                <li>輸入關鍵字做全文檢索，範圍包含快訊、深讀、跨界數據與精選文章。</li>
                <li>按主題標籤瀏覽，例如「判斷力與認知」「能源與 ESG」，回看同一條主線怎麼演變。</li>
                <li>每期都是獨立文章頁，可直接把單期連結分享給同事或客戶。</li>
              </ul>
            </div>
            <div className="card-feature">
              <h3 className="heading-subsection text-text-primary mb-2">關於期數</h3>
              <ul className="text-body text-text-secondary space-y-2 list-disc pl-5">
                <li>《榕賀觀點》每週一、四出刊；未寄送或未核准的期數不上架，因此期數可能跳號。</li>
                <li>全文檢索索引於每次出刊後自動更新，內容與寄送版本一致。</li>
                <li>
                  {loadFailed
                    ? "目前檢索索引暫時無法載入，仍可瀏覽全部期數清單。"
                    : `索引範圍：${stats ? `${stats.withContent} 期完整內容` : "全部已上架期數"}。`}
                </li>
              </ul>
            </div>
          </div>

          {/* ── 訂閱 CTA ── */}
          <div className="text-center mt-12">
            <div className="bg-gradient-subtle rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="text-3xl mb-3">📬</div>
              <h3 className="heading-subsection text-text-primary mb-2">還沒訂閱？</h3>
              <p className="text-text-secondary text-body mb-4">
                每週一與週四，小賀直接把最新趨勢送到你的信箱，比典藏庫更早看到。
              </p>
              <Link href="/#newsletter" className="btn-primary">
                免費訂閱電子報
              </Link>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link href="/" className="btn-secondary">
              ← 返回首頁
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
