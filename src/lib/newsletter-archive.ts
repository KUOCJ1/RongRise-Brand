/* ============================================
   電子報歸檔：檢索與排序邏輯（純函數，可獨立測試）
   資料源：public/newsletter-archive.json（newsletter-archive-build.py 產生）
   2026-09-15 小賀開發（每週微型工具 B2-4）
   ============================================ */

export type ArchiveIssue = {
  id: string;
  slug: string;
  rawTitle: string;
  title: string;
  issueNo: number | null;
  issueLabel: string;
  date: string;
  week: string;
  theme: string;
  headline: string;
  summary: string;
  tags: string[];
  readingMinutes: number;
  newsCount: number;
  sourceCount: number;
  headings: string[];
  hasContent: boolean;
  searchText: string;
};

export type ArchiveTag = { name: string; count: number };

export type ArchiveData = {
  generatedAt: string;
  stats: {
    issues: number;
    withContent: number;
    firstDate: string;
    lastDate: string;
    spanDays: number;
    totalReadMinutes: number;
    newsItems: number;
    tagCount: number;
    tags: ArchiveTag[];
  };
  issues: ArchiveIssue[];
};

export type SearchHit = {
  issue: ArchiveIssue;
  hits: number;
  score: number;
  snippet: string;
  matchedFields: string[];
};

/** 標題正規化：去開頭 emoji 與後綴日期／週次（日期由列表日期區呈現） */
export function displayTitle(raw: string): string {
  return (raw || "")
    .replace(/^[^\u4e00-\u9fffA-Za-z0-9]+/, "")
    .split(/\s+[—–-]{1,2}\s+/)[0]
    .trim();
}

/** 靜態期數清單 → 檢索索引形狀（索引載入前的備援） */
export function issuesFromStaticList(
  list: { id: string; slug: string; title: string; date: string; week: string; summary: string }[]
): ArchiveIssue[] {
  return list
    .map((nl) => ({
      id: nl.id,
      slug: nl.slug,
      rawTitle: nl.title,
      title: displayTitle(nl.title),
      issueNo: null,
      issueLabel:
        (nl.title.match(/第\s*\d+\s*期/) || [""])[0] ||
        (/創刊號/.test(nl.title) ? "創刊號" : /試刊/.test(nl.title) ? "試刊" : ""),
      date: nl.date,
      week: nl.week,
      theme: "",
      headline: "",
      summary: nl.summary,
      tags: [] as string[],
      readingMinutes: 0,
      newsCount: 0,
      sourceCount: 0,
      headings: [] as string[],
      hasContent: false,
      searchText: `${nl.title} ${nl.summary}`,
    }))
    .sort(compareNewestFirst);
}

export function splitTokens(query: string): string[] {
  return query
    .trim()
    .split(/\s+/)
    .map((t) => t.toLowerCase())
    .filter(Boolean);
}

export function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** 排序比較：日期不同比日期、同日期一律以 slug 升冪（排序結果穩定且可預期） */
function compareSlug(a: { slug: string }, b: { slug: string }): number {
  if (a.slug === b.slug) return 0;
  return a.slug < b.slug ? -1 : 1;
}

/** 最新在前（同日期 slug 升冪） */
function compareNewestFirst(a: { date: string; slug: string }, b: { date: string; slug: string }): number {
  if (a.date !== b.date) return a.date > b.date ? -1 : 1;
  return compareSlug(a, b);
}

/** 最舊在前（同日期 slug 升冪） */
function compareOldestFirst(a: { date: string; slug: string }, b: { date: string; slug: string }): number {
  if (a.date !== b.date) return a.date < b.date ? -1 : 1;
  return compareSlug(a, b);
}

/** 由日期字串（YYYY-MM-DD）直接組出顯示值：不經 Date，避免時區造成日期位移與 hydration 不一致 */
export const MONTH_LABELS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

export function fmtDate(iso: string): { month: string; day: string; year: string } {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec((iso || "").trim());
  if (!m) return { month: "", day: "", year: "" };
  const monthIndex = Number(m[2]) - 1;
  return {
    month: MONTH_LABELS[monthIndex] || "",
    day: String(Number(m[3])),
    year: m[1],
  };
}

/** 解析 #tag= 分享片段（畸形百分號編碼不可讓整頁掛掉：DecodeError → 空字串） */
export function readTagHash(hash: string, prefix = "#tag="): string {
  let decoded = "";
  try {
    decoded = decodeURIComponent(hash || "");
  } catch {
    return "";
  }
  return decoded.startsWith(prefix) ? decoded.slice(prefix.length) : "";
}

const EMPTY: Omit<SearchHit, "issue"> = { hits: 0, score: 0, snippet: "", matchedFields: [] };

/** 取首個命中位置前後文，組成可讀片段 */
export function makeSnippet(issue: ArchiveIssue, token: string): string {
  const text = (issue.searchText || issue.summary || "").replace(/\s+/g, " ");
  const idx = text.toLowerCase().indexOf(token);
  if (idx === -1) return (issue.summary || "").slice(0, 120);
  const start = Math.max(0, idx - 60);
  const end = Math.min(text.length, idx + token.length + 90);
  return `${start > 0 ? "…" : ""}${text.slice(start, end)}${end < text.length ? "…" : ""}`;
}

/** 命中分析：多關鍵字需全部命中；回傳命中次數、相關度分數、片段與命中欄位 */
export function analyseIssue(issue: ArchiveIssue, tokens: string[]): Omit<SearchHit, "issue"> {
  if (!tokens.length) return { ...EMPTY };

  const haystacks: { field: string; text: string; weight: number }[] = [
    { field: "標題", text: `${issue.title} ${issue.issueLabel}`, weight: 4 },
    { field: "深讀主題", text: issue.headline, weight: 3 },
    { field: "摘要", text: issue.summary, weight: 2 },
    { field: "主題標籤", text: (issue.tags || []).join(" "), weight: 2 },
    { field: "章節", text: (issue.headings || []).join(" "), weight: 2 },
    { field: "內文", text: issue.searchText, weight: 1 },
  ];

  let hits = 0;
  let score = 0;
  const matchedFields: string[] = [];
  let snippet = "";

  for (const token of tokens) {
    let tokenHits = 0;
    let tokenMatched = false;
    for (const h of haystacks) {
      const lower = (h.text || "").toLowerCase();
      if (!lower) continue;
      let idx = lower.indexOf(token);
      let count = 0;
      while (idx !== -1) {
        count += 1;
        idx = lower.indexOf(token, idx + token.length);
      }
      if (count > 0) {
        tokenMatched = true;
        tokenHits += count;
        score += count * h.weight;
        if (!matchedFields.includes(h.field)) matchedFields.push(h.field);
      }
    }
    if (!tokenMatched) return { ...EMPTY };
    hits += tokenHits;
    if (!snippet) snippet = makeSnippet(issue, token);
  }

  return { hits, score, snippet, matchedFields };
}

export type SearchInput = {
  issues: ArchiveIssue[];
  query: string;
  activeTags: string[];
  sortAsc: boolean;
};

/** 檢索 + 標籤篩選 + 排序（有搜尋詞時依相關度排序） */
export function searchIssues({ issues, query, activeTags, sortAsc }: SearchInput): SearchHit[] {
  const tokens = splitTokens(query);
  const analysed: SearchHit[] = issues.map((issue) => ({ issue, ...analyseIssue(issue, tokens) }));

  const filtered = analysed.filter(({ issue, hits }) => {
    if (tokens.length && hits === 0) return false;
    if (activeTags.length && !activeTags.some((t) => (issue.tags || []).includes(t))) return false;
    return true;
  });

  filtered.sort((a, b) => {
    if (tokens.length && b.score !== a.score) return b.score - a.score;
    return sortAsc ? compareOldestFirst(a.issue, b.issue) : compareNewestFirst(a.issue, b.issue);
  });

  return filtered;
}

/** 依關鍵字把文字切成高亮片段（回傳純資料，交由畫面渲染） */
export function highlightSegments(text: string, tokens: string[]): { text: string; hit: boolean }[] {
  if (!tokens.length || !text) return [{ text, hit: false }];
  // 長 token 優先，避免重疊時短的先吃掉（例：['判斷','判斷力']）
  const ordered = tokens.slice().sort((a, b) => b.length - a.length);
  const re = new RegExp(`(${ordered.map(escapeRegExp).join("|")})`, "gi");
  return text.split(re).map((part) => ({ text: part, hit: tokens.includes(part.toLowerCase()) }));
}

/** 組 SEO 用結構化資料（ItemList，上限 30 筆，宣告數量與實際筆數保持一致） */
export function buildItemList(issues: ArchiveIssue[], siteUrl = "https://rong-rise.com") {
  const capped = issues.slice(0, 30);
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "榕賀觀點 AI 週報 全期數典藏",
    numberOfItems: capped.length,
    itemListElement: capped.map((i, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: `${i.title}${i.headline ? ` — ${i.headline}` : ""}`,
      url: `${siteUrl}/newsletter/${i.slug}`,
    })),
  };
}
