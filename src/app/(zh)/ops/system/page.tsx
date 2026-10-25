"use client";

import { Empty, Panel, Shell, useOps } from "../_ui";

type Day = { date: string; online: number; total: number; status: string; disk: number | null; restarts: number };
type Live = { name: string; url: string; code: string; ok: boolean; seconds: number };
type Data = {
  health: { days: Day[]; checks: number; online: number; warningDays: number; maxDisk: number; live: Live[]; liveAt: string };
  periods: Record<string, string>;
};

export default function OpsSystemPage() {
  const { data, err } = useOps<Data>();
  if (err) return <Shell title="系統健康" sub="資料讀取失敗"><p className="text-sm">請稍後再試。</p></Shell>;
  if (!data) return <Shell title="系統健康" sub="載入中"><Empty /></Shell>;
  const h = data.health;
  const uptime = h.checks ? ((h.online / h.checks) * 100).toFixed(1) : "—";
  const reversed = [...h.days].reverse();

  return (
    <Shell title="系統健康" sub={`每日健康檢查 ${data.periods.health}；每天 13 個 pm2 服務＋5 個對外端點。下表由最新往回排。`}>
      <Panel title="即時對外檢查" meta={`實測於 ${h.liveAt}（UTC）`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#E4DDD0] text-xs text-[#6B655D]">
                <th className="py-2 pr-4 font-medium">入口</th>
                <th className="py-2 pr-4 font-medium">狀態</th>
                <th className="py-2 pr-4 font-medium">HTTP</th>
                <th className="py-2 font-medium">回應</th>
              </tr>
            </thead>
            <tbody>
              {h.live.map((l) => (
                <tr key={l.name} className="border-b border-[#F0EAE0] last:border-0">
                  <td className="py-2.5 pr-4 text-[#0D2B4E]">{l.name}</td>
                  <td className="py-2.5 pr-4">
                    <span className="inline-flex items-center gap-2 text-xs">
                      <span className="h-2 w-2 rounded-full" style={{ background: l.ok ? "#2EC4B6" : "#C0392B" }} />
                      {l.ok ? "正常" : "異常"}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 tabular-nums text-[#4A4540]">{l.code}</td>
                  <td className="py-2.5 tabular-nums text-[#4A4540]">{l.seconds}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="逐日明細" meta={`${h.days.length} 天｜可用率 ${uptime}%（${h.online}/${h.checks}）`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#E4DDD0] text-xs text-[#6B655D]">
                <th className="py-2 pr-4 font-medium">日期</th>
                <th className="py-2 pr-4 font-medium">狀態</th>
                <th className="py-2 pr-4 font-medium">在線</th>
                <th className="py-2 pr-4 font-medium">重啟</th>
                <th className="py-2 font-medium">磁碟</th>
              </tr>
            </thead>
            <tbody>
              {reversed.map((d) => (
                <tr key={d.date} className="border-b border-[#F0EAE0] last:border-0">
                  <td className="py-2.5 pr-4 tabular-nums text-xs text-[#4A4540]">{d.date}</td>
                  <td className="py-2.5 pr-4">
                    <span
                      className="rounded-full px-2 py-0.5 text-[11px]"
                      style={{
                        background: d.status === "ok" ? "rgba(46,196,182,.15)" : "rgba(232,145,42,.15)",
                        color: d.status === "ok" ? "#1E7F76" : "#A9611A",
                      }}
                    >
                      {d.status === "ok" ? "全在線" : "有警示"}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 tabular-nums text-[#4A4540]">
                    {d.online}/{d.total}
                  </td>
                  <td className="py-2.5 pr-4 tabular-nums text-[#4A4540]">{d.restarts}</td>
                  <td className="py-2.5 tabular-nums text-[#4A4540]">{d.disk ?? "—"}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </Shell>
  );
}
