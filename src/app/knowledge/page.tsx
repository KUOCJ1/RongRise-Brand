import Link from "next/link";

/* ============================================
   知識庫 Knowledge Base Page
   ============================================ */

const categories = ["全部", "AI 轉型", "人才策略", "ESG 永續", "案例分享", "工具資源"];

const articles = [
  {
    cat: "AI 轉型",
    title: "AI 轉型實戰營：從入門到企業落地",
    date: "2026.05.28",
    readTime: "12 分鐘",
    excerpt: "C.J. 老師的核心講義精華。涵蓋 AI 演進路徑、生成式 AI 底層邏輯、AI 幻覺風險管理、RTIF 提示工程架構，以及企業 AI 成熟度模型與轉型五大要素。",
    tags: ["AI 轉型", "企業落地", "提示工程", "AI 素養"],
  },
  {
    cat: "人才策略",
    title: "HR × AI：從認識到落地課程設計",
    date: "2026.05.28",
    readTime: "10 分鐘",
    excerpt: "針對 HR 專業人士設計的兩天 10 模組課程大綱。以「選→用→育→留」為骨幹，融入 AI 工具實作、Prompt 工程、人才九宮格 2.0、HR AI 合規治理等實戰內容。",
    tags: ["HR", "AI 培訓", "人才策略", "課程設計"],
  },
  {
    cat: "ESG 永續",
    title: "中小企業 ESG 實務入門",
    date: "2025.11.10",
    readTime: "7 分鐘",
    excerpt: "ESG 不只是大企業的專利。中小企業如何從日常營運中落實永續，創造差異化競爭優勢。從碳盤查到社會影響力，一步步建立屬於您的永續策略。",
    tags: ["ESG", "永續經營", "中小企業"],
  },
  {
    cat: "案例分享",
    title: "製造業 AI 品質檢測導入案例",
    date: "2025.10.22",
    readTime: "5 分鐘",
    excerpt: "一家中部傳統製造廠如何在三個月內成功導入 AI 視覺檢測系統，將不良率降低 40%。分享導入過程中的挑戰、解決方案與關鍵成功因素。",
    tags: ["製造業", "AI 應用", "品質管理"],
  },
  {
    cat: "工具資源",
    title: "企業 AI 成熟度自評量表",
    date: "2025.10.05",
    readTime: "3 分鐘",
    excerpt: "免費下載！協助企業快速評估自身 AI 成熟度水準的五個維度量表，包含基礎設施、數據品質、人才能力、組織文化與應用場景。",
    tags: ["AI 成熟度", "自評工具", "免費資源"],
  },
  {
    cat: "人才策略",
    title: "激發團隊創新動力的管理方法",
    date: "2025.09.18",
    readTime: "6 分鐘",
    excerpt: "創新不只是口號。探討如何透過制度設計、激勵機制與文化塑造，讓團隊成員主動擁抱改變、提出創新方案，打造真正的創新型組織。",
    tags: ["創新管理", "團隊領導", "組織文化"],
  },
];

export default function KnowledgePage() {
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
            {categories.map((cat, i) => (
              <button
                key={cat}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  i === 0
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((post, i) => (
              <article key={i} className="card group no-underline flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="tag">{post.cat}</span>
                  <span className="text-xs text-text-secondary">{post.readTime}閱讀</span>
                </div>
                <h3 className="heading-subsection text-dark group-hover:text-primary transition-colors mb-2">
                  {post.title}
                </h3>
                <p className="text-text-secondary text-body-sm flex-1 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-light">
                  <span className="text-xs text-text-secondary">{post.date}</span>
                  <span className="text-xs font-medium text-primary group-hover:text-secondary transition-colors">
                    閱讀更多 →
                  </span>
                </div>
              </article>
            ))}
          </div>
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
