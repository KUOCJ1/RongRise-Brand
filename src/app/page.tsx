import Link from "next/link";

export const metadata = {
  title: "AI 轉型 × 人才策略 × ESG 永續",
  description: "協助企業從人才策略到 AI 落地，驅動永續成長。C.J. Kuo 老師專業顧問品牌，聚焦 AI 轉型、人才策略、ESG 永續發展。",
  openGraph: {
    images: [{ url: "https://rong-rise.com/images/og-image.jpg", width: 1200, height: 630, alt: "榕耀管顧 RongRise Consulting" }],
  },
};

function FloatingIcon({ children, delay = "0s" }: { children: React.ReactNode; delay?: string }) {
  return (
    <div className="animate-float-slow" style={{ animationDelay: delay }}>
      {children}
    </div>
  );
}

function ServiceCard({ icon, title, desc, tag, delay }: { icon: React.ReactNode; title: string; desc: string; tag: string; delay: number }) {
  return (
    <div
      className="card card-3d group animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="card-inner relative">
        <div className="absolute -top-3 -right-3 w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center text-2xl animate-badge-bounce" style={{ animationDelay: `${delay + 300}ms` }}>
          {icon}
        </div>
        <span className="tag mb-3">{tag}</span>
        <h3 className="heading-subsection text-dark mb-3 group-hover:text-primary transition-colors">{title}</h3>
        <div className="brand-divider mb-3" style={{ width: "30px", height: "2px" }} />
        <p className="text-text-secondary text-body leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white">
        {/* 粒子層 */}
        <div className="particles" aria-hidden="true">
          <span className="particle particle-1" />
          <span className="particle particle-2" />
          <span className="particle particle-3" />
          <span className="particle particle-4" />
          <span className="particle particle-5" />
          <span className="particle particle-6" />
        </div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-20 md:py-28 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-8 border border-white/10 animate-fade-in-up">
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse-glow" />
              <span className="text-sm font-medium tracking-wide">智慧轉型，創新未來</span>
            </div>
            <h1 className="heading-hero mb-6 animate-fade-in-up animation-delay-100">
              從人才策略到
              <br />
              <span className="hero-highlight">AI 落地</span>
            </h1>
            <p className="text-body-lg text-white/80 mb-10 animate-fade-in-up animation-delay-200 leading-relaxed">
              協助企業驅動永續成長，讓前瞻思維與務實方案結合，
              在 AI 時代中搶得先機。
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up animation-delay-300">
              <Link href="/about#contact" className="btn-primary bg-white text-primary font-bold hover:bg-white/95 shadow-lg shadow-white/20 animate-pulse-glow">
                預約免費諮詢
              </Link>
              <Link href="/knowledge" className="btn-secondary bg-white/10 border-white/40 text-white font-semibold hover:bg-white/20 hover:backdrop-blur-sm">
                探索知識庫
              </Link>
            </div>
          </div>

          {/* 右側裝飾 */}
          <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2">
            <FloatingIcon delay="0s">
              <div className="w-64 h-64 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 flex flex-col justify-center items-center gap-4 animate-float-slow" style={{ animationDuration: "8s" }}>
                <HeroStat number="16+" label="年跨國人資經驗" />
                <div className="w-full h-px bg-white/10" />
                <HeroStat number="8" label="座優良職場獎" />
                <div className="w-full h-px bg-white/10" />
                <HeroStat number="300+" label="家企業服務" />
              </div>
            </FloatingIcon>
          </div>
        </div>
      </section>

      {/* 核心服務 */}
      <section className="section bg-bg-alt">
        <div className="section-inner">
          <div className="text-center mb-14">
            <span className="tag mb-4">核心服務</span>
            <h2 className="heading-section text-dark mt-4">驅動企業轉型的三大支柱</h2>
            <div className="brand-divider brand-divider-center mt-4" />
            <p className="text-text-secondary text-body-lg mt-6 max-w-2xl mx-auto">
              從 AI 策略、人才發展到 ESG 永續，三位一體的轉型框架，協助企業建立持久的競爭優勢。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard
              delay={0}
              icon={
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-tertiary">
                  <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                  <path d="M12 22a2 2 0 0 1 2-2v-2a2 2 0 0 1-2-2 2 2 0 0 1-2 2v2a2 2 0 0 1 2 2z" />
                  <path d="M22 12a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2 2 2 0 0 1 2-2h2a2 2 0 0 1 2 2z" />
                  <path d="M2 12a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              }
              title="AI 轉型策略"
              desc="從評估、規劃到落地，打造企業專屬的 AI 轉型藍圖。協助管理層建立 AI 思維，導入自動化流程，提升營運效率。"
              tag="AI"
            />
            <ServiceCard
              delay={150}
              icon={
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              }
              title="人才發展策略"
              desc="建構面向未來的人才梯隊，結合數位能力培訓與組織變革管理，讓企業在轉型中不失去核心競爭力。"
              tag="人才"
            />
            <ServiceCard
              delay={300}
              icon={
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              }
              title="ESG 永續發展"
              desc="將永續理念融入企業策略，建立可衡量的 ESG 指標體系，創造企業社會價值與商業效益的雙贏局面。"
              tag="ESG"
            />
          </div>

          <div className="text-center mt-12">
            <Link href="/services" className="btn-primary">
              查看完整服務項目 →
            </Link>
          </div>
        </div>
      </section>

      {/* 關於預覽 */}
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

      {/* 知識預覽 */}
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
                className="card card-3d group no-underline block"
              >
                <div className="card-inner">
                  <div className="flex items-center justify-between mb-3">
                    <span className="tag">{post.cat}</span>
                    <span className="text-xs text-text-secondary">{post.date}</span>
                  </div>
                  <h3 className="heading-subsection text-dark group-hover:text-primary transition-colors mb-2">
                    {post.title}
                  </h3>
                  <p className="text-text-secondary text-body-sm">{post.excerpt}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    閱讀更多
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
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

      {/* CTA */}
      <section className="bg-primary py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-grid)" />
          </svg>
        </div>
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 text-center relative z-10">
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

function HeroStat({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-tertiary">{number}</div>
      <div className="text-xs text-white/60 mt-1">{label}</div>
    </div>
  );
}
