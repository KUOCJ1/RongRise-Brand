"use client";
import { useCallback, useEffect, useState } from "react";

export type Dashboard = {
  ts?: string;
  health?: "ok" | "warn" | "bad";
  issues?: { level: "warn" | "bad"; text: string }[];
  warnings?: string[];
  secondBrain?: { files?: string; recent7d?: string; uncommitted?: string; last?: string };
  services?: { name: string; label: string; port: number; code: string; state: "up" | "idle" | "down"; note?: string }[];
  vps?: {
    disk?: string;
    diskPct?: number;
    diskUsed?: string;
    diskTotal?: string;
    mem?: number;
    memUsed?: string;
    memTotal?: string;
    load?: string;
    uptime?: string;
  };
  newsletter?: {
    subscribers?: string;
    pending?: string[];
    lastSent?: { issue: string; at: string };
    nextGate?: string;
    nextGateIn?: string;
  };
  cron?: {
    total: number;
    enabled: number;
    failed: { name: string; id: string; last: string }[];
    next: { name: string; when: string }[];
  } | null;
  pm2?: { items: { name: string; restarts: number; status: string; memMb: number }[]; total: number };
};

/** 共用取數：30 秒自動更新，可手動刷新 */
export function useDashboard(intervalMs = 30000) {
  const [data, setData] = useState<Dashboard | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/dashboard", { cache: "no-store" });
      if (!r.ok) throw new Error(String(r.status));
      setData(await r.json());
      setErr("");
      setUpdatedAt(new Date());
    } catch {
      setErr("取不到資料：dashboard API 沒有回應");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, intervalMs);
    return () => clearInterval(t);
  }, [load, intervalMs]);

  return { data, err, loading, updatedAt, reload: load };
}

/** 空字串＝量測失敗，顯示「—」而不是 0 */
export const v = (x?: string | number | null) =>
  x === undefined || x === null || x === "" ? "—" : String(x);
