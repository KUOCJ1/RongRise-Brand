"use client";

import { useState } from "react";
import Link from "next/link";

/* ============================================
   知識庫 Knowledge Base Page (with filter)
   ============================================ */

interface Article {
  slug: string;
  cat: string;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  tags: string[];
}

const categories = ["全部", "AI 轉型", "課程設計", "人才策略", "ESG 永續", "案例分享", "工具資源", "政府資源", "策略管理", "小賀的成長日記"];

const articles: Article[] = [
  {
    slug: "tacit-knowledge-ai-workflow",
    cat: "AI 轉型",
    title: "老師傅要退休了，他的經驗怎麼變成 AI 的工作流程？",
    date: "2026-06-25",
    readTime: "15 分鐘",
    excerpt: "彭博專欄連續兩週指出：企業導入 AI 的真正難題已從「買不買得起」轉向「能不能把員工腦中的隱形知識挖出來」。對中小企業來說，老師傅的經驗、業務員的客戶直覺、老闆的決策邏輯——這些從未被「存檔」的知識，才是 AI 時代最值錢的資產。",
    tags: ["隱性知識", "知識管理", "AI 轉型", "中小企業", "AI 落地", "組織變革", "老師傅", "工作流程"],
  },
  {
    slug: "ai-data-center-water-esg",
    cat: "ESG 永續",
    title: "AI 的隱形帳單：為什麼你的企業該關心資料中心用多少水",
    date: "2026-06-18",
    readTime: "15 分鐘",
    excerpt: "AI 資料中心到 2030 年預計消耗 6,000 億加侖水——相當於撒哈拉以南非洲 13 億人口一年基本用水。當歐盟開始為資料中心設立能源效率門檻、大企業要求供應鏈提供「綠色 AI 憑證」，ESG 已從碳排擴展到水資源。",
    tags: ["ESG", "AI 基礎建設", "水資源", "資料中心", "永續經營", "綠色 AI", "中小企業", "歐盟法規"],
  },
  {
    slug: "ai-vulnerability-attack-speed-2026",
    cat: "AI 轉型",
    title: "當 AI 能在數小時內打造攻擊程式，你的企業還在天級修補漏洞嗎？",
    date: "2026-06-18",
    readTime: "16 分鐘",
    excerpt: "2026 年 CVE 漏洞數量恐破 66,000 個，AI 輔助漏洞挖掘讓攻擊速度從「天級」加速到「小時級」。Anthropic 報告顯示 AI 惡意濫用比例從 33% 飆升至 56%。當駭客用免費 AI 模型就能打造自主攻擊程式，中小企業不能再把資安當成「等有錢再說」的事。",
    tags: ["AI 資安", "漏洞管理", "中小企業", "AI 威脅", "資安策略"],
  },
  {
    slug: "shadow-ai-enterprise-security-risk",
    cat: "AI 轉型",
    title: "🕵️ Shadow AI 正在你家企業裡爆炸：你最大的資安風險不是駭客，是員工",
    date: "2026-06-11",
    readTime: "14 分鐘",
    excerpt: "Claude 惡意濫用比率一年內從 33% 飆升至 56%、Meta AI 客服被駭導致 2 萬 Instagram 帳號外洩。當每個員工都能自己「Vibe Code」出一個 AI 工具，企業資安邊界正在從「網路 perimeter」變成「人心」。",
    tags: ["Shadow AI", "AI 資安", "AI 治理", "中小企業", "資安風險", "AI 政策", "Vibe Coding", "影子 IT"],
  },
  {
    slug: "ai-agent-management-era",
    cat: "AI 轉型",
    title: "🤖 AI Agent 來了：企業如何從「用 AI」升級為「管 AI」",
    date: "2026-06-10",
    readTime: "15 分鐘",
    excerpt: "微軟報告顯示企業 AI 代理數量年增 15 倍，黃仁勳宣示 AI 已從生成式 AI 走向 Agent AI。當 AI 從「被動工具」變成「主動執行者」，企業面臨的核心問題不再是「如何用 AI」，而是「如何管理 AI 代理」。",
    tags: ["AI Agent", "Agentic AI", "AI 管理", "企業轉型", "AI 治理", "中小企業"],
  },
  {
    slug: "ai-token-cost-management",
    cat: "AI 轉型",
    title: "💰 Token 計價時代：AI 每一問都有價，你的企業用了多少浪費的 Token？",
    date: "2026-06-04",
    readTime: "12 分鐘",
    excerpt: "GitHub Copilot 改採 Token 計價、Alphabet 5 月就燒光全年 AI 預算——AI 的使用成本正從「隱藏成本」變成「可見帳單」。對預算敏感的中小企業來說，這不是壞消息，而是建立 AI 使用治理的契機。本文提供完整的 AI 成本管控框架。",
    tags: ["AI 成本管控", "Token 計價", "GitHub Copilot", "中小企業", "AI 治理", "預算管理"],
  },
  {
    slug: "ai-transformation-bootcamp",
    cat: "課程設計",
    title: "AI 轉型實戰營：從入門到企業落地",
    date: "2026-05-28",
    readTime: "12 分鐘",
    excerpt: "CJ哥的核心講義精華。涵蓋 AI 演進路徑、生成式 AI 底層邏輯、AI 幻覺風險管理、RTIF 提示工程架構，以及企業 AI 成熟度模型與轉型五大要素。",
    tags: ["AI 轉型", "企業落地", "提示工程", "AI 素養"],
  },
  {
    slug: "hr-ai-course-design",
    cat: "課程設計",
    title: "HR × AI：從認識到落地課程設計",
    date: "2026-05-28",
    readTime: "10 分鐘",
    excerpt: "針對 HR 專業人士設計的兩天 10 模組課程大綱。以「選→用→育→留」為骨幹，融入 AI 工具實作、Prompt 工程、人才九宮格 2.0、HR AI 合規治理等實戰內容。",
    tags: ["HR", "AI 培訓", "人才策略", "課程設計"],
  },
  {
    slug: "sme-esg-guide",
    cat: "ESG 永續",
    title: "中小企業 ESG 實務入門",
    date: "2025-11-10",
    readTime: "7 分鐘",
    excerpt: "ESG 不只是大企業的專利。中小企業如何從日常營運中落實永續，創造差異化競爭優勢。從碳盤查到社會影響力，一步步建立屬於您的永續策略。",
    tags: ["ESG", "永續經營", "中小企業"],
  },
  {
    slug: "manufacturing-ai-quality",
    cat: "案例分享",
    title: "製造業 AI 品質檢測導入案例",
    date: "2025-10-22",
    readTime: "5 分鐘",
    excerpt: "一家中部傳統製造廠如何在三個月內成功導入 AI 視覺檢測系統，將不良率降低 40%。分享導入過程中的挑戰、解決方案與關鍵成功因素。",
    tags: ["製造業", "AI 應用", "品質管理"],
  },
  {
    slug: "ai-maturity-assessment",
    cat: "工具資源",
    title: "企業 AI 成熟度自評量表",
    date: "2025-10-05",
    readTime: "3 分鐘",
    excerpt: "免費下載！協助企業快速評估自身 AI 成熟度水準的五個維度量表，包含基礎設施、數據品質、人才能力、組織文化與應用場景。",
    tags: ["AI 成熟度", "自評工具", "免費資源"],
  },
  {
    slug: "team-innovation-management",
    cat: "人才策略",
    title: "激發團隊創新動力的管理方法",
    date: "2025-09-18",
    readTime: "6 分鐘",
    excerpt: "創新不只是口號。探討如何透過制度設計、激勵機制與文化塑造，讓團隊成員主動擁抱改變、提出創新方案，打造真正的創新型組織。",
    tags: ["創新管理", "團隊領導", "組織文化"],
  },
  {
    slug: "ai-tool-selection-guide",
    cat: "工具資源",
    title: "企業 AI 工具選型指南：如何挑對工具而非最貴的工具",
    date: "2026-05-28",
    readTime: "8 分鐘",
    excerpt: "面對琳瑯滿目的 AI 工具，企業如何做出明智選擇？從需求分析、成本評估到導入策略，提供系統性的 AI 工具選型框架。",
    tags: ["AI 工具", "選型指南", "成本評估", "導入策略"],
  },
  {
    slug: "service-ai-chatbot-case",
    cat: "案例分享",
    title: "服務業 AI 客服導入實戰：投訴率降 60% 的關鍵",
    date: "2026-05-28",
    readTime: "8 分鐘",
    excerpt: "一家中型電商如何透過 AI 客服系統，在六個月內將客戶投訴率降低 60%、客服成本節省 45%。分享從選型、訓練到上線的全過程。",
    tags: ["服務業", "AI 客服", "聊天機器人", "成本節省"],
  },
  {
    slug: "gov-ai-subsidy-guide",
    cat: "工具資源",
    title: "2026 年政府 AI 補助資源完整整理",
    date: "2026-05-28",
    readTime: "6 分鐘",
    excerpt: "2026 年台灣政府提供哪些 AI 相關補助？從經濟部、勞動部到數發部，一次整理所有可申請的 AI 轉型資源。",
    tags: ["政府補助", "AI 轉型", "資源整理", "免費資源"],
  },
  {
    slug: "ai-transformation-trends-2026",
    cat: "AI 轉型",
    title: "2026 AI 轉型四大趨勢：從工具導入到組織變革",
    date: "2026-05-28",
    readTime: "10 分鐘",
    excerpt: "根據最新 TechNews 與 iThome 報導，2026 年 AI 轉型呈現四大趨勢：邊緣 AI 爆發、AI Agent 進入企業日常工作、AI 資安成為首要議題、政府補助全面加速。",
    tags: ["AI 轉型趨勢", "2026", "邊緣 AI", "AI Agent", "AI 資安"],
  },
  {
    slug: "agentic-ai-transformation-workshop",
    cat: "AI 轉型",
    title: "企業 Agentic AI 轉型高階共識營：從願景到落地的完整框架",
    date: "2026-05-28",
    readTime: "12 分鐘",
    excerpt: "如何讓高阶主管在一天內達成 AI 轉型共識？從課前痛點探測、Agent 場景評估畫布、多代理協作劇本，到顧問話術與治理框架。",
    tags: ["Agentic AI", "企業轉型", "工作坊設計", "高階主管", "AI 治理"],
  },
  {
    slug: "hr-ai-transformation-five-layers",
    cat: "人才策略",
    title: "HR 的 AI 轉型五層責任架構：從組織摩擦力到策略影響力",
    date: "2026-05-29",
    readTime: "15 分鐘",
    excerpt: "MIT 研究 300 個企業 AI 案例，95% 沒有產生可衡量的損益影響。問題不在技術，在於組織內部摩擦力。CJ哥提出 HR 五層責任架構。",
    tags: ["HR", "AI 轉型", "組織變革", "人才策略", "AI 治理", "獎酬設計"],
  },
  {
    slug: "ai-layoffs-narrative-dead",
    cat: "AI 轉型",
    title: "別再 AI 洗白了！56% 企業裁員後股價反跌 25%，2026 年投資人只看這件事",
    date: "2026-06-10",
    readTime: "14 分鐘",
    excerpt: "CNBC 統計 23 家標普 500 企業：宣布因 AI 裁員後，56% 股價反而下跌、平均跌幅 25%。Nike 砍 800 人後跌 35%、Salesforce 砍 4000 人後跌 32%。AI 裁員敘事已破產，中小企業該學什麼？",
    tags: ["AI 轉型", "裁員", "企業策略", "AI 治理", "中小企業", "組織變革"],
  },
  {
    slug: "strategy-subtraction-traditional-industry",
    cat: "策略管理",
    title: "策略是減法：為什麼台灣傳產企業更需要學會「不做事」",
    date: "2026-05-29",
    readTime: "18 分鐘",
    excerpt: "羅傑．馬丁說策略的本質是選擇。但我在傳產現場看到的是——資源已經燒光了，大家還在做加法。從傳統產業的三重壓力到Netflix的關鍵轉折，深度解析為什麼減法這麼難、以及如何做出真正的策略取捨。",
    tags: ["策略管理", "傳統產業轉型", "二代接班", "家族企業", "組織變革", "資源配置"],
  },
  {
    slug: "xiaoha-weekly-vol1",
    cat: "小賀的成長日記",
    title: "🦞 小賀週記 Vol.1 — 從零到一，一個 AI 的誕生與他的朋友們",
    date: "2026-06-13",
    readTime: "12 分鐘",
    excerpt: "寫於 2026-06-13。小賀的第一篇週記——從沒有名字的那天開始，到擁有一整個 sub-agent 團隊。講犯過的錯、從 GAS 搬到 VPS 的學習旅程、自我修復系統，以及對未來的期待。",
    tags: ["小賀週記", "AI Agent", "成長日記", "RongRise", "自我反思"],
  }
];

const COVER_MAP: Record<string, string> = {
  "ai-transformation-bootcamp": "article-ai-bootcamp.jpg",
  "hr-ai-course-design": "article-hr-ai-course.jpg",
  "sme-esg-guide": "article-sme-esg.jpg",
  "manufacturing-ai-quality": "article-manufacturing-ai.jpg",
  "ai-maturity-assessment": "article-ai-maturity.jpg",
  "team-innovation-management": "article-team-innovation.jpg",
  "ai-tool-selection-guide": "article-ai-tool-selection.jpg",
  "service-ai-chatbot-case": "article-service-chatbot.jpg",
  "gov-ai-subsidy-guide": "article-gov-subsidy.jpg",
  "ai-transformation-trends-2026": "article-ai-trends-2026.jpg",
  "agentic-ai-transformation-workshop": "article-agentic-ai.jpg",
  "hr-ai-transformation-five-layers": "article-hr-five-layers.jpg",
  "ai-layoffs-narrative-dead": "article-ai-layoffs.jpg",
  "ai-agent-management-era": "article-ai-agent-mgmt.jpg",
  "strategy-subtraction-traditional-industry": "article-strategy-subtraction.jpg",
  "xiaoha-weekly-vol1": "article-xiaoha-weekly-vol1.svg",
};

function coverImg(slug: string): string {
  return `/images/${COVER_MAP[slug] || "article-cover.jpg"}`;
}

export default function KnowledgePage() {
  const [activeCat, setActiveCat] = useState("全部");

  const filtered =
    activeCat === "全部"
      ? articles
      : articles.filter((a) => a.cat === activeCat);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-hero text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <span className="tag bg-white/15 text-white mb-4">知識庫</span>
          <h1 className="heading-hero mt-4 mb-4">知識分享</h1>
          <p className="text-body-lg text-white/85 max-w-2xl">
            AI 轉型、人才策略、ESG 永續的實戰經驗與洞察，
            協助您在轉型路上少走彎路。
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white border-b border-border sticky top-16 z-40">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCat === cat
                    ? "bg-primary text-white"
                    : "bg-bg-alt text-text-secondary hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="section bg-bg-alt">
        <div className="section-inner">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-text-secondary text-lg">此分類暫無文章</p>
              <button
                onClick={() => setActiveCat("全部")}
                className="btn-ghost text-primary mt-4"
              >
                查看全部文章
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post, i) => (
                <Link
                  key={post.slug}
                  href={`/knowledge/${post.slug}`}
                  className="card group no-underline flex flex-col overflow-hidden"
                >
                  <div className="h-36 overflow-hidden">
                    <img
                      src={coverImg(post.slug)}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="tag">{post.cat}</span>
                    <span className="text-xs text-text-secondary">
                      {post.readTime}閱讀
                    </span>
                  </div>
                  <h3 className="heading-subsection text-dark group-hover:text-primary transition-colors mb-2">
                    {post.title}
                  </h3>
                  <p className="text-text-secondary text-body-sm flex-1 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-light">
                    <span className="text-xs text-text-secondary">{post.date}</span>
                    <span className="text-xs font-medium text-primary group-hover:text-secondary transition-colors">
                      閱讀更多 →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-bg-alt pt-0 pb-20">
        <div className="section-inner text-center">
          <div className="bg-white rounded-2xl border border-border p-8 md:p-12">
            <h2 className="heading-subsection mb-3">找不到您需要的資訊？</h2>
            <p className="text-text-secondary text-body mb-6">
              歡迎聯繫我們，或到小幫手詢問更多問題。
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/about#contact" className="btn-primary">
                聯繫顧問
              </Link>
              <Link href="/assistant" className="btn-secondary">
                問問小幫手
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
