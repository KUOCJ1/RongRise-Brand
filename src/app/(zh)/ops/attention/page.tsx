"use client";

import { Empty, Panel, Shell, useOps } from "../_ui";

type Day = { date: string; min: number; visits: number };
type Data = {
  management: {
    days: number;
    medianOnline: number;
    experimentMedian: number;
    avgOnline: number;
    totalHours: number;
    medianVisits: number;
    perVisit: number;
    daysUnder30: number;
    daily: Day[];
  };
  periods: Record<string, string>;
};

export default function OpsAttentionPage() {
  const { data, err } = useOps<Data>();
  if (err) return <Shell title="注意力成本" sub="資料讀取失敗"><p className="text-sm">請稍後再試。</p></Shell>;
  if (!data) return <Shell title="注意力成本" sub="載入中"><Empty /></Shell>;
  const m = data.management;
  const reversed = [...m.daily].reverse();

  return (
    <Shell
      title="注意力成本"
      sub={`${data.periods.management}。在場時間以訊息時間戳估計，間隔 5 分鐘內視為同一次在場；這是估計值，不是螢幕使用紀錄。`}
    >
      <Panel title="統計" meta="中位數優於平均，少數長尾會拉高平均">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            ["每天在場（中位數）", `${m.medianOnline} 分`],
            ["實驗期 13 天", `${m.experimentMedian} 分`],
            ["平均", `${m.avgOnline} 分`],
            ["合計", `${m.totalHours} 小時`],
            ["每天進場（中位數）", `${m.medianVisits} 次`],
            ["每次停留（中位數）", `${m.perVisit} 分`],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-[#E4DDD0] bg-[#FBF8F3] px-4 py-3">
              <div className="text-xs text-[#6B655D]">{k}</div>
              <div className="mt-1 text-xl font-bold tabular-nums text-[#0D2B4E]">{v}</div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="每日明細" meta={`${m.days} 天｜30 分內 ${m.daysUnder30} 天`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#E4DDD0] text-xs text-[#6B655D]">
                <th className="py-2 pr-4 font-medium">日期</th>
                <th className="py-2 pr-4 font-medium">在場（分）</th>
                <th className="py-2 pr-4 font-medium">進場（次）</th>
                <th className="py-2 font-medium">每次（分）</th>
              </tr>
            </thead>
            <tbody>
              {reversed.map((d) => {
                const per = d.visits ? (d.min / d.visits).toFixed(1) : "—";
                return (
                  <tr key={d.date} className="border-b border-[#F0EAE0] last:border-0">
                    <td className="py-2.5 pr-4 tabular-nums text-xs text-[#4A4540]">{d.date}</td>
                    <td className="py-2.5 pr-4 tabular-nums">
                      <span className={d.min > 30 ? "text-[#A9611A]" : "text-[#1E7F76]"}>{d.min}</span>
                    </td>
                    <td className="py-2.5 pr-4 tabular-nums text-[#4A4540]">{d.visits}</td>
                    <td className="py-2.5 tabular-nums text-[#4A4540]">{per}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </Shell>
  );
}
