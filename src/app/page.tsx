import Link from "next/link";
import ScrollTracker from "@/components/ScrollTracker";
import { trackCTALabel } from "@/lib/ga4-events";
import TrackLink from "@/components/TrackLink";
import CaseStudiesSection from "@/components/CaseStudies";
import TestimonialsSection from "@/components/Testimonials";
import VideoShowcaseSection from "@/components/VideoShowcase";
import NewsletterSection from "@/components/Newsletter";
import ReviewSchema from "@/components/ReviewSchema";
import { coverImg } from "@/lib/cover-map";

export const metadata = {
  title: "榕耀管顧 RongRise Consulting｜AI 轉型 × 人才策略 × ESG 永續",
  description: "協助企業從人才策略到 AI 落地，驅動永續成長。CJ哥專業顧問品牌，聚焦 AI 轉型、人才策略、ESG 永續發展。",
  alternates: {
    canonical: "https://rong-rise.com",
    languages: {
      en: "https://rong-rise.com/en",
    },
  },
  openGraph: {
    images: [{ url: "https://rong-rise.com/images/og-image.jpg", width: 1200, height: 630, alt: "榕耀管顧 RongRise Consulting" }],
  },
};

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
      <ScrollTracker />

      {/* ═══ 1. Hero Section ═══ */}
      <section className="bg-gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/images/hero-bg.jpg" alt="" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-[#0D2B4E]/70" />
        </div>
        <div className="hero-bg-svg z-10" aria-hidden="true">
          <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <g className="grid-float" opacity="0.06">
              {Array.from({ length: 13 }, (_, i) => (
                <line key={`vl-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="600" stroke="white" strokeWidth="1" />
              ))}
              {Array.from({ length: 7 }, (_, i) => (
                <line key={`hl-${i}`} x1="0" y1={i * 100} x2="1200" y2={i * 100} stroke="white" strokeWidth="1" />
              ))}
            </g>
            <line className="hero-line hero-line-1" x1="100" y1="150" x2="300" y2="80" stroke="#E8912A" strokeWidth="1.5" />
            <line className="hero-line hero-line-2" x1="300" y1="80" x2="500" y2="180" stroke="#2EC4B6" strokeWidth="1" />
            <line className="hero-line hero-line-3" x1="500" y1="180" x2="700" y2="100" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <line className="hero-line hero-line-4" x1="700" y1="100" x2="900" y2="200" stroke="#E8912A" strokeWidth="1.5" />
            <line className="hero-line hero-line-5" x1="200" y1="300" x2="600" y2="250" stroke="#2EC4B6" strokeWidth="1" />
            <line className="hero-line hero-line-1" x1="600" y1="250" x2="1000" y2="350" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <line className="hero-line hero-line-3" x1="350" y1="400" x2="550" y2="480" stroke="#E8912A" strokeWidth="1" />
            <line className="hero-line hero-line-5" x1="550" y1="480" x2="850" y2="450" stroke="#2EC4B6" strokeWidth="1" />
            <circle className="hero-node hero-node-1" cx="100" cy="150" r="3" fill="#E8912A" />
            <circle className="hero-node hero-node-2" cx="300" cy="80" r="4" fill="#2EC4B6" />
            <circle className="hero-node hero-node-3" cx="500" cy="180" r="3" fill="rgba(255,255,255,0.5)" />
            <circle className="hero-node hero-node-4" cx="700" cy="100" r="4" fill="#E8912A" />
            <circle className="hero-node hero-node-5" cx="900" cy="200" r="3" fill="#2EC4B6" />
            <circle className="hero-node hero-node-6" cx="200" cy="300" r="3" fill="rgba(255,255,255,0.4)" />
            <circle className="hero-node hero-node-1" cx="600" cy="250" r="4" fill="#E8912A" />
            <circle className="hero-node hero-node-2" cx="1000" cy="350" r="3" fill="#2EC4B6" />
            <circle className="hero-node hero-node-3" cx="350" cy="400" r="3" fill="rgba(255,255,255,0.5)" />
            <circle className="hero-node hero-node-4" cx="550" cy="480" r="4" fill="#E8912A" />
            <circle className="hero-node hero-node-5" cx="850" cy="450" r="3" fill="#2EC4B6" />
            <polygon className="hero-node hero-node-2" points="1050,400 1080,385 1080,415 1050,430 1020,415 1020,385" fill="none" stroke="#E8912A" strokeWidth="1" opacity="0.4" />
            <polygon className="hero-node hero-node-4" points="150,500 170,490 170,510 150,520 130,510 130,490" fill="none" stroke="#2EC4B6" strokeWidth="1" opacity="0.3" />
            <circle className="hero-line hero-line-2" cx="400" cy="300" r="120" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="8 8" />
            <circle className="hero-line hero-line-4" cx="800" cy="400" r="80" fill="none" stroke="rgba(232,145,42,0.1)" strokeWidth="1" strokeDasharray="6 6" />
          </svg>
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
              <TrackLink href="/about#contact" className="btn-primary bg-white text-primary font-bold hover:bg-white/95 shadow-lg shadow-white/20 animate-pulse-glow" trackLabel="預約免費諮詢" trackLocation="hero">
                預約免費諮詢
              </TrackLink>
              <TrackLink href="/knowledge" className="btn-secondary bg-white/10 border-white/40 text-white font-semibold hover:bg-white/20 hover:backdrop-blur-sm" trackLabel="探索知識庫" trackLocation="hero">
                探索知識庫
              </TrackLink>
            </div>
          </div>

          {/* 數據指標 */}
          <div className="mt-12 lg:absolute lg:right-8 lg:top-1/2 lg:-translate-y-1/2 lg:mt-0">
            <div className="flex items-center gap-4 sm:gap-6 lg:flex-col lg:gap-4 lg:w-56">
              <HeroStat number="16+" label="年跨國人資經驗" dark />
              <div className="w-px h-8 bg-white/20 lg:w-full lg:h-px" />
              <HeroStat number="8" label="座優良職場獎" dark />
              <div className="w-px h-8 bg-white/20 lg:w-full lg:h-px" />
              <HeroStat number="300+" label="家企業服務" dark />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2. 服務 + 流程（合併）═══ */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/images/services-bg.jpg" alt="" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-[#FDFCFA]/85" />
        </div>
        <div className="section-inner relative z-10">
          <div className="text-center mb-14">
            <span className="tag mb-4">核心服務</span>
            <h2 className="heading-section text-dark mt-4">驅動企業轉型的三大支柱</h2>
            <div className="brand-divider brand-divider-center mt-4 brand-divider-animated" />
            <p className="text-text-secondary text-body-lg mt-6 max-w-2xl mx-auto">
              從 AI 策略、人才發展到 ESG 永續，三位一體的轉型框架，協助企業建立持久的競爭優勢。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <ServiceCard delay={0} icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-tertiary"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" /><path d="M12 22a2 2 0 0 1 2-2v-2a2 2 0 0 1-2-2 2 2 0 0 1-2 2v2a2 2 0 0 1 2 2z" /><path d="M22 12a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2 2 2 0 0 1 2-2h2a2 2 0 0 1 2 2z" /><path d="M2 12a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" /><circle cx="12" cy="12" r="3" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>} title="AI 轉型策略" desc="從評估、規劃到落地，打造企業專屬的 AI 轉型藍圖。協助管理層建立 AI 思維，導入自動化流程，提升營運效率。" tag="AI" />
            <ServiceCard delay={150} icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>} title="人才發展策略" desc="建構面向未來的人才梯隊，結合數位能力培訓與組織變革管理，讓企業在轉型中不失去核心競爭力。" tag="人才" />
            <ServiceCard delay={300} icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>} title="ESG 永續發展" desc="將永續理念融入企業策略，建立可衡量的 ESG 指標體系，創造企業社會價值與商業效益的雙贏局面。" tag="ESG" />
          </div>

          {/* 服務流程 */}
          <div className="max-w-3xl mx-auto">
            <h3 className="heading-subsection text-dark text-center mb-8">我們的合作方式</h3>
            <div className="space-y-6">
              {[
                { step: "01", icon: "🔍", title: "免費診斷", desc: "30 分鐘深度對談，了解企業現況與目標" },
                { step: "02", icon: "📊", title: "現況評估", desc: "全面盤點組織能力、AI 成熟度、ESG 差距" },
                { step: "03", icon: "📋", title: "策略規劃", desc: "客製化轉型藍圖 + 導入路線圖" },
                { step: "04", icon: "🚀", title: "落地執行", desc: "陪伴式導入，從 PoC 到全面落地" },
                { step: "05", icon: "📈", title: "成效追蹤", desc: "KPI 體系 + 持續優化" },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-primary/10 flex items-center justify-center flex-shrink-0 shadow-sm text-xl">
                    {item.icon}
                  </div>
                  <div className="pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-tertiary tracking-wider">STEP {item.step}</span>
                      <span className="font-semibold text-dark">{item.title}</span>
                    </div>
                    <p className="text-text-secondary text-body-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <TrackLink href="/services" className="btn-primary" trackLabel="查看完整服務項目" trackLocation="services">
              查看完整服務項目 →
            </TrackLink>
          </div>
        </div>
      </section>

      {/* ═══ 3. 客戶案例 ═══ */}
      <CaseStudiesSection />

      {/* ═══ 4. 關於 + 推薦（合併）═══ */}
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
                CJ哥擁有多年企業顧問經驗，專注於協助中小型企業在數位浪潮中穩健轉型。
              </p>
              <p className="text-text-secondary text-body mb-6">
                以數據為基礎，以策略為核心，以落地為目標——不只是提出方案，更陪伴企業走完轉型的每一步。
              </p>
              <div className="flex flex-wrap gap-3">
                <TrackLink href="/about" className="btn-secondary" trackLabel="了解更多" trackLocation="about_preview">
                  了解更多 →
                </TrackLink>
                <TestimonialsSection />
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden p-8 md:p-10 text-white">
              <div className="absolute inset-0 z-0">
                <img src="/images/about-quote-bg.jpg" alt="" className="w-full h-full object-cover object-center" />
                <div className="absolute inset-0 bg-[#0D2B4E]/80" />
              </div>
              <blockquote className="relative z-10 text-lg md:text-xl leading-relaxed font-medium mb-6 text-white">
                「真正的轉型不是技術升級，而是思維的革新。當人才、策略與科技三者對齊，企業就能在變動中創造持續的競爭優勢。」
              </blockquote>
              <div className="relative z-10 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30 flex-shrink-0">
                  <img src="/images/cj-portrait-full.jpg" alt="郭鎮榕 C.J. Kuo" className="w-full h-full object-cover" loading="lazy" width={48} height={48} />
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
      <ReviewSchema />

      {/* ═══ 5. 知識預覽 ═══ */}
      <section className="section bg-gradient-subtle">
        <div className="section-inner">
          <div className="text-center mb-12">
            <span className="tag mb-4">精選內容</span>
            <h2 className="heading-section text-dark mt-4">最新知識分享</h2>
            <div className="brand-divider brand-divider-center mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {[
              { slug: "hr-ai-transformation-five-layers", cat: "人才策略", title: "HR 的 AI 轉型五層責任架構", date: "2026.05.29", excerpt: "MIT 研究 300 個企業案例，95% 的 AI 沒有產生可衡量的損益影響。問題不在技術，在於組織摩擦力。" },
              { slug: "ai-transformation-trends-2026", cat: "AI 轉型", title: "2026 AI 轉型四大趨勢", date: "2026.05.28", excerpt: "邊緣 AI 爆發、AI Agent 上工、AI 資安告急、政府補助加速——深度解析今年最關鍵的四大轉型趨勢。" },
              { slug: "strategy-subtraction-traditional-industry", cat: "策略管理", title: "策略是減法：為什麼傳產企業更需要學會「不做事」", date: "2026.05.29", excerpt: "資源已經燒光了，大家還在做加法。從傳統產業三重壓力到 Netflix 關鍵轉折，解析為什麼減法這麼難。" },
            ].map((post, i) => (
              <Link key={i} href={`/knowledge/${post.slug}`} className="card card-3d group no-underline block overflow-hidden">
                <div className="h-40 overflow-hidden">
                  <img src={coverImg(post.slug)} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="card-inner">
                  <div className="flex items-center justify-between mb-3">
                    <span className="tag">{post.cat}</span>
                    <span className="text-xs text-text-secondary">{post.date}</span>
                  </div>
                  <h3 className="heading-subsection text-dark group-hover:text-primary transition-colors mb-2">{post.title}</h3>
                  <p className="text-text-secondary text-body-sm">{post.excerpt}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    閱讀更多
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <TrackLink href="/knowledge" className="btn-secondary" trackLabel="查看全部文章" trackLocation="knowledge_preview">
              查看全部文章 →
            </TrackLink>
          </div>
        </div>
      </section>

      {/* ═══ 6. 影片展示 ═══ */}
      <VideoShowcaseSection />

      {/* ═══ 7. 訂閱電子報 ═══ */}
      <NewsletterSection />

      {/* ═══ 8. CTA（最終轉換）═══ */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/images/cta-bg.jpg" alt="" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-[#0D2B4E]/85" />
        </div>
        <div className="absolute inset-0 opacity-[0.07]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cta-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-grid)" />
          </svg>
        </div>
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="heading-section text-white mb-4">準備好啟動您的轉型之旅了嗎？</h2>
          <p className="text-white/80 text-body-lg mb-8">
            無論您正處於轉型的哪個階段，我們都能提供專業且務實的建議。
            讓我們一起探索適合您企業的最佳路徑。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <TrackLink href="/about#contact" className="btn-primary" trackLabel="立即預約諮詢" trackLocation="cta_section">
              立即預約諮詢
            </TrackLink>
            <TrackLink href="/assistant" className="btn-secondary border-white/40 text-white hover:bg-white/15 hover:border-white" trackLabel="先問問小幫手" trackLocation="cta_section">
              先問問小幫手
            </TrackLink>
          </div>
        </div>
      </section>
    </>
  );
}

function HeroStat({ number, label, dark = false }: { number: string; label: string; dark?: boolean }) {
  return (
    <div className="text-center">
      <div className={`text-2xl sm:text-3xl font-bold ${dark ? "text-tertiary" : "text-white"}`}>{number}</div>
      <div className="text-xs mt-1 text-white/60">{label}</div>
    </div>
  );
}
