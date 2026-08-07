"use client";
import { useEffect, useState } from "react";
import { LineChart } from "lucide-react";

type Pm2Entry = { name: string; restarts: number };

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  const pm2List: Pm2Entry[] = (data?.pm2 || "")
    .split(",")
    .filter(Boolean)
    .map((s: string) => {
      const [name, restarts] = s.split(":");
      return { name, restarts: Number(restarts) || 0 };
    });

  const badge = (n: number) =>
    n > 100 ? <span className="badge bad">{n} 次</span>
    : n > 10 ? <span className="badge warn">{n} 次</span>
    : <span className="badge ok">{n} 次</span>;

  return (
    <div>
      <h1 className="page-title">健康指標分析</h1>
      <p className="page-sub">PM2 重啟次數異常偵測（{">"}100 次需立即處理）</p>

      <div className="panel">
        <h3><LineChart size={16} /> PM2 重啟次數</h3>
        <table>
          <thead>
            <tr><th>服務</th><th>重啟次數</th><th>健康度</th></tr>
          </thead>
          <tbody>
            {pm2List.map((p) => (
              <tr key={p.name}>
                <td><strong>{p.name}</strong></td>
                <td className="mono">{p.restarts}</td>
                <td>{badge(p.restarts)}</td>
              </tr>
            ))}
            {pm2List.length === 0 && (
              <tr><td colSpan={3} className="page-sub">無資料</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="panel">
        <h3>磁碟 / 記憶體</h3>
        <div className="grid" style={{ marginBottom: 0 }}>
          <div className="card">
            <div className="label">磁碟使用率</div>
            <div className="value">{data?.vps?.disk ?? "—"}</div>
            <div className="bar-track"><div className="bar-fill" style={{ width: data?.vps?.disk ?? "0%" }} /></div>
          </div>
          <div className="card">
            <div className="label">記憶體使用率</div>
            <div className="value">{data?.vps?.mem ?? "—"}<small>%</small></div>
            <div className="bar-track"><div className="bar-fill" style={{ width: `${data?.vps?.mem ?? 0}%` }} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
