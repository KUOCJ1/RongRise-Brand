"use client";
import { useEffect, useState } from "react";
import { Brain } from "lucide-react";

type BrainData = {
  files?: string;
  recent7d?: string;
  uncommitted?: string;
};

export default function BrainPage() {
  const [data, setData] = useState<BrainData | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => setData(d.secondBrain))
      .catch(() => setData({}));
  }, []);

  return (
    <div>
      <h1 className="page-title">第二大腦監控</h1>
      <p className="page-sub">VPS 端知識庫（git clone）狀態</p>

      <div className="grid">
        <div className="card">
          <div className="label"><Brain size={14} /> 筆記總數</div>
          <div className="value">{data?.files ?? "—"}</div>
        </div>
        <div className="card">
          <div className="label">7 天內更新</div>
          <div className="value">{data?.recent7d ?? "—"}<small> 次 commit</small></div>
        </div>
        <div className="card">
          <div className="label">未提交變更</div>
          <div className="value">{data?.uncommitted ?? "—"}<small> 個檔案</small></div>
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
