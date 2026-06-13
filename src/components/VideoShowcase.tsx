"use client";

import { useState } from "react";

interface Video {
  id: string;
  title: string;
  date: string;
  duration: string;
  thumbnail: string;
}

const VIDEOS: Video[] = [
  {
    id: "7Rkhf2jUY9c",
    title: "Shadow AI 正在你家企業裡爆炸：你最大的資安風險不是駭客，是員工",
    date: "2026.06.13",
    duration: "0:55",
    thumbnail: `https://img.youtube.com/vi/7Rkhf2jUY9c/maxresdefault.jpg`,
  },
  {
    id: "oI6kVYjZIKI",
    title: "Token 計價時代來了！AI 每一問都有價",
    date: "2026.06.11",
    duration: "2:09",
    thumbnail: `https://img.youtube.com/vi/oI6kVYjZIKI/maxresdefault.jpg`,
  },
  {
    id: "IzMDXlpHqF4",
    title: "傳產轉型不用砍掉重練？「策略是減法」讓企業輕裝上陣",
    date: "2026.06.11",
    duration: "2:13",
    thumbnail: `https://img.youtube.com/vi/IzMDXlpHqF4/maxresdefault.jpg`,
  },
];

export default function VideoShowcaseSection() {
  const [playing, setPlaying] = useState<string | null>(null);

  return (
    <section className="section bg-gradient-subtle">
      <div className="section-inner">
        <div className="text-center mb-12">
          <span className="tag mb-4">影音內容</span>
          <h2 className="heading-section text-dark mt-4">CJ哥的轉型觀點</h2>
          <div className="brand-divider brand-divider-center mt-4" />
          <p className="text-text-secondary text-body-lg mt-6 max-w-2xl mx-auto">
            用看的，更快吸收。CJ哥在 YouTube 頻道分享 AI 轉型、人才策略與 ESG 永續的實戰經驗。
          </p>
        </div>

        {/* 主要播放器 */}
        {playing && (
          <div className="max-w-4xl mx-auto mb-10">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-xl">
              <iframe
                src={`https://www.youtube.com/embed/${playing}?autoplay=1&rel=0&modestbranding=1`}
                title="YouTube 影片播放"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="text-center mt-4">
              <button
                onClick={() => setPlaying(null)}
                className="text-sm text-text-secondary hover:text-primary transition-colors"
              >
                ✕ 關閉影片
              </button>
            </div>
          </div>
        )}

        {/* 影片網格 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {VIDEOS.map((video) => (
            <div key={video.id} className="card group cursor-pointer overflow-hidden" onClick={() => setPlaying(video.id)}>
              <div className="relative aspect-video overflow-hidden bg-dark/5">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    // fallback to hqdefault if maxresdefault not available
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                  }}
                />
                {/* 播放按鈕覆蓋層 */}
                <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/20 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-accent/90 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                {/* 時長標籤 */}
                <span className="absolute bottom-2 right-2 bg-dark/80 text-white text-xs px-2 py-0.5 rounded font-medium">
                  {video.duration}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-dark group-hover:text-primary transition-colors text-sm leading-relaxed line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-xs text-text-secondary mt-2">{video.date}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <a
            href="https://www.youtube.com/@RongRiseConsulting"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            訂閱 YouTube 頻道 @RongRiseConsulting
          </a>
        </div>
      </div>
    </section>
  );
}