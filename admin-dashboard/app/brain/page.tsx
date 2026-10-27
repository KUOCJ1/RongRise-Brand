"use client";
import { useEffect, useState } from "react";
import { Brain } from "lucide-react";

type BrainData = {
  files?: string;
  recent7d?: string;
  uncommitted?: string;
};

type ApiData = { secondBrain?: BrainData; warnings?: string[] };

export default function BrainPage() {
  const [data, setData] = useState<BrainData | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  // 空字串代表量測失敗，要顯示「—」而不是留白（2026-10-27 修）
  const v = (x?: string) => (x === undefined || x === null || x === "" ? "—" : x);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d: ApiData) => {
        setData(d.secondBrain ?? {});
        setWarnings(d.warnings ?? []);
      })
      .catch(() => setData({}));
  }, []);

  return (
    <div>
      <h1 className="page-title">第二大腦監控</h1>
      <p className="page-sub">VPS 端知識庫（git clone）狀態</p>

      {warnings.length > 0 && (
        <div className="error-box" style={{ marginBottom: 16 }}>
          量測失敗：{warnings.join("、")}（顯示為 — 的數字代表取不到，不是 0）
        </div>
      )}

      <div className="grid">
        <div className="card">
          <div className="label"><Brain size={14} /> 筆記總數</div>
          <div className="value">{v(data?.files)}</div>
        </div>
        <div className="card">
          <div className="label">7 天內更新</div>
          <div className="value">{v(data?.recent7d)}<small> 次 commit</small></div>
        </div>
        <div className="card">
          <div className="label">未提交變更</div>
          <div className="value">{v(data?.uncommitted)}<small> 個檔案</small></div>
        </div>
      </div>

      <div className="panel">
        <h3>說明</h3>
        <p className="page-sub" style={{ marginBottom: 0 }}>
          知識庫原始位置在 Hermes 容器（/opt/data/second-brain），VPS 端為每日 06:35 的 Cognee 增量同步用 git clone。
          未提交變更若持續累積，需在容器端執行 commit + push。
        </p>
      </div>
    </div>
  );
}
