import Link from "next/link";
import news from "@/data/news.json";

const categoryColors: Record<string, string> = {
  "課程": "bg-tertiary/10 text-tertiary",
  "媒體": "bg-secondary/10 text-secondary",
  "資源": "bg-accent/10 text-accent",
  "公告": "bg-primary/10 text-primary"
};

export default function NewsSection() {
  const displayNews = news.news.slice(0, 4);

  return (
    <section className="section bg-gradient-subtle">
      <div className="section-inner">
        <div className="text-center mb-12">
          <span className="tag mb-4">最新消息</span>
          <h2 className="heading-section text-text-primary mt-4">課程、資源、與觀點</h2>
          <div className="brand-divider brand-divider-center mt-4" />
        </div>

        <div className="max-w-3xl mx-auto">
          {displayNews.map((item, i) => (
            <Link
              key={item.id}
              href={item.link}
              className={`block no-underline group ${i < displayNews.length - 1 ? 'mb-4' : ''}`}
            >
              <div className="card flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 group-hover:shadow-lg transition-all">
                {/* Date */}
                <div className="flex-shrink-0 text-center sm:min-w-[70px]">
                  <div className="text-xs text-text-secondary font-medium">
                    {new Date(item.date).toLocaleDateString('zh-TW', { month: 'short' }).replace('.', '')}
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {new Date(item.date).getDate()}
                  </div>
                  <div className="text-[10px] text-text-secondary">
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
                  <h3 className="text-[15px] font-semibold text-text-primary group-hover:text-primary transition-colors mb-1 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary text-body-sm line-clamp-2">
                    {item.summary}
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

        <div className="text-center mt-10">
          <Link href="/news" className="btn-secondary">
            查看所有消息 →
          </Link>
        </div>
      </div>
    </section>
  );
}
