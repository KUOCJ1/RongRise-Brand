"use client";
import { Activity, HardDrive, RotateCw } from "lucide-react";
import { Kpi, Meter, PageHeader } from "../components/ui";
import { useDashboard, v } from "../components/useDashboard";

export default function AnalyticsPage() {
  const { data, err, loading, updatedAt, reload } = useDashboard();
  const items = data?.pm2?.items ?? [];
  const diskPct = data?.vps?.diskPct ?? 0;
  const memPct = data?.vps?.mem ?? 0;

  const badge = (n: number) =>
    n > 100 ? (
      <span className="badge bad">{n} 次</span>
    ) : n > 10 ? (
      <span className="badge warn">{n} 次</span>
    ) : (
      <span className="badge ok">{n} 次</span>
    );

  return (
    <div>
      <PageHeader
        title="健康指標分析"
        sub="重啟次數、資源水位與主機概況"
        updatedAt={updatedAt}
        onRefresh={reload}
        loading={loading}
      />

      {err && <div className="error-box">{err}</div>}

      <div className="grid">
        <Kpi
          label="磁碟使用率"
          icon={<HardDrive size={14} />}
          value={v(data?.vps?.diskPct)}
          unit="%"
          tone={diskPct >= 85 ? "bad" : diskPct >= 80 ? "warn" : "ok"}
          hint={
            <>
              {v(data?.vps?.diskUsed)} / {v(data?.vps?.diskTotal)}
              <Meter pct={diskPct} />
            </>
          }
        />
        <Kpi
          label="記憶體使用率"
          icon={<Activity size={14} />}
          value={v(data?.vps?.mem)}
          unit="%"
          tone={memPct >= 90 ? "warn" : "ok"}
          hint={
            <>
              {v(data?.vps?.memUsed)} / {v(data?.vps?.memTotal)} MB
              <Meter pct={memPct} />
            </>
          }
        />
        <Kpi
          label="主機負載"
          icon={<Activity size={14} />}
          value={v(data?.vps?.load?.split(" ")[0])}
          hint={`1／5／15 分鐘：${v(data?.vps?.load)} · 已運行 ${v(data?.vps?.uptime)}`}
        />
        <Kpi
          label="PM2 服務"
          icon={<RotateCw size={14} />}
          value={data?.pm2 ? String(data.pm2.total) : "—"}
          unit="支"
          hint="重啟 >10 次轉黃、>100 次轉紅"
        />
      </div>

      <div className="panel">
        <h3>
          <RotateCw size={16} /> 各服務重啟次數
        </h3>
        <table>
          <thead>
            <tr>
              <th>服務</th>
              <th>狀態</th>
              <th>重啟</th>
              <th>記憶體</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.name}>
                <td>
                  <strong>{p.name}</strong>
                </td>
                <td>
                  <span className={p.status === "online" ? "badge ok" : "badge bad"}>{p.status}</span>
                </td>
                <td>{badge(p.restarts)}</td>
                <td className="mono">{p.memMb} MB</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="page-sub">
                  {data ? "pm2 jlist 讀不到資料" : "載入中…"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="panel">
        <h3>判讀原則</h3>
        <ul className="list">
          <li>重啟次數是累計值，不是近期趨勢；要看「有沒有在增加」得記兩次比較。</li>
          <li>磁碟 80% 起轉黃、85% 起轉紅，與自動清理看門狗的門檻一致。</li>
          <li>記憶體沒有 swap，接近 90% 就會開始影響 build 與長任務。</li>
        </ul>
      </div>
    </div>
  );
}
