import Link from "next/link";
import type { Metadata } from "next";

/* ============================================
   服務項目 Services Page
   ============================================ */

export const metadata: Metadata = {
  title: "服務項目｜AI 轉型．人才策略．ESG 永續｜榕耀管顧",
  description:
    "榕耀管顧三大服務：AI 轉型策略規劃、企業培訓工作坊、ESG 永續諮詢。依據企業需求客製化，從診斷到落地全程陪伴。",
  alternates: {
    canonical: "https://rongrise.com/services",
    languages: {
      en: "https://rongrise.com/en/services",
    },
  },
  openGraph: {
    title: "服務項目｜AI 轉型．人才策略．ESG 永續 — 榕耀管顧",
    description: "三大服務支柱，陪伴企業完成轉型每一步。",
    images: [{ url: "https://rong-rise.com/images/og-image.jpg", width: 1200, height: 630, alt: "榕耀管顧 RongRise Consulting" }],
  },
};

interface ServiceItem {
  icon: string;
  title: string;
  tagline: string;
  desc: string;
  features: string[];
  cta: string;
  ctaHref: string;
}

const services: ServiceItem[] = [
  {
    icon: "🤖",
    title: "顧問服務",
    tagline: "AI 轉型策略 × 永續治理", 
    desc: "為企業量身打造可執行的轉型藍圖。從現況評估、策略規劃到落地導入，CJ哥以 16 年跨國企業高階主管經驗，協助您在 AI 時代中找到最適合的發展路徑。",
    features: [
      "AI 轉型成熟度評估與策略規劃",
      "人機協作流程設計與導入",
      "AI 治理框架與風險管理",
      "永續供應鏈 ESG 治理導入",
      "組織變革管理與變革溝通",
      "PoC 設計、執行與成效追蹤",
    ],
    cta: "預約 30 分鐘免費診斷",
    ctaHref: "/about#contact",
  },
  {
    icon: "🎓",
    title: "教學",
    tagline: "企業培訓 × 工作坊",
    desc: "從單日工作坊到系列課程，依企業需求客製化培訓內容。理論與實作並重，讓學員在課堂後能立即將所學應用於工作中。",
    features: [
      "AI 實戰營：從入門到企業落地",
      "Agentic AI 轉型高階共識營",
      "RTIF 提示工程實戰工作坊",
      "AI 世代人才策略地圖",
      "ESG 永續人才培育課程",
      "績效管理與 GROW 教練技術",
    ],
    cta: "查看課程總覽",
    ctaHref: "/knowledge",
  },
  {
    icon: "💬",
    title: "諮詢",
    tagline: "線上諮詢 × 即時回覆",
    desc: "透過網站小幫手，您可以隨時提問關於 AI 轉型、人才發展、ESG 永續的任何問題。小幫手彙整了 CJ哥的完整知識庫，提供專業且即時的回覆。如需深度顧問服務，歡迎聯繫安排正式諮詢。",
    features: [
    "AI 工具選型建議與比較",
      "轉型策略常見問題解答",
      "政府補助申請指引",
      "ESG 合規與報告書諮詢",
      "組織人才策略建議",
      "一對一深度顧問預約",
    ],
    cta: "問問小幫手",
    ctaHref: "/assistant",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-hero text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <span className="tag bg-white/15 text-white mb-4">服務項目</span>
          <h1 className="heading-hero mt-4 mb-4">三大服務支柱</h1>
          <p className="text-body-lg text-white/85 max-w-2xl">
            無論您正處於轉型的哪個階段，都能找到最適合的服務模式。
            從深度的顧問輔導、實戰的工作坊培訓，到即時的線上諮詢。
          </p>
        </div>
      </section>

      {/* Services Cards */}
      <section className="section bg-bg-alt">
        <div className="section-inner">
          <div className="space-y-8">
            {services.map((service, i) => (
              <div
                key={i}
                className="card bg-white border border-border rounded-2xl overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-gradient-subtle p-6 md:p-8 border-b border-border-light">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                      <span className="text-3xl">{service.icon}</span>
                    </div>
                    <div>
                      <h2 className="heading-subsection text-text-primary">{service.title}</h2>
                      <p className="text-primary font-medium text-sm mt-1">{service.tagline}</p>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 md:p-8">
                  <p className="text-text-secondary text-body leading-relaxed mb-6">
                    {service.desc}
                  </p>

                  <h3 className="font-semibold text-text-primary text-sm mb-3">服務內容</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {service.features.map((feat, fi) => (
                      <div key={fi} className="flex items-start gap-2">
                        <span className="text-primary flex-shrink-0 mt-0.5">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="text-text-secondary text-sm">{feat}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={service.ctaHref}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    {service.cta}
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="section">
        <div className="section-inner">
          <div className="bg-gradient-hero rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-1">16+</div>
                <div className="text-white/70 text-sm">年跨國顧問經驗</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-1">8</div>
                <div className="text-white/70 text-sm">座優良雇主獎</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-1">3+</div>
                <div className="text-white/70 text-sm">梯次公開班開設</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-1">多產業</div>
                <div className="text-white/70 text-sm">跨領域服務經驗</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Guide */}
      <section className="section bg-gradient-subtle">
        <div className="section-inner">
          <div className="text-center mb-12">
            <span className="tag mb-4">服務費用</span>
            <h2 className="heading-section text-text-primary mt-4">依企業規模，最適合的方案</h2>
            <div className="brand-divider brand-divider-center mt-4" />
            <p className="text-text-secondary text-body-lg mt-4 max-w-2xl mx-auto">
              我們相信每個企業的轉型路徑都不同。依據您的規模、需求與預算，提供最適合的服務組合。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* 免費診斷 */}
            <div className="card text-center flex flex-col">
              <div className="text-3xl mb-4">🔍</div>
              <h3 className="heading-subsection text-text-primary mb-2">免費診斷</h3>
              <div className="text-3xl font-bold text-primary mb-1">$0</div>
              <div className="text-text-secondary text-sm mb-4">30 分鐘</div>
              <ul className="text-left space-y-2 mb-6 flex-1">
                <li className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-primary">✓</span> 企業現況了解
                </li>
                <li className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-primary">✓</span> 初步挑戰診斷
                </li>
                <li className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-primary">✓</span> 轉型方向建議
                </li>
                <li className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-primary">✓</span> 適合服務推薦
                </li>
              </ul>
              <Link href="/about#contact" className="btn-secondary w-full text-center">
                預約免費診斷
              </Link>
            </div>

            {/* 顧問服務 */}
            <div className="card text-center flex flex-col border-2 border-tertiary relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-tertiary text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                最受歡迎
              </div>
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="heading-subsection text-text-primary mb-2">顧問服務</h3>
              <div className="text-3xl font-bold text-primary mb-1">依需求</div>
              <div className="text-text-secondary text-sm mb-4">客製化報價</div>
              <ul className="text-left space-y-2 mb-6 flex-1">
                <li className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-tertiary">✓</span> AI 成熟度評估
                </li>
                <li className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-tertiary">✓</span> 轉型策略規劃
                </li>
                <li className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-tertiary">✓</span> PoC 設計與導入
                </li>
                <li className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-tertiary">✓</span> 組織變革管理
                </li>
                <li className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-tertiary">✓</span> 成效追蹤优化
                </li>
              </ul>
              <Link href="/about#contact" className="btn-primary w-full text-center">
                聯繫討論方案
              </Link>
            </div>

            {/* 培訓課程 */}
            <div className="card text-center flex flex-col">
              <div className="text-3xl mb-4">🎓</div>
              <h3 className="heading-subsection text-text-primary mb-2">培訓課程</h3>
              <div className="text-3xl font-bold text-primary mb-1">依人數</div>
              <div className="text-text-secondary text-sm mb-4">遠低於市價</div>
              <ul className="text-left space-y-2 mb-6 flex-1">
                <li className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-accent">✓</span> AI 實戰營（公開班）
                </li>
                <li className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-accent">✓</span> 企業內訓工作坊
                </li>
                <li className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-accent">✓</span> 高階共識營
                </li>
                <li className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-accent">✓</span> 客製化課程設計
                </li>
              </ul>
              <Link href="/knowledge" className="btn-secondary w-full text-center">
                查看課程資訊
              </Link>
            </div>
          </div>

          {/* 費用說明 */}
          <div className="text-center mt-8">
            <p className="text-text-secondary text-sm">
              💡 所有方案均以免費 30 分鐘診斷作為起點，確認需求後提供正式報價。無壓力推銷，只有專業建議。
            </p>
          </div>
        </div>
      </section>

      {/* Service Flow */}
      <section className="section bg-bg-alt">
        <div className="section-inner">
          <div className="text-center mb-12">
            <span className="tag mb-4">服務流程</span>
            <h2 className="heading-section text-text-primary mt-4">三種合作模式</h2>
            <div className="brand-divider brand-divider-center mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "診斷",
                desc: "透過免費 30 分鐘諮詢，了解您的企業現況、挑戰與目標。",
                icon: "🔍",
              },
              {
                step: "02",
                title: "規劃",
                desc: "依據診斷結果，客製化最適合的服務方案與時程規劃。",
                icon: "📋",
              },
              {
                step: "03",
                title: "執行",
                desc: "以專業且務實的方式，陪伴您完成轉型的每一步。",
                icon: "🚀",
              },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 right-0 w-full h-0.25 bg-gradient-to-r from-transparent via-border to-transparent z-0" style={{top: '40px', right: '-50%', width: '100%'}} />
                )}
                <div className="w-16 h-16 rounded-full bg-white border-2 border-primary/10 flex items-center justify-center mx-auto mb-4 shadow-sm relative z-10">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <div className="text-xs font-bold text-tertiary mb-1 tracking-wider">STEP {item.step}</div>
                <h3 className="heading-subsection text-text-primary mb-2">{item.title}</h3>
                <p className="text-text-secondary text-body-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="heading-section text-white mb-4">
            想了解最適合您的服務？
          </h2>
          <p className="text-white/80 text-body-lg mb-8">
            歡迎安排免費 30 分鐘諮詢，讓我們一起找到最適合您的轉型路徑。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/about#contact" className="btn-primary bg-white text-primary font-bold hover:bg-white/95">
              ✉️ 立即預約諮詢
            </Link>
            <Link href="/assistant" className="btn-secondary border-white/40 text-white hover:bg-white/15 hover:border-white">
              💬 先問問小幫手
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
