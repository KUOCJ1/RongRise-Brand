import Link from "next/link";
import type { Metadata } from "next";
import news from "@/data/news.json";

export const metadata: Metadata = {
  title: "最新消息｜課程、資源、與觀點",
  description: "掌握榕耀管顧最新課程開課資訊、政府補助資源、與產業洞見。AI 轉型、人才策略、ESG 永續的第一手資訊。",
  alternates: {
    canonical: "https://rongrise.com/news",
    languages: {
      en: "https://rongrise.com/en/news",
    },
  },
  openGraph: {
    title: "最新消息｜課程、資源、與觀點 — 榕耀管顧",
    description: "掌握榕耀管顧最新課程開課資訊、政府補助資源、與產業洞見。",
    images: [{ url: "https://rong-rise.com/images/og-image.jpg", width: 1200, height: 630, alt: "榕耀管顧 RongRise Consulting" }],
  },
};

const categoryColors: Record<string, string> = {
  "課程": "bg-tertiary/10 text-tertiary",
  "媒體": "bg-secondary/10 text-secondary",
  "資源": "bg-accent/10 text-accent",
  "公告": "bg-primary/10 text-primary"
};

export default function NewsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-hero text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <span className="tag bg-white/15 text-white mb-4">最新消息</span>
          <h1 className="heading-hero mt-4 mb-4">課程、資源、與觀點</h1>
          <p className="text-body-lg text-white/85 max-w-2xl">
            掌握最新課程開課資訊、政府補助資源、與產業洞見。
          </p>
        </div>
      </section>

      {/* News List */}
      <section className="section">
        <div className="section-inner">
          <h2 className="sr-only">最新動態</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {news.news.map((item) => (
              <Link
                key={item.id}
                href={item.link}
                className="card block no-underline group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                  {/* Date */}
                  <div className="flex-shrink-0 text-center sm:min-w-[70px]">
                    <div className="text-xs text-text-secondary font-medium">
                      {new Date(item.date).toLocaleDateString('zh-TW', { month: 'long' })}
                    </div>
                    <div className="text-3xl font-bold text-primary">
                      {new Date(item.date).getDate()}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {new Date(item.date).getFullYear()}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${categoryColors[item.category] || 'bg-gray-100 text-gray-600'}`}>
                        {item.category}
                      </span>
                      {item.isNew && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-tertiary text-white font-bold">
                          NEW
                        </span>
                      )}
                    </div>
                    <h3 className="heading-subsection text-dark group-hover:text-primary transition-colors mb-2">
                      {item.title}
                    </h3>
                    <p className="text-text-secondary text-body leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Back */}
          <div className="text-center mt-10">
            <Link href="/" className="btn-secondary">
              ← 返回首頁
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
