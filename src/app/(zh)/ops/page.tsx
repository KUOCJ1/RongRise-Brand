"use client";

import { useEffect, useMemo, useState } from "react";

/* ============================================
   營運總覽（Operations Overview）
   一個頁面看完：內容產出、服務健康、排程事故、管理成本、成果。
   資料源：/ops-overview.json（scripts/ops_overview.py 聚合）
   每個區塊標明統計期間與來源，避免跨期誤讀。
   ============================================ */

type Headline = { key: string; label: string; value: number; unit: string; note: string };
type HealthDay = { date: string; online: number; total: number; status: string; disk: number | null; restarts: number };
type LiveCheck = { name: string; url: string; code: string; ok: boolean; seconds: number };
type IncidentType = { type: string; count: number };

type OpsData = {
  generatedAt: string;
  periods: Record<string, string>;
  headline: Headline[];
  content: {
    articles: number;
    articles30d: number;
    newsletters: number;
    videos: number;
    videos30d: number;
    igCards: number;
    socialPosts: number;
    scanDays: number;
    competitorReports: number;
    insights: number;
    monthly: { month: string; count: number }[];
    latest: {
      article?: { title: string; date: string; url: string } | null;
      newsletter?: string | null;
      video?: { title: string; date: string; url: string } | null;
    };
  };
  health: {
    days: HealthDay[];
    checks: number;
    online: number;
    warningDays: number;
    maxDisk: number;
    live: LiveCheck[];
    liveAt: string;
  };
  schedule: {
    incidents30d: number;
    incidentJobs: number;
    incidentDays: number;
    open: number;
    types: IncidentType[];
    executions: number;
    executionsOk: number;
    executionsFrom: string;
    jobs: number;
    jobsEnabled: number;
  };
  management: {
    days: number;
    medianOnline: number;
    experimentMedian: number;
    avgOnline: number;
    totalHours: number;
    medianVisits: number;
    perVisit: number;
    daysUnder30: number;
    daily: { date: string; min: number; visits: number }[];
  };
  reach: { subscribers: number; confirmed: number; pending: number; views: number; channelSubscribers: number };
};

const NAVY = "#0D2B4E";
const GOLD = "#E8912A";
const TEAL = "#2EC4B6";
const MUTED = "#7A746C";
const LINE = "#D9D2C6";

function KpiCard({ item }: { item: Headline }) {
  return (
    <div className="rounded-2xl border border-[#E4DDD0] bg-white p-6">
      <div className="text-sm font-medium tracking-wide text-[#6B655D]">{item.label}</div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-4xl font-bold tabular-nums text-[#0D2B4E]">{item.value}</span>
        <span className="text-sm text-[#4A4540]">{item.unit}</span>
      </div>
      <div className="mt-2 text-xs leading-relaxed text-[#6B655D]">{item.note}</div>
    </div>
  );
}

function Stat({ label, value, unit, note }: { label: string; value: number | string; unit?: string; note?: string }) {
  return (
    <div className="rounded-xl border border-[#E4DDD0] bg-[#FBF8F3] px-4 py-3">
      <div className="text-xs text-[#6B655D]">{label}</div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-2xl font-bold tabular-nums text-[#0D2B4E]">{value}</span>
        {unit && <span className="text-xs text-[#4A4540]">{unit}</span>}
      </div>
      {note && <div className="mt-1 text-[11px] text-[#6B655D]">{note}</div>}
    </div>
  );
}

function SectionTitle({ no, title, sub }: { no: string; title: string; sub: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 border-b border-[#E4DDD0] pb-3">
      <div>
        <div className="text-xs font-semibold tracking-[0.2em] text-[#A9611A]">{no}</div>
        <h2 className="mt-1 text-2xl font-bold text-[#0D2B4E]">{title}</h2>
      </div>
      <p className="max-w-md text-right text-xs leading-relaxed text-[#6B655D]">{sub}</p>
    </div>
  );
}

export default function OpsPage() {
  const [data, setData] = useState<OpsData | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    fetch("/ops-overview.json")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(setData)
      .catch(() => setErr(true));
  }, []);

  const monthlyMax = useMemo(() => Math.max(1, ...(data?.content.monthly.map((m) => m.count) ?? [1])), [data]);
  const dailyMax = useMemo(() => Math.max(60, ...(data?.management.daily.map((d) => d.min) ?? [60])), [data]);
  const typeMax = useMemo(() => Math.max(1, ...(data?.schedule.types.map((t) => t.count) ?? [1])), [data]);

  if (err) return <main className="mx-auto max-w-3xl px-6 py-24 text-sm text-[#0D2B4E]">營運資料暫時讀不到，請稍後再試。</main>;
  if (!data) return <main className="mx-auto max-w-3xl px-6 py-24 text-sm text-[#6B655D]">載入營運資料…</main>;

  const c = data.content;
  const h = data.health;
  const s = data.schedule;
  const m = data.management;
  const r = data.reach;
  const uptime = h.checks ? ((h.online / h.checks) * 100).toFixed(1) : "—";

  return (
    <main className="bg-[#FBF8F3]">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        {/* Header */}
        <header className="mb-10">
          <div className="text-xs font-semibold tracking-[0.2em] text-[#A9611A]">內部營運台・不公開索引</div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#0D2B4E] sm:text-5xl">營運總覽</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#4A4540]">
            內容產出、系統健康、排程事故、管理成本與成果，放在同一頁。每個數字都標了統計期間與來源，跨期比較時請以標註為準。
          </p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-[#6B655D]">
            <span>資料時間 {data.generatedAt.replace("T", " ").replace("Z", " UTC")}</span>
            <span>健康 {data.periods.health}</span>
            <span>管理 {data.periods.management}</span>
          </div>
        </header>

        {/* KPI */}
        <section className="mb-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.headline.map((k) => (
            <KpiCard key={k.key} item={k} />
          ))}
        </section>

        {/* 01 內容 */}
        <section className="mb-16">
          <SectionTitle no="01 內容" title="產出" sub={`累計至 ${data.generatedAt.slice(0, 10)}；近 30 天自 ${data.periods.content.split("近 30 天＝")[1] ?? ""}`} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="官網文章" value={c.articles} unit="篇" note={`近 30 天 +${c.articles30d}`} />
            <Stat label="電子報" value={c.newsletters} unit="期" />
            <Stat label="YouTube 影片" value={c.videos} unit="支" note={`近 30 天 +${c.videos30d}`} />
            <Stat label="IG 圖卡" value={c.igCards} unit="組" />
            <Stat label="社群貼文" value={c.socialPosts} unit="則" />
            <Stat label="知識掃描" value={c.scanDays} unit="天" />
            <Stat label="競對報告" value={c.competitorReports} unit="份" />
            <Stat label="洞察筆記" value={c.insights} unit="篇" />
          </div>

          <div className="mt-6 rounded-2xl border border-[#E4DDD0] bg-white p-6">
            <div className="mb-4 flex items-baseline justify-between">
              <h3 className="text-sm font-semibold text-[#0D2B4E]">每月上線文章</h3>
              <span className="text-[11px] text-[#6B655D]">近 8 個月｜單位：篇</span>
            </div>
            <div className="flex h-40 items-end gap-2 sm:gap-4">
              {c.monthly.map((mo) => (
                <div key={mo.month} className="flex flex-1 flex-col items-center gap-2">
                  <div className="text-[11px] font-semibold tabular-nums text-[#4A4540]">{mo.count}</div>
                  <div
                    className="w-full rounded-t-md"
                    style={{
                      height: `${Math.max(4, (mo.count / monthlyMax) * 110)}px`,
                      background: mo.month === c.monthly[c.monthly.length - 1].month ? GOLD : NAVY,
                      opacity: mo.month === c.monthly[c.monthly.length - 1].month ? 1 : 0.85,
                    }}
                  />
                  <div className="text-[10px] text-[#6B655D]">{mo.month.slice(2).replace("-", "/")}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {c.latest?.article && (
              <a href={c.latest.article.url} className="rounded-xl border border-[#E4DDD0] bg-white p-4 transition hover:border-[#E8912A]">
                <div className="text-[11px] text-[#6B655D]">最新文章 · {c.latest.article.date}</div>
                <div className="mt-1 line-clamp-2 text-sm font-medium text-[#0D2B4E]">{c.latest.article.title}</div>
              </a>
            )}
            {c.latest?.newsletter && (
              <div className="rounded-xl border border-[#E4DDD0] bg-white p-4">
                <div className="text-[11px] text-[#6B655D]">最新電子報</div>
                <div className="mt-1 line-clamp-2 text-sm font-medium text-[#0D2B4E]">{c.latest.newsletter}</div>
              </div>
            )}
            {c.latest?.video && (
              <a href={c.latest.video.url} className="rounded-xl border border-[#E4DDD0] bg-white p-4 transition hover:border-[#E8912A]">
                <div className="text-[11px] text-[#6B655D]">最新影片 · {c.latest.video.date}</div>
                <div className="mt-1 line-clamp-2 text-sm font-medium text-[#0D2B4E]">{c.latest.video.title}</div>
              </a>
            )}
          </div>
        </section>

        {/* 02 健康 */}
        <section className="mb-16">
          <SectionTitle no="02 營運" title="系統健康" sub={`每日健康檢查 ${h.days.length} 天、每天 ${h.days[0]?.total ?? 0} 個服務與端點；右側為即時實測`} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="服務可用率" value={uptime} unit="%" note={`${h.online}/${h.checks} 次`} />
            <Stat label="警示天數" value={h.warningDays} unit="天" note="非全綠，含重啟" />
            <Stat label="磁碟最高" value={h.maxDisk} unit="%" note="期間內最高點" />
            <Stat label="未結事故" value={s.open} unit="件" note="目前未結" />
          </div>

          <div className="mt-6 rounded-2xl border border-[#E4DDD0] bg-white p-6">
            <div className="mb-3 flex items-baseline justify-between">
              <h3 className="text-sm font-semibold text-[#0D2B4E]">每日健康檢查</h3>
              <span className="text-[11px] text-[#6B655D]">
                {h.days[0]?.date} ~ {h.days[h.days.length - 1]?.date}｜綠＝全在線、黃＝有警示
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {h.days.map((d) => (
                <div key={d.date} className="group relative">
                  <div
                    className="h-8 w-8 rounded-md"
                    style={{ background: d.status === "ok" ? TEAL : GOLD, opacity: d.status === "ok" ? 0.85 : 0.95 }}
                    title={`${d.date}｜${d.online}/${d.total}｜重啟 ${d.restarts} 次｜磁碟 ${d.disk ?? "?"}%`}
                  />
                  <div className="mt-1 text-center text-[9px] text-[#6B655D]">{d.date.slice(8)}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E4DDD0] text-[#6B655D]">
                    <th className="py-2 pr-4 font-medium">對外入口</th>
                    <th className="py-2 pr-4 font-medium">狀態</th>
                    <th className="py-2 pr-4 font-medium">HTTP</th>
                    <th className="py-2 font-medium">回應</th>
                  </tr>
                </thead>
                <tbody>
                  {h.live.map((l) => (
                    <tr key={l.name} className="border-b border-[#F0EAE0] last:border-0">
                      <td className="py-2 pr-4 text-[#0D2B4E]">{l.name}</td>
                      <td className="py-2 pr-4">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: l.ok ? TEAL : "#C0392B" }} />
                          {l.ok ? "正常" : "異常"}
                        </span>
                      </td>
                      <td className="py-2 pr-4 tabular-nums text-[#4A4540]">{l.code}</td>
                      <td className="py-2 tabular-nums text-[#4A4540]">{l.seconds}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-[11px] text-[#6B655D]">
                實測時間 {h.liveAt}（台北 {new Date(h.liveAt.replace(" UTC", "Z")).toLocaleString("zh-TW", { timeZone: "Asia/Taipei", hour12: false })}）；401 代表服務存活但需登入。
              </p>
            </div>
          </div>
        </section>

        {/* 03 排程 */}
        <section className="mb-16">
          <SectionTitle no="03 自動化" title="排程與事故" sub={`排程 ${s.jobs} 支（啟用 ${s.jobsEnabled}）；事故統計為近 30 天`} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="告警筆數" value={s.incidents30d} unit="筆" note={`涉及 ${s.incidentJobs} 支排程`} />
            <Stat label="發生天數" value={s.incidentDays} unit="天" note="近 30 天內" />
            <Stat label="未結事故" value={s.open} unit="件" note="全部已解除" />
            <Stat label="近期執行" value={`${s.executionsOk}/${s.executions}`} note={`自 ${s.executionsFrom.replace("T", " ")}`} />
          </div>

          <div className="mt-6 rounded-2xl border border-[#E4DDD0] bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-[#0D2B4E]">事故類型（近 30 天）</h3>
            <div className="space-y-3">
              {s.types.map((t) => (
                <div key={t.type} className="flex items-center gap-3">
                  <div className="w-24 text-xs text-[#4A4540]">{t.type}</div>
                  <div className="h-6 flex-1 overflow-hidden rounded bg-[#F0EAE0]">
                    <div className="h-full rounded" style={{ width: `${(t.count / typeMax) * 100}%`, background: t.type === "script" ? GOLD : NAVY }} />
                  </div>
                  <div className="w-8 text-right text-xs font-semibold tabular-nums text-[#0D2B4E]">{t.count}</div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-[#6B655D]">
              同一問題重複偵測會產生多筆告警（以 error signature 去重），因此「筆數」大於「事故件數」。未結 0 表示目前沒有未處理的排程故障。
            </p>
          </div>
        </section>

        {/* 04 管理成本 */}
        <section className="mb-16">
          <SectionTitle no="04 管理" title="注意力成本" sub={`${data.periods.management}；以訊息時間戳估計，間隔 5 分鐘內計為同一次在場`} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <Stat label="每天在場" value={m.medianOnline} unit="分" note="中位數" />
            <Stat label="實驗期 13 天" value={m.experimentMedian} unit="分" note="10/03–10/15" />
            <Stat label="平均" value={m.avgOnline} unit="分" />
            <Stat label="合計" value={m.totalHours} unit="小時" />
            <Stat label="每天進場" value={m.medianVisits} unit="次" note={`每次 ${m.perVisit} 分`} />
            <Stat label="30 分內" value={`${m.daysUnder30}/${m.days}`} unit="天" />
          </div>

          <div className="mt-6 rounded-2xl border border-[#E4DDD0] bg-white p-6">
            <div className="mb-4 flex items-baseline justify-between">
              <h3 className="text-sm font-semibold text-[#0D2B4E]">每日在場時間</h3>
              <span className="text-[11px] text-[#6B655D]">橘線＝30 分鐘目標；單位：分鐘</span>
            </div>
            <div className="flex h-44 items-end gap-1.5">
              {m.daily.map((d) => (
                <div key={d.date} className="group flex flex-1 flex-col items-center justify-end gap-1">
                  <div
                    className="w-full rounded-t"
                    style={{
                      height: `${Math.max(3, (d.min / dailyMax) * 130)}px`,
                      background: d.min > 30 ? GOLD : TEAL,
                    }}
                    title={`${d.date}｜${d.min} 分｜進場 ${d.visits} 次`}
                  />
                  <div className="text-[9px] text-[#6B655D]">{d.date.slice(8)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 05 成果 */}
        <section className="mb-10">
          <SectionTitle no="05 成果" title="讀者與觸及" sub="訂閱與觀看為累計值；待確認＝填了表單但未點確認信" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="電子報訂閱" value={r.subscribers} unit="人" note={`已確認 ${r.confirmed}`} />
            <Stat label="待確認" value={r.pending} unit="人" />
            <Stat label="YouTube 觀看" value={r.views} unit="次" note="累計" />
            <Stat label="頻道訂閱" value={r.channelSubscribers} unit="人" />
          </div>
        </section>

        {/* 定義 */}
        <footer className="rounded-2xl border border-[#E4DDD0] bg-white p-6 text-[11px] leading-relaxed text-[#6B655D]">
          <div className="mb-2 font-semibold text-[#0D2B4E]">數字怎麼來的</div>
          <ul className="list-disc space-y-1 pl-4">
            <li>內容產出：官網 {`articles.json`} 與 content-ops 聚合檔；影片以 YouTube Data API 回查上傳清單。</li>
            <li>服務可用率：每日健康檢查（13 個 pm2 服務＋5 個對外端點）逐日累計，端點接受 200／301／302／307。</li>
            <li>排程事故：Hermes cron 事故表，依 error signature 去重；「筆數」為偵測次數，非獨立事故數。</li>
            <li>管理成本：實驗期訊息時間戳推算，中位數優於平均（少數長尾會拉高平均）。</li>
            <li>本頁不進 sitemap、不設索引；資料每日由排程重算。</li>
          </ul>
        </footer>
      </div>
    </main>
  );
}
