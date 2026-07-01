"use client";

import { useState, useEffect } from "react";

interface Video {
  id: string;
  title: string;
  date: string;
  description: string;
  thumbnail: string;
  thumbnailFallback: string;
  url: string;
}

interface VideoData {
  videos: Video[];
  fetchedAt: string;
}

export default function VideoCarousel() {
  const [data, setData] = useState<VideoData | null>(null);
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    fetch("/data/youtube-videos.json")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {
        // fallback: embed a static dataset
        setData({
          videos: [
            { id: "eOEfj96C68M", title: "隱性知識管理｜AI 轉型最被忽略的關鍵步驟", date: "2026-06-24", description: "", thumbnail: "https://img.youtube.com/vi/eOEfj96C68M/maxresdefault.jpg", thumbnailFallback: "https://img.youtube.com/vi/eOEfj96C68M/hqdefault.jpg", url: "https://www.youtube.com/watch?v=eOEfj96C68M" },
            { id: "zPR4dwzJpys", title: "太空 AI 中心 - AGI 時代最重要的基礎設施", date: "2026-06-22", description: "", thumbnail: "https://img.youtube.com/vi/zPR4dwzJpys/maxresdefault.jpg", thumbnailFallback: "https://img.youtube.com/vi/zPR4dwzJpys/hqdefault.jpg", url: "https://www.youtube.com/watch?v=zPR4dwzJpys" },
            { id: "IEZqM-SqIFk", title: "Shadow AI 正在你家企業裡爆炸", date: "2026-06-13", description: "", thumbnail: "https://img.youtube.com/vi/IEZqM-SqIFk/maxresdefault.jpg", thumbnailFallback: "https://img.youtube.com/vi/IEZqM-SqIFk/hqdefault.jpg", url: "https://www.youtube.com/watch?v=IEZqM-SqIFk" },
          ],
          fetchedAt: "",
        });
      });
  }, []);

  useEffect(() => {
    if (!autoplay || !data?.videos?.length) return;
    const timer = setInterval(() => {
      setCurrent((p) => (p + 1) % data.videos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [autoplay, data]);

  if (!data?.videos?.length) return null;

  const video = data.videos[current];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-surface border border-border">
      {/* Main player */}
      <div className="aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full"
        />
      </div>

      {/* Info bar */}
      <div className="p-4">
        <h3 className="font-semibold text-text-primary text-sm leading-relaxed line-clamp-2">
          {video.title}
        </h3>
        <p className="text-xs text-text-secondary mt-1">
          最新影片 · {video.date}
        </p>
      </div>

      {/* Nav dots */}
      {data.videos.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
          {data.videos.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); setAutoplay(false); }}
              className={`w-2 h-2 rounded-full transition-all ${
                i === current ? "bg-accent w-4" : "bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}

      {/* Autoplay toggle */}
      <button
        onClick={() => setAutoplay(!autoplay)}
        className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full bg-dark/60 text-white/80 hover:bg-dark/80 transition-colors"
      >
        {autoplay ? "⏸ 暫停" : "▶ 自動播放"}
      </button>
    </div>
  );
}
