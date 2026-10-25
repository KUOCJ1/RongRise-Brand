"use client";

import { Empty, Panel, Shell, useOps } from "../_ui";

type Incident = { job: string; type: string; state: string; first: string; closed: string; error: string };
type Data = {
  schedule: {
    incidents30d: number;
    incidentJobs: number;
    incidentDays: number;
    open: number;
    types: { type: string; count: number }[];
    executions: number;
    executionsOk: number;
    executionsFrom: string;
    jobs: number;
    jobsEnabled: number;
    incidents: Incident[];
  };
};

export default function OpsSchedulePage() {
  const { data, err } = useOps<Data>();
  if (err) return <Shell title="排程與事故" sub="資料讀取失敗"><p className="text-sm">請稍後再試。</p></Shell>;
  if (!data) return <Shell title="排程與事故" sub="載入中"><Empty /></Shell>;
  const s = data.schedule;
  const typeMax = Math.max(1, ...s.types.map((t) => t.count));

  return (
    <Shell title="排程與事故" sub={`排程 ${s.jobs} 支（啟用 ${s.jobsEnabled}）。告警以 error signature 去重，同一個問題重複偵測會產生多筆。`}>
      <Panel title="事故類型" meta="近 30 天">
        <div className="space-y-2.5">
          {s.types.map((t) => (
            <div key={t.type} className="flex items-center gap-3">
              <div className="w-24 text-xs text-[#4A4540]">{t.type}</div>
              <div className="h-5 flex-1 overflow-hidden rounded bg-[#F0EAE0]">
                <div
                  className="h-full rounded"
                  style={{ width: `${(t.count / typeMax) * 100}%`, background: t.type === "script" ? "#E8912A" : "#0D2B4E" }}
                />
              </div>
              <div className="w-8 text-right text-xs font-semibold tabular-nums text-[#0D2B4E]">{t.count}</div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="告警紀錄" meta={`顯示最近 ${s.incidents.length} 筆｜未結 ${s.open} 件`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#E4DDD0] text-xs text-[#6B655D]">
                <th className="py-2 pr-3 font-medium">首次</th>
                <th className="py-2 pr-3 font-medium">排程</th>
                <th className="py-2 pr-3 font-medium">類型</th>
                <th className="py-2 pr-3 font-medium">解除</th>
                <th className="py-2 font-medium">錯誤摘要</th>
              </tr>
            </thead>
            <tbody>
              {s.incidents.map((it, i) => (
                <tr key={`${it.job}-${it.first}-${i}`} className="border-b border-[#F0EAE0] align-top last:border-0">
                  <td className="whitespace-nowrap py-2.5 pr-3 text-xs tabular-nums text-[#6B655D]">{it.first}</td>
                  <td className="whitespace-nowrap py-2.5 pr-3 font-mono text-[11px] text-[#4A4540]">{it.job}</td>
                  <td className="whitespace-nowrap py-2.5 pr-3 text-xs text-[#4A4540]">{it.type}</td>
                  <td className="whitespace-nowrap py-2.5 pr-3 text-xs text-[#4A4540]">
                    {it.state === "resolved" || it.state === "closed" ? (
                      <span className="text-[#1E7F76]">已解除 {it.closed}</span>
                    ) : (
                      <span className="text-[#A9611A]">未結</span>
                    )}
                  </td>
                  <td className="py-2.5 text-[11px] leading-relaxed text-[#6B655D]">{it.error}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </Shell>
  );
}
