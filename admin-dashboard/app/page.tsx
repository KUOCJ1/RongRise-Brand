"use client";
import Link from "next/link";
import { Activity, Bot, Brain, HardDrive, Mail, Server } from "lucide-react";
import { Issues, Kpi, Meter, PageHeader, SvcPill } from "./components/ui";
import { useDashboard, v } from "./components/useDashboard";

export default function DashboardPage() {
  const { data, err, loading, updatedAt, reload } = useDashboard();
  const svc = data?.services ?? [];
  const upCount = svc.filter((s) => s.state === "up").length;
  const downCount = svc.filter((s) => s.state === "down").length;
  const diskPct = data?.vps?.diskPct ?? 0;
  const memPct = data?.vps?.mem ?? 0;
  const nl = data?.newsletter;
  const pm2Top = (data?.pm2?.items ?? []).slice(0, 5);

  return (
    <div>
      <PageHeader
        title="儀表板總覽"
        sub="榕耀管顧 VPS 服務、內容與 AI 部隊即時狀態"
        updatedAt={updatedAt}
        onRefresh={reload}
        loading={loading}
      />

      {err && <div className="error-box">{err}</div>}

      <Issues issues={data?.issues} />

      <div className="grid">
        <Kpi
          label="服務狀態"
          icon={<Server size={14} />}
          value={svc.length ? `${svc.length - downCount}/${svc.length}` : "—"}
          unit="有回應"
          tone={downCount ? "bad" : "ok"}
          hint={
            downCount
              ? `${downCount} 個沒回應：${svc.filter((s) => s.state === "down").map((s) => s.label).join("、")}`
              : `${upCount} 個 2xx · ${svc.length - upCount} 個 4xx（API-only，屬正常）`
          }
        />
        <Kpi
          label="磁碟"
          icon={<HardDrive size={14} />}
          value={v(data?.vps?.diskPct)}
          unit="%"
          tone={diskPct >= 85 ? "bad" : diskPct >= 80 ? "warn" : "ok"}
          hint={
            <>
              已用 {v(data?.vps?.diskUsed)} / {v(data?.vps?.diskTotal)}
              <Meter pct={diskPct} />
            </>
          }
        />
        <Kpi
          label="記憶體"
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
          label="AI 部隊（cron）"
          icon={<Bot size={14} />}
          value={data?.cron ? `${data.cron.enabled}` : "—"}
          unit="支啟用"
          tone={data?.cron?.failed.length ? "bad" : "ok"}
          hint={
            data?.cron
              ? `共 ${data.cron.total} 支 · 失敗 ${data.cron.failed.length} 支`
              : "讀不到 jobs.json"
          }
        />
        <Kpi
          label="電子報"
          icon={<Mail size={14} />}
          value={v(nl?.subscribers)}
          unit="位訂閱"
          tone={nl?.pending?.length ? "warn" : "neutral"}
          hint={
            nl?.pending?.length
              ? `待寄 ${nl.pending.length} 期：${nl.pending.join("、")}`
              : `下一班 ${v(nl?.nextGate)}（${v(nl?.nextGateIn)}後）`
          }
        />
        <Kpi
          label="第二大腦"
          icon={<Brain size={14} />}
          value={v(data?.secondBrain?.files)}
          unit="篇"
          tone={Number(data?.secondBrain?.uncommitted) > 20 ? "warn" : "ok"}
          hint={`7 天 ${v(data?.secondBrain?.recent7d)} 次提交 · 未提交 ${v(
            data?.secondBrain?.uncommitted
          )}`}
        />
      </div>

      <div className="panel">
        <h3>
          <Server size={16} /> 服務狀態
        </h3>
        <table>
          <thead>
            <tr>
              <th>服務</th>
              <th>Port</th>
              <th>HTTP</th>
              <th>狀態</th>
              <th className="hide-sm">備註</th>
            </tr>
          </thead>
          <tbody>
            {svc.map((s) => (
              <tr key={s.name}>
                <td>
                  <strong>{s.label}</strong>
                  <div className="sub mono">{s.name}</div>
                </td>
                <td className="mono">{s.port}</td>
                <td className="mono">{s.code}</td>
                <td>
                  <SvcPill state={s.state} code={s.code} />
                </td>
                <td className="hide-sm page-sub" style={{ marginBottom: 0 }}>
                  {s.note ?? ""}
                </td>
              </tr>
            ))}
            {svc.length === 0 && (
              <tr>
                <td colSpan={5} className="page-sub">
                  載入中…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="two-col">
        <div className="panel">
          <h3>
            <Bot size={16} /> AI 部隊
          </h3>
          {data?.cron ? (
            <>
              <p className="page-sub" style={{ marginBottom: 12 }}>
                {data.cron.enabled} / {data.cron.total} 支啟用 ·{" "}
                {data.cron.failed.length ? (
                  <span className="text-bad">{data.cron.failed.length} 支上次失敗</span>
                ) : (
                  <span className="text-ok">上次執行全部正常</span>
                )}
              </p>
              {data.cron.failed.length > 0 && (
                <ul className="list">
                  {data.cron.failed.map((f) => (
                    <li key={f.id}>
                      <span className="text-bad">✕</span> {f.name}
                      <span className="sub mono"> {f.last}</span>
                    </li>
                  ))}
                </ul>
              )}
              <table>
                <thead>
                  <tr>
                    <th>接下來要跑</th>
                    <th>時間（台北）</th>
                  </tr>
                </thead>
                <tbody>
                  {data.cron.next.map((n) => (
                    <tr key={n.name}>
                      <td>{n.name}</td>
                      <td className="mono">{n.when}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p className="page-sub">讀不到 cron/jobs.json</p>
          )}
        </div>

        <div className="panel">
          <h3>
            <Activity size={16} /> 服務重啟次數
          </h3>
          <table>
            <thead>
              <tr>
                <th>服務</th>
                <th>重啟</th>
                <th>記憶體</th>
              </tr>
            </thead>
            <tbody>
              {pm2Top.map((p) => (
                <tr key={p.name}>
                  <td>{p.name}</td>
                  <td>
                    <span
                      className={
                        p.restarts > 100 ? "badge bad" : p.restarts > 10 ? "badge warn" : "badge ok"
                      }
                    >
                      {p.restarts}
                    </span>
                  </td>
                  <td className="mono">{p.memMb} MB</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="page-sub" style={{ marginTop: 12, marginBottom: 0 }}>
            <Link href="/analytics">看完整分析 →</Link>
            {data?.vps?.uptime ? ` · 主機已運行 ${data.vps.uptime}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
