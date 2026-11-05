"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { PageHeader } from "../components/ui";

type Result = {
  source: "brain" | "newsletter";
  title: string;
  path: string;
  snippet?: string;
  url?: string;
};

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [counts, setCounts] = useState({ brain: 0, newsletter: 0 });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [searched, setSearched] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setResults([]);
      setSearched("");
      return;
    }
    setErr("");
    setLoading(true);
    try {
      const r = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { cache: "no-store" });
      if (!r.ok) throw new Error(String(r.status));
      const d = await r.json();
      setResults(d.results ?? []);
      setCounts(d.counts ?? { brain: 0, newsletter: 0 });
      setSearched(query.trim());
    } catch {
      setErr("搜尋失敗：API 沒有回應");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 停止輸入 350ms 後自動搜尋，不用每次按 Enter
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => doSearch(q), 350);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [q, doSearch]);

  return (
    <div>
      <PageHeader title="跨來源搜尋" sub="第二大腦筆記＋電子報全文，邊打邊搜" />

      <input
        className="search-box"
        placeholder="輸入關鍵字，例如：AI 治理、授權、ESG…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoFocus
      />

      {err && <div className="error-box">{err}</div>}
      {loading && <div className="loading">搜尋中…</div>}

      {!loading && searched && (
        <p className="page-sub">
          「{searched}」共 {results.length} 筆：第二大腦 {counts.brain} 篇、電子報 {counts.newsletter} 期
        </p>
      )}

      {!loading && !searched && !err && (
        <div className="panel">
          <p className="page-sub" style={{ marginBottom: 0 }}>
            輸入至少 2 個字就開始搜尋。結果會標出來源與命中片段，電子報可點回官網閱讀。
          </p>
        </div>
      )}

      {results.map((r, i) => (
        <div className="result-item" key={`${r.source}-${r.path}-${i}`}>
          <div className="src">
            <Search size={12} style={{ verticalAlign: -1 }} />{" "}
            {r.source === "brain" ? "第二大腦" : "電子報"}
          </div>
          <div className="result-title">{r.title}</div>
          {r.snippet && <div className="result-snippet">{r.snippet}</div>}
          <div className="path">
            {r.url ? (
              <a href={r.url} target="_blank" rel="noreferrer">
                {r.path} <ExternalLink size={11} style={{ verticalAlign: -1 }} />
              </a>
            ) : (
              r.path
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
