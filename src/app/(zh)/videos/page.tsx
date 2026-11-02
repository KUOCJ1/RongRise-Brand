import Link from "next/link";
import type { Metadata } from "next";
import videos from "@/data/youtube-videos.json";

export const metadata: Metadata = {
  title: "影音專區｜策略、AI 與管理實作｜榕耀管顧",
  description:
    "榕耀管顧影音專區：策略規劃、AI 協作、組織設計與管理實作的影片，附完整文章連結與章節時間點。",
  alternates: {
    canonical: "https://rong-rise.com/videos",
  },
  openGraph: {
    title: "影音專區｜策略、AI 與管理實作",
    description: "把管理做深，讓 AI 落地。影片與對應文章。",
    images: [
      {
        url: "https://rong-rise.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "榕耀管顧 RongRise Consulting",
      },
    ],
  },
};

interface VideoItem {
  id: string;
  title: string;
  date: string;
  description?: string;
  thumbnail?: string;
  thumbnailFallback?: string;
  url: string;
}

const list = (videos.videos as VideoItem[]) || [];
const [featured, ...rest] = list;

function fmt(d: string) {
  return d ? d.replace(/-/g, ".") : "";
}

export default function VideosPage() {
  return (
    <>
      <section className="bg-gradient-hero text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <span className="tag bg-white/15 text-white mb-4">影音專區</span>
          <h1 className="heading-hero mt-4 mb-4">用看的，比用讀的快</h1>
          <p className="text-body-lg text-white/85 max-w-2xl">
            每支影片都對應一篇完整文章。影片給節奏，文章給細節。
          </p>
        </div>
      </section>

      {featured && (
        <section className="section">
          <div className="section-inner">
            <div className="max-w-4xl mx-auto">
              <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black/90 shadow-lg">
                <iframe
                  src={`https://www.youtube.com/embed/${featured.id}`}
                  title={featured.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="mt-6">
                <div className="text-sm text-text-secondary mb-2">{fmt(featured.date)}</div>
                <h2 className="heading-2 mb-3">{featured.title}</h2>
                {featured.description && (
                  <p className="text-body text-text-secondary">{featured.description}</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="section bg-surface">
        <div className="section-inner">
          <h2 className="heading-2 mb-8">所有影片</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((v) => (
              <a
                key={v.id}
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card block no-underline group overflow-hidden"
              >
                <div className="aspect-video w-full overflow-hidden rounded-xl bg-black/90 mb-4">
                  <img
                    src={v.thumbnail || v.thumbnailFallback}
                    alt={v.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="text-sm text-text-secondary mb-2">{fmt(v.date)}</div>
                <h3 className="text-lg font-bold leading-snug mb-2">{v.title}</h3>
                {v.description && (
                  <p className="text-sm text-text-secondary line-clamp-3">{v.description}</p>
                )}
              </a>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/knowledge" className="btn-secondary no-underline">
              看完整文章 →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
