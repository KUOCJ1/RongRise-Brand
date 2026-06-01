import Link from "next/link";

/* ============================================
   English Services Page
   ============================================ */

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
    title: "Advisory Services",
    tagline: "AI Transformation Strategy × Sustainability Governance",
    desc: "We create executable transformation blueprints tailored to your enterprise. From current state assessment and strategy planning to implementation, C.J. Kuo leverages 16 years of multinational executive experience to help you find the most suitable development path in the AI era.",
    features: [
      "AI transformation maturity assessment and strategy planning",
      "Human-AI collaboration process design and implementation",
      "AI governance framework and risk management",
      "Sustainable supply chain ESG governance implementation",
      "Organizational change management and change communication",
      "PoC design, execution, and results tracking",
    ],
    cta: "Book a Free 30-Minute Diagnosis",
    ctaHref: "/en/about#contact",
  },
  {
    icon: "🎓",
    title: "Training",
    tagline: "Corporate Training × Workshops",
    desc: "From one-day workshops to multi-session courses tailored to your enterprise's needs. Balancing theory and practice so participants can immediately apply what they learn in the classroom.",
    features: [
      "AI Bootcamp: From Introduction to Enterprise Implementation",
      "Agentic AI Transformation Executive Alignment Workshop",
      "RTIF Prompt Engineering Hands-On Workshop",
      "AI-Era Talent Strategy Mapping",
      "ESG Sustainability Talent Development Course",
      "Performance Management and GROW Coaching Techniques",
    ],
    cta: "View Course Overview",
    ctaHref: "/en/courses",
  },
  {
    icon: "💬",
    title: "Consultation",
    tagline: "Online Consultation × Instant Response",
    desc: "Through the website Assistant, you can ask questions about AI transformation, talent development, and ESG sustainability anytime. The Assistant draws on C.J. Kuo's complete knowledge base to provide professional and timely responses. For in-depth advisory services, please contact us to arrange a formal consultation.",
    features: [
      "AI tool selection advice and comparison",
      "Common transformation strategy Q&A",
      "Government incentive application guidance",
      "ESG compliance and reporting consultation",
      "Organizational talent strategy advice",
      "One-on-one deep advisory booking",
    ],
    cta: "Ask the Assistant",
    ctaHref: "/en/assistant",
  },
];

export default function EnServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-hero text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <span className="tag bg-white/15 text-white mb-4">Services</span>
          <h1 className="heading-hero mt-4 mb-4">Three Service Pillars</h1>
          <p className="text-body-lg text-white/85 max-w-2xl">
            No matter what stage of transformation you&apos;re at, you&apos;ll find the most suitable service model — from in-depth advisory, hands-on workshop training, to instant online consultation.
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
                <div className="bg-gradient-subtle p-6 md:p-8 border-b border-border-light">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                      <span className="text-3xl">{service.icon}</span>
                    </div>
                    <div>
                      <h2 className="heading-subsection text-dark">{service.title}</h2>
                      <p className="text-primary font-medium text-sm mt-1">{service.tagline}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <p className="text-text-secondary text-body leading-relaxed mb-6">
                    {service.desc}
                  </p>

                  <h3 className="font-semibold text-dark text-sm mb-3">What&apos;s Included</h3>
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
                <div className="text-white/70 text-sm">Years of Multinational Consulting</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-1">8</div>
                <div className="text-white/70 text-sm">Distinguished Workplace Awards</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-1">3+</div>
                <div className="text-white/70 text-sm">Public Course Cohorts Launched</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-1">Multi-Industry</div>
                <div className="text-white/70 text-sm">Cross-Domain Service Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Flow */}
      <section className="section bg-bg-alt">
        <div className="section-inner">
          <div className="text-center mb-12">
            <span className="tag mb-4">Service Process</span>
            <h2 className="heading-section text-dark mt-4">Three Collaboration Models</h2>
            <div className="brand-divider brand-divider-center mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Diagnosis", desc: "Through a free 30-minute consultation, understand your enterprise's current situation, challenges, and goals.", icon: "🔍" },
              { step: "02", title: "Planning", desc: "Based on the diagnosis, customize the most suitable service plan and timeline.", icon: "📋" },
              { step: "03", title: "Execution", desc: "With professional and pragmatic approaches, walk through every step of transformation alongside you.", icon: "🚀" },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 relative">
                <div className="w-16 h-16 rounded-full bg-white border-2 border-primary/10 flex items-center justify-center mx-auto mb-4 shadow-sm relative z-10">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <div className="text-xs font-bold text-tertiary mb-1 tracking-wider">STEP {item.step}</div>
                <h3 className="heading-subsection text-dark mb-2">{item.title}</h3>
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
            Want to Find the Best Service for You?
          </h2>
          <p className="text-white/80 text-body-lg mb-8">
            Book a free 30-minute consultation to let us find the most suitable transformation path together.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/en/about#contact" className="btn-primary bg-white text-primary font-bold hover:bg-white/95">
              ✉️ Book a Consultation Now
            </Link>
            <Link href="/en/assistant" className="btn-secondary border-white/40 text-white hover:bg-white/15 hover:border-white">
              💬 Ask the Assistant First
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
