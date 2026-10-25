"use client";

import { Empty, Panel, Shell, useOps } from "../_ui";

type Article = { date: string; title: string; slug: string; url: string; cat: string };
type Video = { title: string; date: string; url: string };
type Data = {
  content: {
    articles: number;
    articles30d: number;
    newsletters: number;
    videos: number;
    igCards: number;
    socialPosts: number;
    scanDays: number;
    competitorReports: number;
    insights: number;
    monthly: { month: string; count: number }[];
    articleList: Article[];
    videoList: Video[];
  };
  periods: Record<string, string>;
};

export default function OpsContentPage() {
  const { data, err } = useOps<Data>();
  if (err) return <Shell title="內容產出" sub="資料讀取失敗"><p className="text-sm">請稍後再試。</p></Shell>;
  if (!data) return <Shell title="內容產出" sub="載入中"><Empty /></Shell>;
  const c = data.content;

  return (
    <Shell title="內容產出" sub={`${data.periods.content}。文章清單為最近 40 篇，可點進官網原文。`}>
      <Panel title="產出總量" meta="累計值">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["官網文章", c.articles, "篇"],
            ["電子報", c.newsletters, "期"],
            ["YouTube", c.videos, "支"],
            ["IG 圖卡", c.igCards, "組"],
            ["社群貼文", c.socialPosts, "則"],
            ["知識掃描", c.scanDays, "天"],
            ["競對報告", c.competitorReports, "份"],
            ["洞察筆記", c.insights, "篇"],
          ].map(([label, val, unit]) => (
            <div key={String(label)} className="rounded-xl border border-[#E4DDD0] bg-[#FBF8F3] px-4 py-3">
              <div className="text-xs text-[#6B655D]">{label}</div>
              <div className="mt-1 text-2xl font-bold tabular-nums text-[#0D2B4E]">
                {val}
                <span className="ml-1 text-xs font-normal text-[#4A4540]">{unit}</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="每月上線" meta="2026/05 起逐月，含 0 的月份">
        <div className="flex flex-wrap gap-2">
          {c.monthly.map((m) => (
            <div key={m.month} className="rounded-lg border border-[#E4DDD0] px-3 py-2 text-xs text-[#4A4540]">
              {m.month} <span className="ml-1 font-bold tabular-nums text-[#0D2B4E]">{m.count}</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="最近文章" meta={`${c.articleList.length} 篇`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#E4DDD0] text-xs text-[#6B655D]">
                <th className="py-2 pr-4 font-medium">日期</th>
                <th className="py-2 pr-4 font-medium">標題</th>
                <th className="py-2 font-medium">分類</th>
              </tr>
            </thead>
            <tbody>
              {c.articleList.map((a) => (
                <tr key={a.slug} className="border-b border-[#F0EAE0] last:border-0">
                  <td className="whitespace-nowrap py-2.5 pr-4 tabular-nums text-xs text-[#6B655D]">{a.date}</td>
                  <td className="py-2.5 pr-4">
                    <a href={a.url} className="text-[#0D2B4E] underline decoration-[#D9D2C6] underline-offset-4 hover:decoration-[#E8912A]">
                      {a.title}
                    </a>
                  </td>
                  <td className="whitespace-nowrap py-2.5 text-xs text-[#6B655D]">{a.cat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="最近影片" meta={`${c.videoList.length} 支`}>
        <ul className="space-y-2 text-sm">
          {c.videoList.map((v) => (
            <li key={v.url + v.title} className="flex flex-wrap items-baseline gap-x-3">
              <span className="text-xs tabular-nums text-[#6B655D]">{v.date}</span>
              <a href={v.url} className="text-[#0D2B4E] underline decoration-[#D9D2C6] underline-offset-4 hover:decoration-[#E8912A]">
                {v.title}
              </a>
            </li>
          ))}
        </ul>
      </Panel>
    </Shell>
  );
}
