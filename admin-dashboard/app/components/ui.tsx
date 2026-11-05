"use client";
import { AlertTriangle, CheckCircle2, Info, RefreshCw, XCircle } from "lucide-react";
import type { ReactNode } from "react";

/** 頁首：標題 + 更新時間 + 手動刷新 */
export function PageHeader({
  title,
  sub,
  updatedAt,
  onRefresh,
  loading,
}: {
  title: string;
  sub?: string;
  updatedAt?: Date | null;
  onRefresh?: () => void;
  loading?: boolean;
}) {
  return (
    <div className="page-head">
      <div>
        <h1 className="page-title">{title}</h1>
        {sub && <p className="page-sub">{sub}</p>}
      </div>
      {updatedAt && (
        <button className="refresh" onClick={onRefresh} title="重新取得資料">
          <RefreshCw size={14} className={loading ? "spin" : ""} />
          更新於 {updatedAt.toLocaleTimeString("zh-TW", { hour12: false })}
        </button>
      )}
    </div>
  );
}

/** KPI 卡：value 為 — 時整張卡轉灰，避免把「取不到」看成 0 */
export function Kpi({
  label,
  value,
  unit,
  hint,
  tone = "neutral",
  icon,
}: {
  label: string;
  value: string;
  unit?: string;
  hint?: ReactNode;
  tone?: "neutral" | "ok" | "warn" | "bad";
  icon?: ReactNode;
}) {
  const missing = value === "—";
  return (
    <div className={`card kpi tone-${missing ? "muted" : tone}`}>
      <div className="label">
        {icon}
        {label}
      </div>
      <div className="value">
        {value}
        {unit && <small> {unit}</small>}
      </div>
      {hint && <div className="hint">{hint}</div>}
    </div>
  );
}

/** 使用率長條：80% 起轉黃、85% 轉紅（與磁碟看門狗門檻一致） */
export function Meter({ pct }: { pct: number }) {
  const tone = pct >= 85 ? "bad" : pct >= 80 ? "warn" : "ok";
  return (
    <div className="bar-track">
      <div className={`bar-fill ${tone}`} style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
    </div>
  );
}

const SVC_LABEL = {
  up: { text: "正常", cls: "ok" },
  idle: { text: "存活", cls: "warn" },
  down: { text: "無回應", cls: "bad" },
} as const;

export function SvcPill({ state, code }: { state: "up" | "idle" | "down"; code: string }) {
  const l = SVC_LABEL[state];
  return (
    <span className={`badge ${l.cls}`} title={state === "idle" ? "有回應但根路徑非 2xx（API-only 服務屬正常）" : ""}>
      {l.text}
      <span className="badge-code">{code}</span>
    </span>
  );
}

/** 待處理清單：沒有問題時明說「沒有」，而不是留白 */
export function Issues({ issues }: { issues?: { level: "warn" | "bad" | "info"; text: string }[] }) {
  if (!issues) return null;
  const actionable = issues.filter((i) => i.level !== "info");
  if (actionable.length === 0 && issues.length > 0) {
    return (
      <div className="panel issues ok">
        {issues.map((i, k) => (
          <div key={k} className="issue-line info">
            <Info size={16} />
            <span>{i.text}</span>
          </div>
        ))}
      </div>
    );
  }
  if (issues.length === 0) {
    return (
      <div className="panel issues ok">
        <div className="issue-line">
          <CheckCircle2 size={16} /> 目前沒有需要注意的事項
        </div>
      </div>
    );
  }
  return (
    <div className="panel issues">
      <h3>需要注意</h3>
      {issues.map((i, k) => (
        <div key={k} className={`issue-line ${i.level}`}>
          {i.level === "bad" ? <XCircle size={16} /> : i.level === "info" ? <Info size={16} /> : <AlertTriangle size={16} />}
          <span>{i.text}</span>
        </div>
      ))}
    </div>
  );
}
