import Link from "next/link";

const steps = [
  {
    step: "01",
    icon: "🔍",
    title: "Free Diagnostic",
    desc: "A 30-minute deep-dive conversation to understand your business, core challenges, and transformation goals. No sales pitch — just direction.",
    detail: "Best for: Companies unsure where to start"
  },
  {
    step: "02",
    icon: "📊",
    title: "Current State Assessment",
    desc: "Data-driven comprehensive review of organizational capability, AI maturity, and ESG gaps. Identify the most critical leverage points.",
    detail: "Deliverable: Assessment report + priority action recommendations"
  },
  {
    step: "03",
    icon: "📋",
    title: "Strategy Planning",
    desc: "Customized transformation roadmap with timeline, resources, and risk management. Every step is actionable.",
    detail: "Deliverable: Transformation strategy document + implementation roadmap"
  },
  {
    step: "04",
    icon: "🚀",
    title: "Implementation",
    desc: "Guided rollout from PoC to full deployment. We don't just give you fish — we teach you to fish.",
    detail: "Deliverable: Implementation results report + team enablement"
  },
  {
    step: "05",
    icon: "📈",
    title: "Performance Tracking",
    desc: "Establish measurable KPIs and continuously optimize. Transformation is not a project — it's continuous improvement.",
    detail: "Deliverable: Regular performance reviews + optimization recommendations"
  }
];

export default function ServiceFlowEnSection() {
  return (
    <section className="section bg-bg-alt">
      <div className="section-inner">
        <div className="text-center mb-12">
          <span className="tag mb-4">How We Work</span>
          <h2 className="heading-section text-dark mt-4">Our Engagement Model</h2>
          <div className="brand-divider brand-divider-center mt-4" />
          <p className="text-text-secondary text-body-lg mt-4 max-w-2xl mx-auto">
            From first conversation to transformation at scale, every step has clear goals and deliverables.
            Not just a consultant — a partner walking alongside you.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {steps.map((item, i) => (
            <div key={i} className="flex gap-6 mb-8 last:mb-0">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-white border-2 border-primary/10 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/20 to-transparent mt-2" />
                )}
              </div>

              <div className="pb-2">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-tertiary tracking-wider">STEP {item.step}</span>
                  <h3 className="heading-subsection text-dark text-[1.1rem]">{item.title}</h3>
                </div>
                <p className="text-text-secondary text-body leading-relaxed mb-2">{item.desc}</p>
                <p className="text-xs text-text-secondary flex items-center gap-1">
                  <span className="text-primary">✦</span> {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-gradient-hero rounded-2xl p-8 md:p-10 max-w-2xl mx-auto">
            <h3 className="heading-subsection text-white mb-3">Ready to Take the First Step?</h3>
            <p className="text-white/80 text-body mb-6">
              Start with a free 30-minute diagnostic to help us understand your needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/en/about#contact" className="btn-primary bg-white text-primary font-bold hover:bg-white/95">
                Book Free Diagnostic
              </Link>
              <Link href="/en/services" className="btn-secondary border-white/40 text-white hover:bg-white/15 hover:border-white">
                View All Services →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
