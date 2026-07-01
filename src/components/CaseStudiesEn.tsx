import Link from "next/link";
import caseStudies from "@/data/case-studies-en.json";

export default function CaseStudiesEnSection() {
  return (
    <section className="section bg-bg-alt">
      <div className="section-inner">
        <div className="text-center mb-12">
          <span className="tag mb-4">Client Stories</span>
          <h2 className="heading-section text-text-primary mt-4">Transformation, Not Just Talk</h2>
          <div className="brand-divider brand-divider-center mt-4" />
          <p className="text-text-secondary text-body-lg mt-4 max-w-2xl mx-auto">
            From manufacturing to services, we let the data speak — these companies' stories could be your tomorrow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {caseStudies.caseStudies.map((study) => (
            <Link
              key={study.id}
              href={study.link}
              className="card group no-underline block overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="tag">{study.industry}</span>
                {study.tags.map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
                    {t}
                  </span>
                ))}
              </div>

              <h3 className="heading-subsection text-text-primary mb-3 group-hover:text-primary transition-colors">
                {study.title}
              </h3>

              <div className="mb-4">
                <p className="text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">Challenge</p>
                <p className="text-text-secondary text-body-sm">{study.challenge}</p>
              </div>

              <div className="mb-5">
                <p className="text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">Solution</p>
                <p className="text-text-secondary text-body-sm">{study.solution}</p>
              </div>

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

        <div className="text-center mt-10">
          <p className="text-text-secondary text-body mb-4">
            Want to learn about the full implementation process and strategy details?
          </p>
          <Link href="/en/knowledge" className="btn-secondary">
            Read All Case Articles →
          </Link>
        </div>
      </div>
    </section>
  );
}
