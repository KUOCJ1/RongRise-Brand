import Link from "next/link";
import caseStudies from "@/data/case-studies.json";

export default function CaseStudiesSection() {
  return (
    <section className="section bg-bg-alt">
      <div className="section-inner">
        <div className="text-center mb-12">
          <span className="tag mb-4">客戶案例</span>
          <h2 className="heading-section text-dark mt-4">轉型，不只是說說而已</h2>
          <div className="brand-divider brand-divider-center mt-4" />
          <p className="text-text-secondary text-body-lg mt-4 max-w-2xl mx-auto">
            從製造業到服務業，我們用數據說話——這些企業的故事，也許就是您明日的場景。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {caseStudies.caseStudies.map((study) => (
            <Link
              key={study.id}
              href={study.link}
              className="card group no-underline block overflow-hidden"
            >
              {/* Industry Tag */}
              <div className="flex items-center justify-between mb-4">
                <span className="tag">{study.industry}</span>
                {study.tags.map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
                    {t}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h3 className="heading-subsection text-dark mb-3 group-hover:text-primary transition-colors">
                {study.title}
              </h3>

              {/* Challenge */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">挑戰</p>
                <p className="text-text-secondary text-body-sm">{study.challenge}</p>
              </div>

              {/* Solution */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">解法</p>
                <p className="text-text-secondary text-body-sm">{study.solution}</p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border-light">
                {study.results.map((r, i) => (
                  <div key={i} className="text-center">
                    <div className="text-lg font-bold text-primary">{r.metric}</div>
                    <div className="text-[10px] text-text-secondary leading-tight mt-0.5">{r.label}</div>
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <p className="text-text-secondary text-body mb-4">
            想了解完整的導入過程與策略細節？
          </p>
          <Link href="/knowledge" className="btn-secondary">
            閱讀所有案例文章 →
          </Link>
        </div>
      </div>
    </section>
  );
}
