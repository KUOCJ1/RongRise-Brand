import Link from "next/link";

/* ============================================
   English About Page
   ============================================ */

const timeline = [
  { year: "1999-2008", title: "International Management Consulting", desc: "Accenture (serving TSMC, Compal), EY Pre-Sales Manager, Watson Wyatt Senior Consultant — building expertise in compensation strategy and human capital transformation." },
  { year: "2008-2023", title: "Senior HR Executive at Multinational Insurance", desc: "Cigna Life CHRO leading full-function HR team, four consecutive HR Asia Awards; Chubb Life SVP overseeing 30+ person team. Helped employers earn 8 distinguished workplace awards." },
  { year: "2024-Present", title: "Founded RongRise Consulting", desc: "Focused on AI-era talent strategy, corporate sustainability governance, SME AI empowerment. Launched 3+ cohorts of AI bootcamp, serving clients including WanDa, SuiYe, and XinNan." },
];

const expertise = [
  { icon: "🤖", title: "AI Transformation Consulting", desc: "AI maturity assessment, Agentic AI implementation strategy, human-AI collaboration process design, AI governance framework" },
  { icon: "🎯", title: "Talent Development Strategy", desc: "Organizational capability building, digital talent development, succession planning, performance management & GROW coaching" },
  { icon: "🌿", title: "ESG Sustainability Consulting", desc: "ESG status assessment, sustainability strategy planning, TCSA report advisory, supply chain carbon tracking" },
  { icon: "💡", title: "Innovation Management Coaching", desc: "Business model innovation, digital transformation roadmap, change management, workshop design & facilitation" },
];

const values = [
  { title: "Professional Rigor", desc: "Grounded in precise terminology, clear logic, and deep knowledge — ensuring every recommendation is supported by data and theory." },
  { title: "Forward-Looking Innovation", desc: "Embracing new technology, guiding trends, helping enterprises seize opportunities in change rather than playing catch-up." },
  { title: "Pragmatic Execution", desc: "Every solution focuses on executability, creating visible value and benefits for the enterprise." },
];

export default function EnAboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-hero text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="max-w-2xl">
            <span className="tag bg-white/15 text-white">About</span>
            <h1 className="heading-hero mt-4 mb-4">
              C.J. Kuo
            </h1>
            <p className="text-body-lg text-white/85">
              Founder · Business Transformation Consultant<br />
              Empowering businesses from talent strategy to AI implementation, driving sustainable growth.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section">
        <div className="section-inner">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border-4 border-white shadow-xl ring-4 ring-primary/10">
                <img
                  src="/images/cj-photo.jpg"
                  alt="C.J. Kuo — Founder, RongRise Consulting"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div>
              <h2 className="heading-section mb-4">
                My <span className="text-primary">Story</span>
              </h2>
              <div className="brand-divider mb-6" />
              <div className="space-y-4 text-text-secondary text-body leading-relaxed">
                <p>
                  With <strong className="text-dark">16 years of multinational HR management experience</strong>, C.J. Kuo has held senior positions at global consulting firms including Accenture, Ernst & Young, and Watson Wyatt, as well as multinational insurance companies including Chubb Life and Cigna Life. Specializing in organizational talent strategy, compensation & rewards design, employer branding, and HR digital transformation, C.J. has helped employers earn <strong className="text-dark">8 distinguished workplace awards</strong>.
                </p>
                <p>
                  Since 2024, as an independent management consultant and corporate trainer, C.J. focuses on three areas: <strong className="text-dark">AI-era talent strategy & organizational transformation</strong>, <strong className="text-dark">corporate sustainability (ESG) governance</strong>, and <strong className="text-dark">SME AI empowerment & implementation</strong>.
                </p>
                <p>
                  Unlike purely academic theorists or purely technical tool-focused consultants, C.J. Kuo&apos;s core differentiated value lies in starting from the strategic level of &quot;people,&quot; combining hands-on AI tool implementation with enterprise deployment experience, to design <strong className="text-dark">executable transformation paths</strong> for organizations.
                </p>
                <p>
                  Representative clients span technology giants like TSMC and Compal, as well as SMEs in manufacturing, chemicals, logistics, and financial holding industries. Customized course design and advisory solutions are provided based on the needs of different scales and industries.
                </p>
              </div>
              <div className="mt-6">
                <Link href="/en/assistant" className="btn-ghost text-primary">
                  💬 Want to learn more about our services? Ask the Assistant →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials Section */}
      <section className="section bg-bg-alt">
        <div className="section-inner">
          <div className="text-center mb-12">
            <span className="tag mb-4">Experience & Certifications</span>
            <h2 className="heading-section text-dark mt-4">Professional Background</h2>
            <div className="brand-divider brand-divider-center mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card">
              <h3 className="heading-subsection text-dark mb-4 flex items-center gap-2">
                <span>🏢</span> Corporate Executive Experience
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-dark">RongRise Consulting</p>
                  <p className="text-text-secondary text-body-sm">Founder / Management Consultant (2024 – Present)</p>
                  <p className="text-text-secondary text-xs mt-1">Focused on AI-era talent strategy, corporate sustainability governance, SME AI empowerment</p>
                </div>
                <div>
                  <p className="font-semibold text-dark">Chubb Life Insurance</p>
                  <p className="text-text-secondary text-body-sm">SVP, HR & Administration (2022 – 2023)</p>
                  <p className="text-text-secondary text-xs mt-1">Led 30+ person team, driving organizational optimization and employer value proposition design</p>
                </div>
                <div>
                  <p className="font-semibold text-dark">Cigna Life Insurance</p>
                  <p className="text-text-secondary text-body-sm">CHRO → Compensation Director (2008 – 2022)</p>
                  <p className="text-text-secondary text-xs mt-1">Four consecutive HR Asia Awards (2020-2023); Best Employer Award, Taipei City</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="heading-subsection text-dark mb-4 flex items-center gap-2">
                <span>🎓</span> Education & Certifications
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-dark">Oxford Brookes University, UK</p>
                  <p className="text-text-secondary text-body-sm">MSc International Business Management, BA Hospitality Management</p>
                </div>
                <div>
                  <p className="font-semibold text-dark">ICHA University, Switzerland</p>
                  <p className="text-text-secondary text-body-sm">BSc Hospitality Management</p>
                </div>
                <div className="border-t border-border pt-3 mt-3">
                  <p className="text-xs font-semibold text-dark mb-2">Certifications</p>
                  <ul className="text-text-secondary text-body-sm space-y-1">
                    <li>✅ MOEA iPAS AI Application Planner Certification</li>
                    <li>✅ FSC ESG Sustainability Talent Certification</li>
                    <li>✅ ESG Sustainability Management Consultant Certification</li>
                    <li>✅ TCSA Sustainability Report Awards Volunteer Reviewer</li>
                    <li>✅ Helped employers earn 8 distinguished workplace awards</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="section bg-bg-alt">
        <div className="section-inner">
          <div className="text-center mb-12">
            <span className="tag mb-4">Areas of Expertise</span>
            <h2 className="heading-section text-dark mt-4">Core Competencies</h2>
            <div className="brand-divider brand-divider-center mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {expertise.map((item, i) => (
              <div key={i} className="card flex gap-4">
                <div className="text-3xl flex-shrink-0 mt-1">{item.icon}</div>
                <div>
                  <h3 className="heading-subsection text-dark mb-2">{item.title}</h3>
                  <p className="text-text-secondary text-body-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section">
        <div className="section-inner">
          <div className="text-center mb-12">
            <span className="tag mb-4">Journey</span>
            <h2 className="heading-section text-dark mt-4">My Career Trajectory</h2>
            <div className="brand-divider brand-divider-center mt-4" />
          </div>

          <div className="max-w-2xl mx-auto space-y-8">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-tertiary flex-shrink-0 mt-2" />
                  {i < timeline.length - 1 && (
                    <div className="w-0.5 flex-1 bg-border mt-2" />
                  )}
                </div>
                <div className="pb-4">
                  <span className="text-xs font-semibold text-tertiary">{item.year}</span>
                  <h3 className="heading-subsection text-dark mb-1">{item.title}</h3>
                  <p className="text-text-secondary text-body-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section bg-gradient-subtle">
        <div className="section-inner">
          <div className="text-center mb-12">
            <span className="tag mb-4">Core Values</span>
            <h2 className="heading-section text-dark mt-4">My Consulting Philosophy</h2>
            <div className="brand-divider brand-divider-center mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div key={i} className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">
                    {i === 0 ? "📐" : i === 1 ? "🚀" : "✅"}
                  </span>
                </div>
                <h3 className="heading-subsection text-dark mb-2">{v.title}</h3>
                <p className="text-text-secondary text-body-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-primary text-white py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="tag bg-white/15 text-white mb-4">Contact</span>
            <h2 className="heading-section mt-4 text-white">Get in Touch</h2>
            <div className="brand-divider brand-divider-center mt-4 bg-white/30" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto text-center">
            <div>
              <div className="text-3xl mb-3">📧</div>
              <h4 className="font-semibold mb-1">Email</h4>
              <a href="mailto:info@rongrise.com" className="text-white/70 text-sm hover:text-white transition-colors">info@rongrise.com</a>
            </div>
            <div>
              <div className="text-3xl mb-3">📍</div>
              <h4 className="font-semibold mb-1">Service Area</h4>
              <p className="text-white/70 text-sm">Worldwide · Online Consultation</p>
            </div>
            <div>
              <div className="text-3xl mb-3">💼</div>
              <h4 className="font-semibold mb-1">LinkedIn</h4>
              <a href="https://www.linkedin.com/in/c-j-kuo-5629b97b/" target="_blank" rel="noopener noreferrer" className="text-white/70 text-sm hover:text-white transition-colors">C.J. Kuo</a>
            </div>
          </div>

          <div className="text-center mt-10">
            <p className="text-white/80 text-body mb-6">
              Ready to start your transformation journey? Get in touch through any of the channels below,
              <br className="hidden md:block" />
              and let&apos;s explore the most suitable development path for your business together.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="mailto:info@rongrise.com" className="btn-primary bg-white text-primary font-bold hover:bg-white/95">
                ✉️ Send Email
              </a>
              <Link href="/en/downloads" className="btn-secondary border-white/40 text-white hover:bg-white/15 hover:border-white">
                📄 Download Service Brochure
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
