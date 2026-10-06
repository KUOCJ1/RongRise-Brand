/* ============================================
   陪跑筆記案例庫 — 資料與篩選輔助函式
   2026-10-06 小賀開發（第三批 B3-2 微型工具）
   ============================================ */

import raw from "@/data/case-notes.json";

export interface CaseNote {
  id: string;
  type: string;
  filter: string;
  tags: string[];
  title: string;
  summary: string;
  situation: string;
  action: string;
  result: string;
  lesson: string;
  source: { label: string; href: string };
}

export interface CaseMeta {
  title: string;
  subtitle: string;
  description: string;
}

export interface FilterDef {
  key: string;
  label: string;
}

export const { meta, filters, cases } = raw as {
  meta: CaseMeta;
  filters: FilterDef[];
  cases: CaseNote[];
};

export function getCasesByFilter(filterKey: string): CaseNote[] {
  if (filterKey === "all") return cases;
  return cases.filter((c) => c.filter === filterKey);
}

export function searchCases(query: string, pool: CaseNote[] = cases): CaseNote[] {
  const q = query.trim().toLowerCase();
  if (!q) return pool;
  return pool.filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.summary.toLowerCase().includes(q) ||
      c.situation.toLowerCase().includes(q) ||
      c.lesson.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export function getFilterLabel(key: string): string {
  return filters.find((f) => f.key === key)?.label ?? "全部";
}
