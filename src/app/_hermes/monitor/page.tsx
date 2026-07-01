"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import newsData from "@/data/news.json";
import type { Metadata } from "next";

export default function MonitorPage() {
  const [videoData, setVideoData] = useState<any>(null);

  useEffect(() => {
    fetch("/data/youtube-videos.json")
      .then((r) => r.json())
      .then(setVideoData)
      .catch(() => {});
  }, []);

  const totalArticles = 28; // from JSON
  const totalNews = newsData.news.length;
  const newItems = newsData.news.filter((n) => n.isNew).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-text-primary mb-2">📊 內容監控儀表板</h1>
      <p className="text-text-secondary mb-8">即時掌握官網內容狀態</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="文章總數" value={totalArticles.toString()} color="text-primary" />
        <StatCard label="最新消息" value={totalNews.toString()} color="text-secondary" />
        <StatCard label="NEW 標記" value={newItems.toString()} color="text-tertiary" />
        <StatCard label="最新影片" value={videoData?.videos?.length?.toString() || "0"} color="text-accent" />
      </div>

      {/* Video Status */}
      <Section title="🎬 YouTube 影片輪播">
        {videoData ? (
          <div className="space-y-2">
            {videoData.videos?.map((v: any) => (
              <div key={v.id} className="flex items-center gap-3 text-sm">
                <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                <span className="text-text-primary truncate">{v.title}</span>
                <span className="text-text-secondary text-xs flex-shrink-0">{v.date}</span>
              </div>
            ))}
            <p className="text-xs text-text-secondary mt-2">最後更新：{videoData.videos?.[0]?.date || "未知"}</p>
          </div>
        ) : (
          <p className="text-sm text-text-secondary">載入中...</p>
        )}
      </Section>

      {/* News Status */}
      <Section title="📰 最新消息">
        <div className="space-y-2">
          {newsData.news.slice(0, 5).map((n) => (
            <div key={n.id} className="flex items-center gap-3 text-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
              <span className="text-text-primary truncate">{n.title}</span>
              {n.isNew && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-tertiary text-white font-bold flex-shrink-0">NEW</span>}
            </div>
          ))}
        </div>
      </Section>

      {/* Cron Status */}
      <Section title="⏰ 自動化排程">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-text-primary">YouTube 每日自動同步（03:00）</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-text-primary">記憶每日健康檢查（03:00）</span>
          </div>
        </div>
      </Section>

      {/* Quick Actions */}
      <Section title="⚡ 快速操作">
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="btn-secondary text-sm">回首頁</Link>
          <Link href="/news" className="btn-secondary text-sm">最新消息</Link>
          <a href="https://www.youtube.com/@RongRiseConsulting" target="_blank" className="btn-secondary text-sm" rel="noreferrer">YouTube 頻道</a>
        </div>
      </Section>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="card p-4 text-center">
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-text-secondary mt-1">{label}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5 mb-6">
      <h2 className="font-semibold text-text-primary mb-4">{title}</h2>
      {children}
    </div>
  );
}
