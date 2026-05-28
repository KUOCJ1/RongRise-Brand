import Link from "next/link";

/* ============================================
   下載區 Downloads Page (Enhanced)
   ============================================ */

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
        href: "#",
      },
      {
        name: "AI 轉型策略白皮書",
        type: "PDF",
        size: "2.8 MB",
        desc: "深入解析企業 AI 導入的策略框架與實務步驟。",
        href: "#",
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
        size: "0.5 MB",
        desc: "免費下載！五個維度評估企業 AI 成熟度水準。",
        href: "/knowledge/ai-maturity-assessment",
        isNew: true,
      },
      {
        name: "ESG 現況盤點清單",
        type: "PDF",
        size: "0.8 MB",
        desc: "協助企業盤點目前 ESG 落實狀況的實用清單。",
        href: "#",
        isNew: true,
      },
      {
        name: "人才能力評估模板",
        type: "PDF",
        size: "0.6 MB",
        desc: "建立團隊能力地圖的結構化模板。",
        href: "#",
      },
    ],
  },
  {
    title: "精選內容",
    icon: "📚",
    items: [
      {
        name: "2025 AI 轉型實戰指南",
        type: "PDF",
        size: "3.5 MB",
        desc: "從評估到落地的完整 AI 轉型指南，含案例分享。",
        href: "/knowledge/ai-transformation-bootcamp",
      },
      {
        name: "數位培訓體系設計手冊",
        type: "PDF",
        size: "1.8 MB",
        desc: "建立企業內部培訓體系的完整參考手冊。",
        href: "/knowledge/hr-ai-course-design",
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
                  <div
                    key={ii}
                    className={`card flex items-start gap-4 group ${
                      item.href && item.href !== "#"
                        ? "cursor-pointer"
                        : ""
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
                          <Link
                            href={item.href}
                            className="text-xs font-medium text-primary group-hover:text-secondary transition-colors"
                          >
                            查看 →
                          </Link>
                        ) : (
                          <span className="text-xs font-medium text-primary group-hover:text-secondary transition-colors">
                            下載 ↓
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
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
