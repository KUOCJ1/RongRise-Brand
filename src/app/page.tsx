import Link from "next/link";
import type { Metadata } from "next";

/* ============================================
   首頁 Home Page
   ============================================ */

export const metadata: Metadata = {
  title: "AI 轉型 × 人才策略 × ESG 永續",
  description:
    "榕耀管顧協助企業從人才策略到 AI 落地，驅動永續成長。C.J. Kuo 老師 16 年跨國企業顧問經驗，提供 AI 轉型策略、人才發展、ESG 永續諮詢。",
  openGraph: {
    title: "榕耀管顧 RongRise Consulting｜AI 轉型 × 人才策略 × ESG 永續",
    description:
      "協助企業從人才策略到 AI 落地，驅動永續成長。C.J. Kuo 老師專業諮詢。",
    images: [{ url: "https://rong-rise.com/images/og-image.jpg", width: 1200, height: 630, alt: "榕耀管顧 RongRise Consulting" }],
  },
};

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
              <span className="text-sm font-medium">智慧轉型，創新未來</span>
            </div>
            <h1 className="heading-hero mb-6 animate-fade-in-up">
              從人才策略到
              <br />
              <span className="text-tertiary-light">AI 落地</span>
            </h1>
            <p className="text-body-lg text-white/85 mb-8 animate-fade-in-up animation-delay-200">
              協助企業驅動永續成長，讓前瞻思維與務實方案結合，
              在 AI 時代中搶得先機。
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up animation-delay-300">
              <Link href="/about#contact" className="btn-primary bg-white text-primary font-bold hover:bg-white/95 shadow-lg shadow-white/20">
                預約諮詢
              </Link>
              <Link href="/knowledge" className="btn-secondary bg-white/15 border-white/50 text-white font-semibold hover:bg-white/25 hover:border-white shadow-md shadow-white/10">
                探索知識庫
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section bg-bg-alt">
        <div className="section-inner">
          <div className="text-center mb-12">
            <span className="tag mb-4">核心服務</span>
            <h2 className="heading-section text-dark mt-4">驅動企業轉型的三大支柱</h2>
            <div className="brand-divider brand-divider-center mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🤖",
                title: "AI 轉型策略",
                desc: "從評估、規劃到落地，打造企業專屬的 AI 轉型藍圖。協助管理層建立 AI 思維，導入自動化流程，提升營運效率。",
                tag: "AI",
              },
              {
                icon: "👥",
                title: "人才發展策略",
                desc: "建構面向未來的人才梯隊，結合數位能力培訓與組織變革管理，讓企業在轉型中不失去核心競爭力。",
                tag: "人才",
              },
              {
                icon: "🌱",
                title: "ESG 永續發展",
                desc: "將永續理念融入企業策略，建立可衡量的 ESG 指標體系，創造企業社會價值與商業效益的雙贏局面。",
                tag: "ESG",
              },
            ].map((service, i) => (
              <div
                key={i}
                className="card group animate-fade-in-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <span className="tag mb-3">{service.tag}</span>
                <h3 className="heading-subsection text-dark mb-3">{service.title}</h3>
                <p className="text-text-secondary text-body leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-10">
            <Link href="/services" className="btn-secondary">
              查看完整服務項目 →
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="section">
        <div className="section-inner">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="tag mb-4">關於 C.J. Kuo</span>
              <h2 className="heading-section mt-4 mb-4">
                專業、創新、務實的
                <br />
                <span className="text-primary">顧問夥伴</span>
              </h2>
              <div className="brand-divider mb-6" />
              <p className="text-text-secondary text-body-lg mb-4">
                C.J. Kuo 老師擁有多年企業顧問經驗，專注於協助中小型企業在數位浪潮中穩健轉型。
              </p>
              <p className="text-text-secondary text-body mb-6">
                以數據為基礎，以策略為核心，以落地為目標——不只是提出方案，更陪伴企業走完轉型的每一步。
              </p>
              <Link href="/about" className="btn-secondary">
                了解更多 →
              </Link>
            </div>
            <div className="bg-gradient-hero rounded-2xl p-8 md:p-10 text-white">
              <blockquote className="text-lg md:text-xl leading-relaxed font-medium mb-6 text-white">
                「真正的轉型不是技術升級，而是思維的革新。當人才、策略與科技三者對齊，企業就能在變動中創造持續的競爭優勢。」
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30 flex-shrink-0">
                  <img
                    src="/images/cj-photo.jpg"
                    alt="郭鎮榕 C.J. Kuo"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={48}
                    height={48}
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm">郭鎮榕 C.J. Kuo</p>
                  <p className="text-white/70 text-xs">榕耀管顧創辦人</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Knowledge Preview Section */}
      <section className="section bg-gradient-subtle">
        <div className="section-inner">
          <div className="text-center mb-12">
            <span className="tag mb-4">精選內容</span>
            <h2 className="heading-section text-dark mt-4">最新知識分享</h2>
            <div className="brand-divider brand-divider-center mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {[
              {
                slug: "hr-ai-transformation-five-layers",
                cat: "人才策略",
                title: "HR 的 AI 轉型五層責任架構",
                date: "2026.05.29",
                excerpt: "MIT 研究 300 個企業案例，95% 的 AI 沒有產生可衡量的損益影響。問題不在技術，在於組織摩擦力。",
              },
              {
                slug: "ai-transformation-trends-2026",
                cat: "AI 轉型",
                title: "2026 AI 轉型四大趨勢",
                date: "2026.05.28",
                excerpt: "邊緣 AI 爆發、AI Agent 上工、AI 資安告急、政府補助加速——深度解析今年最關鍵的四大轉型趨勢。",
              },
              {
                slug: "strategy-subtraction-traditional-industry",
                cat: "策略管理",
                title: "策略是減法：為什麼傳產企業更需要學會「不做事」",
                date: "2026.05.29",
                excerpt: "資源已經燒光了，大家還在做加法。從傳統產業三重壓力到 Netflix 關鍵轉折，解析為什麼減法這麼難。",
              },
            ].map((post, i) => (
              <Link
                key={i}
                href={`/knowledge/${post.slug}`}
                className="card group no-underline block"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="tag">{post.cat}</span>
                  <span className="text-xs text-text-secondary">{post.date}</span>
                </div>
                <h3 className="heading-subsection text-dark group-hover:text-primary transition-colors mb-2">
                  {post.title}
                </h3>
                <p className="text-text-secondary text-body-sm">{post.excerpt}</p>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link href="/knowledge" className="btn-secondary">
              查看全部文章 →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="heading-section text-white mb-4">
            準備好啟動您的轉型之旅了嗎？
          </h2>
          <p className="text-white/80 text-body-lg mb-8">
            無論您正處於轉型的哪個階段，我們都能提供專業且務實的建議。
            讓我們一起探索適合您企業的最佳路徑。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/about#contact" className="btn-primary">
              立即預約諮詢
            </Link>
            <Link href="/assistant" className="btn-secondary border-white/40 text-white hover:bg-white/15 hover:border-white">
              先問問小幫手
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
