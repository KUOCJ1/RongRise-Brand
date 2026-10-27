"use client";
import { useEffect, useState } from "react";
import { Brain, Server, Mail, Activity } from "lucide-react";

type Data = {
  secondBrain?: { files: string; recent7d: string; uncommitted: string };
  services?: { name: string; port: number; code: string }[];
  vps?: { disk: string; mem: string };
  newsletter?: { subscribers: string };
  pm2?: string;
  ts?: string;
};

export default function DashboardPage() {
  const [data, setData] = useState<Data | null>(null);
  const [err, setErr] = useState("");
  // 空字串代表量測失敗，要顯示「—」而不是留白（2026-10-27 修）
  const v = (x?: string) => (x === undefined || x === null || x === "" ? "—" : x);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setErr("無法取得資料"));
  }, []);

  const codeBadge = (code: string) =>
    code === "200" || code === "401" || code === "404" ? (
      <span className="badge ok">UP</span>
    ) : (
      <span className="badge bad">{code || "DOWN"}</span>
    );

  return (
    <div>
      <h1 className="page-title">儀表板總覽</h1>
      <p className="page-sub">榕耀管顧 VPS 服務健康狀態 {data?.ts ? `· 更新於 ${new Date(data.ts).toLocaleTimeString("zh-TW")}` : ""}</p>

      {err && <div className="error-box">{err}</div>}

      <div className="grid">
        <div className="card">
          <div className="label"><Brain size={14} /> 第二大腦</div>
          <div className="value">{v(data?.secondBrain?.files)}<small> 篇筆記</small></div>
          <div className="hint">7 天更新 {v(data?.secondBrain?.recent7d)} · 未提交 {v(data?.secondBrain?.uncommitted)}</div>
        </div>
        <div className="card">
          <div className="label"><Server size={14} /> 磁碟</div>
          <div className="value">{v(data?.vps?.disk)}</div>
          <div className="bar-track"><div className="bar-fill" style={{ width: data?.vps?.disk ?? "0%" }} /></div>
        </div>
        <div className="card">
          <div className="label"><Activity size={14} /> 記憶體</div>
          <div className="value">{v(data?.vps?.mem)}<small>%</small></div>
          <div className="bar-track"><div className="bar-fill" style={{ width: `${data?.vps?.mem ?? 0}%` }} /></div>
        </div>
        <div className="card">
          <div className="label"><Mail size={14} /> 電子報訂閱</div>
          <div className="value">{v(data?.newsletter?.subscribers)}<small> 人</small></div>
          <div className="hint">每週日 19:00 自動寄送</div>
        </div>
      </div>

      <div className="panel">
        <h3>服務狀態</h3>
        <table>
          <thead>
            <tr><th>服務</th><th>Port</th><th>HTTP</th><th>狀態</th></tr>
          </thead>
          <tbody>
            {(data?.services ?? []).map((s) => (
              <tr key={s.name}>
                <td><strong>{s.name}</strong></td>
                <td className="mono">{s.port}</td>
                <td className="mono">{s.code}</td>
                <td>{codeBadge(s.code)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="panel">
        <h3>PM2 重啟次數</h3>
        <p className="page-sub" style={{ marginBottom: 0 }}>
          {data?.pm2 ? <span className="mono">{data.pm2}</span> : "載入中…"}
        </p>
      </div>
    </div>
  );
}
