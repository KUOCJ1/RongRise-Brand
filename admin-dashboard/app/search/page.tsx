"use client";
import { useState } from "react";
import { Search } from "lucide-react";

type Result = { source: string; title: string; path: string };

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function doSearch() {
    const query = q.trim();
    if (query.length < 2) {
      setErr("請輸入至少 2 個字");
      return;
    }
    setErr("");
    setLoading(true);
    try {
      const r = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const d = await r.json();
      setResults(d.results ?? []);
    } catch {
      setErr("搜尋失敗");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="page-title">跨來源搜尋</h1>
      <p className="page-sub">第二大腦筆記 + 電子報標題全文搜尋</p>

      <input
        className="search-box"
        placeholder="輸入關鍵字，例如：AI 治理、ESG…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && doSearch()}
      />

      {err && <div className="error-box" style={{ marginBottom: 16 }}>{err}</div>}
      {loading && <div className="loading">搜尋中…</div>}

      {!loading && results.length === 0 && !err && (
        <div className="panel"><p className="page-sub" style={{ marginBottom: 0 }}>輸入關鍵字開始搜尋</p></div>
      )}

      {results.map((r, i) => (
        <div className="result-item" key={i}>
          <div className="src">
            <Search size={12} style={{ verticalAlign: -1 }} />{" "}
            {r.source === "brain" ? "第二大腦" : "電子報"}
          </div>
          <div style={{ fontWeight: 600, marginTop: 4 }}>{r.title}</div>
          <div className="path">{r.path}</div>
        </div>
      ))}
    </div>
  );
}
