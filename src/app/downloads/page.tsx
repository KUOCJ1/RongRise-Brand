import Link from "next/link";
import type { Metadata } from "next";

/* ============================================
   下載區 Downloads Page (Enhanced)
   ============================================ */

export const metadata: Metadata = {
  title: "下載區｜AI 轉型工具包與免費白皮書｜榕耀管顧",
  description:
    "免費下載榕耀管顧精選資源：AI 成熟度自評量表、ESG 盤點清單、AI 轉型策略白皮書、政府補助指南。持續更新中。",
  alternates: {
    canonical: "https://rongrise.com/downloads",
    languages: {
      en: "https://rongrise.com/en/downloads",
    },
  },
  openGraph: {
    title: "下載區｜AI 轉型工具包白皮書 — 榕耀管顧",
    description: "免費下載 AI 成熟度自評量表、ESG 盤點清單、轉型白皮書。",
    images: [{ url: "https://rong-rise.com/images/og-image.jpg", width: 1200, height: 630, alt: "榕耀管顧 RongRise Consulting" }],
  },
};

interface DownloadItem {
  name: string;
  type: string;
  size: string;
  desc: string;
  href?: string;
  isNew?: boolean;
}

interface DownloadCategory {
  title: string;
  icon: string;
  items: DownloadItem[];
}

const downloadCategories: DownloadCategory[] = [
  {
    title: "服務簡章",
    icon: "📋",
    items: [
      {
        name: "榕耀管顧服務簡介",
        type: "PDF",
        size: "1.2 MB",
        desc: "完整介紹我們的服務項目、核心優勢與合作方式。",
        href: "https://drive.google.com/file/d/1iFvZsDKs6MjgxaewB161FNFlDG1S1bDX/view?usp=sharing",
      },
      {
        name: "AI 轉型策略白皮書",
        type: "PDF",
        size: "2.8 MB",
        desc: "深入解析企業 AI 導入的策略框架與實務步驟。",
        href: "https://drive.google.com/file/d/1iFvZsDKs6MjgxaewB161FNFlDG1S1bDX/view?usp=sharing",
      },
    ],
  },
  {
    title: "實用工具",
    icon: "🛠️",
    items: [
      {
        name: "AI 成熟度自評量表",
        type: "PDF",
        size: "61 KB",
        desc: "免費下載！五個維度評估企業 AI 成熟度水準。",
        href: "https://drive.google.com/file/d/12L6UmKRu9rURwF3GZSPxIGAzT6EsmyKs/view?usp=sharing",
        isNew: true,
      },
      {
        name: "ESG 現況盤點清單",
        type: "PDF",
        size: "75 KB",
        desc: "協助企業盤點目前 ESG 落實狀況的實用清單。",
        href: "https://drive.google.com/file/d/1UxNhLWOJBhoxENHBX8LmzoXH-xSwpBEN/view?usp=sharing",
        isNew: true,
      },
      {
        name: "AI 能力評估框架",
        type: "PDF",
        size: "590 KB",
        desc: "完整 AI 能力評估與分析框架，幫助企業從五個維度診斷 AI 準備度。",
        href: "/resources/ai-capability-assessment-framework.pdf",
        isNew: true,
      },
      {
        name: "人才能力評估模板",
        type: "PDF",
        size: "78 KB",
        desc: "建立團隊能力地圖的結構化模板。",
        href: "https://drive.google.com/file/d/1VOKnekMAERIpLSAnu0Usv3vKbeWGwpKs/view?usp=sharing",
      },
    ],
  },
  {
    title: "精選內容",
    icon: "📚",
    items: [
      {
        name: "2026 AI 轉型趨勢報告",
        type: "PDF",
        size: "98 KB",
        desc: "邊緣 AI、AI Agent、AI 資安、政府補助——四大趨勢深度解析。",
        href: "https://drive.google.com/file/d/1JCWY5YTSS_gfWvGx8sB7eTsE7QphdGeM/view?usp=sharing",
        isNew: true,
      },
      {
        name: "策略白皮書：生成式 AI 時代的技能轉型與人才發展藍圖",
        type: "PDF",
        size: "263 KB",
        desc: "深入分析生成式 AI 對人才策略、職場與企業的宏觀變革。",
        href: "https://drive.google.com/file/d/19eUhNyQAb7M-BsSmlgnflaBsG1FQKMDC/view?usp=sharing",
        isNew: true,
      },
      {
        name: "企業 AI 工具選型指南",
        type: "PDF",
        size: "100 KB",
        desc: "面對琳瑯滿目的 AI 工具，如何做出明智選擇？五大評估維度完整框架。",
        href: "https://drive.google.com/file/d/1GHheU5fgiFNCONbxAtucQaKnEldQg6OU/view?usp=sharing",
        isNew: true,
      },
      {
        name: "服務業 AI 客服導入實戰",
        type: "PDF",
        size: "96 KB",
        desc: "投訴率降 60% 的關鍵：AI 客服導入完整案例分享。",
        href: "https://drive.google.com/file/d/1XvrEG36BWpg0S9w5Ho2iO_gQEK_qVrlJ/view?usp=sharing",
        isNew: true,
      },
      {
        name: "2026 政府 AI 補助資源整理",
        type: "PDF",
        size: "94 KB",
        desc: "從經濟部、勞動部到數發部，一次整理所有可申請的 AI 轉型資源。",
        href: "https://drive.google.com/file/d/1JCWY5YTSS_gfWvGx8sB7eTsE7QphdGeM/view?usp=sharing",
      },
      {
        name: "AI 成熟度自評量表",
        type: "PDF",
        size: "61 KB",
        desc: "免費下載！五個維度評估企業 AI 成熟度水準。",
        href: "https://drive.google.com/file/d/12L6UmKRu9rURwF3GZSPxIGAzT6EsmyKs/view?usp=sharing",
      },
      {
        name: "ESG 現況盤點清單",
        type: "PDF",
        size: "75 KB",
        desc: "協助企業盤點目前 ESG 落實狀況的實用清單。",
        href: "https://drive.google.com/file/d/1UxNhLWOJBhoxENHBX8LmzoXH-xSwpBEN/view?usp=sharing",
      },
    ],
  },
];

export default function DownloadsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-hero text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <span className="tag bg-white/15 text-white mb-4">下載區</span>
          <h1 className="heading-hero mt-4 mb-4">資源下載</h1>
          <p className="text-body-lg text-white/85 max-w-2xl">
            免費下載精選工具與資源，協助您在轉型路上更有方向。
            持續更新中，敬請關注。
          </p>
        </div>
      </section>

      {/* Download Categories */}
      <section className="section">
        <div className="section-inner">
          {downloadCategories.map((cat, ci) => (
            <div key={ci} className="mb-12 last:mb-0">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{cat.icon}</span>
                <h2 className="heading-subsection text-dark">{cat.title}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cat.items.map((item, ii) => (
                  <a
                    key={ii}
                    href={item.href || '#'}
                    target={item.href && item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href && item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`card flex items-start gap-4 group no-underline ${
                      item.href && item.href !== '#'
                        ? 'cursor-pointer'
                        : 'cursor-default opacity-60'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-sm">
                        {item.type}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-dark text-[15px] group-hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                        {item.isNew && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-tertiary/10 text-tertiary font-semibold">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-text-secondary text-body-sm mb-2">
                        {item.desc}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-text-secondary">
                          {item.size}
                        </span>
                        {item.href && item.href !== "#" ? (
                          <span className="text-xs font-medium text-primary group-hover:text-secondary transition-colors">
                            下載 →
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-text-secondary">
                            即將推出
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Knowledge CTA */}
      <section className="bg-gradient-subtle py-12">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="heading-subsection mb-3">
            想先了解轉型策略？
          </h2>
          <p className="text-text-secondary text-body mb-6">
            知識庫提供深入且實用的轉型知識，建議您先閱讀後再下載工具。
          </p>
          <Link href="/knowledge" className="btn-secondary">
            瀏覽知識庫 →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-bg-alt py-16">
        <div className="max-w-[600px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="heading-subsection mb-3">需要更多客製化資源？</h2>
          <p className="text-text-secondary text-body mb-6">
            我們提供一對一的顧問諮詢，依據您的企業需求量身打造轉型方案。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/about#contact" className="btn-primary">
              預約諮詢
            </Link>
            <Link href="/assistant" className="btn-secondary">
              問問小幫手
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
