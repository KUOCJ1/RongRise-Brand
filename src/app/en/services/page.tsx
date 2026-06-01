import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | AI Transformation · Talent Strategy · ESG Sustainability",
  description: "RongRise Consulting services: AI Transformation Strategy, Corporate Training, ESG Sustainability Consulting. Customized solutions from diagnosis to implementation.",
};

const services = [
  {
    icon: "🤖",
    title: "Consulting",
    tagline: "AI Transformation × Sustainability Governance",
    desc: "Customized executable transformation blueprints. From assessment to strategy to implementation, C.J. Kuo leverages 16 years of multinational corporate experience.",
    features: ["AI Maturity Assessment & Strategy Planning", "Human-AI Workflow Design", "AI Governance & Risk Management", "ESG Supply Chain Governance", "Organizational Change Management", "PoC Design & Execution"],
    cta: "Book Free 30-min Diagnosis",
    ctaHref: "/en/about#contact",
  },
  {
    icon: "🎓",
    title: "Training",
    tagline: "Corporate Training × Workshops",
    desc: "From single-day workshops to series courses, customized for your business needs. Theory and practice balanced for immediate workplace application.",
    features: ["AI Bootcamp: From Basics to Implementation", "Agentic AI Executive Consensus Camp", "RTIF Prompt Engineering Workshop", "AI Talent Strategy Mapping", "ESG Talent Development", "Performance Management & GROW Coaching"],
    cta: "View Course Schedule",
    ctaHref: "/en/courses",
  },
  {
    icon: "💬",
    title: "Consultation",
    desc: "Ask the Assistant any questions about AI transformation, talent development, or ESG sustainability. Get professional and instant replies 24/7.",
    features: ["AI Tool Selection Advice", "Transformation Strategy FAQ", "Government Subsidy Guidance", "ESG Compliance Advisory", "Talent Strategy Recommendations", "One-on-One Deep Consulting"],
    cta: "Ask the Assistant",
    ctaHref: "/en/assistant",
  },
];

export default function ServicesEnPage() {
  return (
    <>
      <section className="bg-gradient-hero text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <span className="tag bg-white/15 text-white mb-4">Services</span>
          <h1 className="heading-hero mt-4 mb-4">Three Service Pillars</h1>
          <p className="text-body-lg text-white/85 max-w-2xl">
            No matter what stage of transformation you are at, find the most suitable service model.
          </p>
        </div>
      </section>

      <section className="section bg-bg-alt">
        <div className="section-inner">
          <div className="space-y-8">
            {services.map((service, i) => (
              <div key={i} className="card bg-white border border-border rounded-2xl overflow-hidden">
                <div className="bg-gradient-subtle p-6 md:p-8 border-b border-border-light">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                      <span className="text-3xl">{service.icon}</span>
                    </div>
                    <div>
                      <h2 className="heading-subsection text-dark">{service.title}</h2>
                      {service.tagline && <p className="text-primary font-medium text-sm mt-1">{service.tagline}</p>}
                    </div>
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <p className="text-text-secondary text-body leading-relaxed mb-6">{service.desc}</p>
                  <h3 className="font-semibold text-dark text-sm mb-3">What We Offer</h3>
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
                  <Link href={service.ctaHref} className="btn-primary inline-flex items-center gap-2">
                    {service.cta} <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section bg-gradient-subtle">
        <div className="section-inner">
          <div className="text-center mb-12">
            <span className="tag mb-4">Pricing</span>
            <h2 className="heading-section text-dark mt-4">Right Plan for Your Scale</h2>
            <div className="brand-divider brand-divider-center mt-4" />
            <p className="text-text-secondary text-body-lg mt-4 max-w-2xl mx-auto">
              We believe every business transformation path is different. We provide the most suitable service combination based on your scale, needs, and budget.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="card text-center flex flex-col">
              <div className="text-3xl mb-4">🔍</div>
              <h3 className="heading-subsection text-dark mb-2">Free Diagnosis</h3>
              <div className="text-3xl font-bold text-primary mb-1">$0</div>
              <div className="text-text-secondary text-sm mb-4">30 minutes</div>
              <ul className="text-left space-y-2 mb-6 flex-1">
                <li className="flex items-start gap-2 text-sm text-text-secondary"><span className="text-primary">✓</span> Business situation analysis</li>
                <li className="flex items-start gap-2 text-sm text-text-secondary"><span className="text-primary">✓</span> Initial challenge diagnosis</li>
                <li className="flex items-start gap-2 text-sm text-text-secondary"><span className="text-primary">✓</span> Transformation direction advice</li>
                <li className="flex items-start gap-2 text-sm text-text-secondary"><span className="text-primary">✓</span> Service recommendation</li>
              </ul>
              <Link href="/en/about#contact" className="btn-secondary w-full text-center">Book Free Diagnosis</Link>
            </div>
            <div className="card text-center flex flex-col border-2 border-tertiary relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-tertiary text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</div>
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="heading-subsection text-dark mb-2">Consulting</h3>
              <div className="text-3xl font-bold text-primary mb-1">Custom</div>
              <div className="text-text-secondary text-sm mb-4">Tailored Quote</div>
              <ul className="text-left space-y-2 mb-6 flex-1">
                <li className="flex items-start gap-2 text-sm text-text-secondary"><span className="text-tertiary">✓</span> AI maturity assessment</li>
                <li className="flex items-start gap-2 text-sm text-text-secondary"><span className="text-tertiary">✓</span> Transformation strategy</li>
                <li className="flex items-start gap-2 text-sm text-text-secondary"><span className="text-tertiary">✓</span> PoC design & execution</li>
                <li className="flex items-start gap-2 text-sm text-text-secondary"><span className="text-tertiary">✓</span> Org change management</li>
                <li className="flex items-start gap-2 text-sm text-text-secondary"><span className="text-tertiary">✓</span> Performance tracking</li>
              </ul>
              <Link href="/en/about#contact" className="btn-primary w-full text-center">Discuss Your Needs</Link>
            </div>
            <div className="card text-center flex flex-col">
              <div className="text-3xl mb-4">🎓</div>
              <h3 className="heading-subsection text-dark mb-2">Training</h3>
              <div className="text-3xl font-bold text-primary mb-1">Per Person</div>
              <div className="text-text-secondary text-sm mb-4">Below Market Rate</div>
              <ul className="text-left space-y-2 mb-6 flex-1">
                <li className="flex items-start gap-2 text-sm text-text-secondary"><span className="text-accent">✓</span> AI Bootcamp (public)</li>
                <li className="flex items-start gap-2 text-sm text-text-secondary"><span className="text-accent">✓</span> Corporate workshops</li>
                <li className="flex items-start gap-2 text-sm text-text-secondary"><span className="text-accent">✓</span> Executive consensus camp</li>
                <li className="flex items-start gap-2 text-sm text-text-secondary"><span className="text-accent">✓</span> Custom curriculum design</li>
              </ul>
              <Link href="/en/courses" className="btn-secondary w-full text-center">View Courses</Link>
            </div>
          </div>
          <div className="text-center mt-8">
            <p className="text-text-secondary text-sm">💡 All engagements start with a free 30-minute diagnosis. No pressure sales, just professional advice.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="heading-section text-white mb-4">Ready to Start?</h2>
          <p className="text-white/80 text-body-lg mb-8">Book a free 30-minute consultation to find the best path for your business.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/en/about#contact" className="btn-primary bg-white text-primary font-bold hover:bg-white/95">✉️ Book Consultation</Link>
            <Link href="/en/assistant" className="btn-secondary border-white/40 text-white hover:bg-white/15 hover:border-white">💬 Ask the Assistant</Link>
          </div>
        </div>
      </section>
    </>
  );
}
