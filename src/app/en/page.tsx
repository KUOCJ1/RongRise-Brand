import Link from "next/link";
import CaseStudiesEnSection from "@/components/CaseStudiesEn";
import TestimonialsEnSection from "@/components/TestimonialsEn";
import ServiceFlowEnSection from "@/components/ServiceFlowEn";
import NewsEnSection from "@/components/NewsEnSection";
import FAQEnSection from "@/components/FAQEnSection";
import FAQSchema from "@/components/FAQSchema";
import ReviewSchema from "@/components/ReviewSchema";
import NewsletterEnSection from "@/components/NewsletterEn";
import ScrollTracker from "@/components/ScrollTracker";
import TrackLink from "@/components/TrackLink";
import faqData from "@/data/faq-en.json";
import coursesData from "@/data/courses-en.json";

export default function EnHomePage() {
  return (
    <>
      <ScrollTracker />
      {/* Hero */}
      <section className="bg-gradient-hero text-white relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-20 md:py-28 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
              <span className="text-sm font-medium">Smart Transformation, Innovative Future</span>
            </div>
            <h1 className="heading-hero mb-6 animate-fade-in-up">
              From Talent Strategy to
              <br />
              <span className="text-tertiary-light">AI Implementation</span>
            </h1>
            <p className="text-body-lg text-white/85 mb-8 animate-fade-in-up animation-delay-200">
              Helping businesses drive sustainable growth by combining forward-thinking
              strategies with practical solutions in the AI era.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up animation-delay-300">
              <TrackLink href="/en/about#contact" className="btn-primary bg-white text-primary font-bold hover:bg-white/95 shadow-lg shadow-white/20" trackLabel="Book Consultation" trackLocation="en_hero">
                Book a Consultation
              </TrackLink>
              <TrackLink href="/en/knowledge" className="btn-secondary bg-white/15 border-white/50 text-white font-semibold hover:bg-white/25 hover:border-white shadow-md shadow-white/10" trackLabel="Explore Knowledge" trackLocation="en_hero">
                Explore Knowledge Base
              </TrackLink>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section bg-bg-alt">
        <div className="section-inner">
          <div className="text-center mb-12">
            <span className="tag mb-4">Core Services</span>
            <h2 className="heading-section text-dark mt-4">Three Pillars Driving Business Transformation</h2>
            <div className="brand-divider brand-divider-center mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "🤖", title: "AI Transformation Strategy", desc: "From assessment to implementation, build a customized AI transformation blueprint.", tag: "AI" },
              { icon: "👥", title: "Talent Development Strategy", desc: "Build a future-ready workforce with digital capability training and change management.", tag: "Talent" },
              { icon: "🌱", title: "ESG Sustainability", desc: "Integrate sustainability into business strategy with measurable ESG metrics.", tag: "ESG" },
            ].map((s, i) => (
              <div key={i} className="card group animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="text-4xl mb-4">{s.icon}</div>
                <span className="tag mb-3">{s.tag}</span>
                <h3 className="heading-subsection text-dark mb-3">{s.title}</h3>
                <p className="text-text-secondary text-body leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/en/services" className="btn-secondary">View All Services →</Link>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <CaseStudiesEnSection />

      {/* About Preview */}
      <section className="section">
        <div className="section-inner">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="tag mb-4">About C.J. Kuo</span>
              <h2 className="heading-section mt-4 mb-4">
                Professional, Innovative, and
                <br /><span className="text-primary">Practical Consulting Partner</span>
              </h2>
              <div className="brand-divider mb-6" />
              <p className="text-text-secondary text-body-lg mb-4">
                C.J. Kuo has years of multinational corporate experience, specializing in helping SMEs navigate digital transformation.
              </p>
              <p className="text-text-secondary text-body mb-6">
                Data-driven, strategy-focused, goal-oriented — not just proposing solutions, but walking alongside businesses through every step of their transformation journey.
              </p>
              <Link href="/en/about" className="btn-secondary">Learn More →</Link>
            </div>
            <div className="bg-gradient-hero rounded-2xl p-8 md:p-10 text-white">
              <blockquote className="text-lg md:text-xl leading-relaxed font-medium mb-6 text-white">
                "True transformation is not a technology upgrade — it's a mindset revolution. When talent, strategy, and technology align, businesses create lasting competitive advantage amid change."
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30 flex-shrink-0">
                  <img src="/images/cj-photo.jpg" alt="C.J. Kuo" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-sm">C.J. Kuo</p>
                  <p className="text-white/70 text-xs">Founder, RongRise Consulting</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsEnSection />
      <ReviewSchema />

      {/* Knowledge */}
      <section className="section bg-gradient-subtle">
        <div className="section-inner">
          <div className="text-center mb-12">
            <span className="tag mb-4">Featured Content</span>
            <h2 className="heading-section text-dark mt-4">Latest Knowledge Sharing</h2>
            <div className="brand-divider brand-divider-center mt-4" />
          </div>
          <div className="text-center">
            <Link href="/en/knowledge" className="btn-secondary">Explore Knowledge Base →</Link>
          </div>
        </div>
      </section>

      {/* Service Flow */}
      <ServiceFlowEnSection />

      {/* ESG Assessment */}
      <section className="bg-primary py-16">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 text-center">
          <span className="tag bg-white/15 text-white mb-4">Interactive Tool</span>
          <h2 className="heading-section text-white mt-4 mb-4">ESG + AI Transformation Self-Assessment</h2>
          <p className="text-white/85 text-body-lg mb-8">
            25 questions to assess your business's maturity in ESG sustainability and AI transformation. Get personalized recommendations upon completion.
          </p>
          <Link href="/en/esg-assessment" className="btn-primary bg-white text-primary font-bold hover:bg-white/95 shadow-lg shadow-white/20 inline-flex items-center gap-2">
            🔍 Start Free Assessment
          </Link>
        </div>
      </section>

      {/* Upcoming Courses */}
      <section className="section bg-white">
        <div className="section-inner">
          <div className="text-center mb-12">
            <span className="tag mb-4">Upcoming Courses</span>
            <h2 className="heading-section text-dark mt-4">Learning Is the Best Transformation Investment</h2>
            <div className="brand-divider brand-divider-center mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {coursesData.courses.slice(0, 4).map((course) => (
              <div key={course.id} className="card flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="tag">{course.type}</span>
                  <span className="text-xs text-text-secondary">
                    {new Date(course.date).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                  </span>
                </div>
                <h3 className="heading-subsection text-dark mb-2">{course.title}</h3>
                <p className="text-text-secondary text-body-sm mb-4 flex-1">{course.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border-light">
                  <span className="text-sm font-semibold text-primary">{course.price}</span>
                  <Link href="/en/courses" className="btn-ghost text-sm text-primary">Details →</Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/en/courses" className="btn-secondary">View All Courses →</Link>
          </div>
        </div>
      </section>

      {/* News */}
      <NewsEnSection />

      {/* FAQ */}
      <FAQEnSection />
      <FAQSchema faq={faqData.faq} />

      {/* Lead Magnet */}
      <section className="section bg-bg-alt">
        <div className="section-inner">
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-hero rounded-2xl p-8 text-white flex flex-col justify-between">
                <div>
                  <span className="tag bg-white/15 text-white mb-4">Free Resources</span>
                  <h3 className="heading-subsection text-white mt-4 mb-3">Get a Complete Transformation Toolkit</h3>
                  <p className="text-white/80 text-body mb-6">AI Maturity Assessment + ESG Checklist + AI Trends Report. All free, no strings attached.</p>
                  <ul className="space-y-2 mb-6">
                    {["AI Maturity Self-Assessment", "ESG Status Checklist", "2026 AI Transformation Trends Report", "AI Tool Selection Guide"].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-white/85">
                        <svg className="w-4 h-4 flex-shrink-0 text-accent" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/en/downloads" className="btn-primary bg-white text-primary font-bold hover:bg-white/95 text-center">Download Now →</Link>
              </div>
              <div className="flex flex-col gap-6">
                <div className="card flex-1 flex flex-col justify-center">
                  <h3 className="heading-subsection text-dark mb-3">Want Someone to Guide You?</h3>
                  <p className="text-text-secondary text-body mb-4">Book a free 30-minute consultation. C.J. Kuo will provide actionable advice based on your business situation.</p>
                  <Link href="/en/about#contact" className="btn-primary text-center">Book Free Consultation</Link>
                </div>
                <div className="card flex-1 flex flex-col justify-center">
                  <h3 className="heading-subsection text-dark mb-3">Have Questions First?</h3>
                  <p className="text-text-secondary text-body mb-4">The Assistant is available 24/7 with C.J. Kuo's complete knowledge base.</p>
                  <Link href="/en/assistant" className="btn-secondary text-center">Ask the Assistant →</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterEnSection />

      {/* Final CTA */}
      <section className="bg-primary py-16">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="heading-section text-white mb-4">Ready to Start Your Transformation Journey?</h2>
          <p className="text-white/80 text-body-lg mb-8">
            No matter what stage of transformation you're at, we can provide professional and practical advice.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/en/about#contact" className="btn-primary">Book a Consultation</Link>
            <Link href="/en/assistant" className="btn-secondary border-white/40 text-white hover:bg-white/15 hover:border-white">Ask the Assistant</Link>
          </div>
        </div>
      </section>
    </>
  );
}
