import Link from "next/link";
import type { Metadata } from "next";
import newsletters from "@/data/newsletters.json";

export const metadata: Metadata = {
  title: "電子報｜榕賀觀點 AI 週報｜榕耀管顧",
  description: "小賀每週為你整理最重要的 AI 轉型趨勢、ESG 實務攻略、課程優惠。所有期數一次看，掌握企業 AI 落地最新動態。",
  alternates: {
    canonical: "https://rong-rise.com/newsletter",
  },
  openGraph: {
    title: "電子報｜榕賀觀點 AI 週報 — 榕耀管顧",
    description: "小賀每週為你整理最重要的 AI 轉型趨勢、ESG 實務攻略、課程優惠。",
    images: [{ url: "https://rong-rise.com/images/og-image.jpg", width: 1200, height: 630, alt: "榕耀管顧 RongRise Consulting" }],
  },
};

export default function NewsletterPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-hero text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <span className="tag bg-white/15 text-white mb-4">電子報</span>
          <h1 className="heading-hero mt-4 mb-4">榕賀觀點 AI 週報</h1>
          <p className="text-body-lg text-white/85 max-w-2xl">
            小賀每週為你整理最重要的 AI 轉型趨勢、ESG 實務攻略、課程優惠。不發廢文，只送有價值的內容。
          </p>
        </div>
      </section>

      {/* Newsletter List */}
      <section className="section">
        <div className="section-inner">
          <h2 className="sr-only">所有期數</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {newsletters.newsletters.map((nl) => (
              <Link
                key={nl.id}
                href={`/newsletter/${nl.slug}`}
                className="card block no-underline group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                  {/* Date */}
                  <div className="flex-shrink-0 text-center sm:min-w-[70px]">
                    <div className="text-xs text-text-secondary font-medium">
                      {new Date(nl.date).toLocaleDateString('zh-TW', { month: 'long' })}
                    </div>
                    <div className="text-3xl font-bold text-primary">
                      {new Date(nl.date).getDate()}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {new Date(nl.date).getFullYear()}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-tertiary/10 text-tertiary">
                        {nl.week}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-primary/10 text-primary">
                        {nl.id === "2026-W24" ? "創刊號" : "正式期"}
                      </span>
                    </div>
                    <h3 className="heading-subsection text-dark group-hover:text-primary transition-colors mb-2">
                      {nl.title}
                    </h3>
                    <p className="text-text-secondary text-body leading-relaxed">
                      {nl.summary}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="hidden sm:flex items-center flex-shrink-0 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Subscribe CTA */}
          <div className="text-center mt-12">
            <div className="bg-gradient-subtle rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="text-3xl mb-3">📬</div>
              <h3 className="heading-subsection text-dark mb-2">還沒訂閱？</h3>
              <p className="text-text-secondary text-body mb-4">
                每週日晚上 6 點，小賀直接把最新趨勢送到你的信箱。
              </p>
              <Link href="/#newsletter" className="btn-primary">
                免費訂閱電子報
              </Link>
            </div>
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
