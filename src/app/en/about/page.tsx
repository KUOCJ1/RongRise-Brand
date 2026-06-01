import Link from "next/link";
import type { Metadata } from "next";
import YouTubeEmbed from "@/components/YouTubeEmbed";

export const metadata: Metadata = {
  title: "About C.J. Kuo | AI Transformation Consultant",
  description: "C.J. Kuo — 16+ years of multinational corporate experience. Former HR executive at Chubb Life, Cigna Life. Founder of RongRise Consulting.",
};

const timeline = [
  { year: "1999-2008", title: "International Management Consulting", desc: "Accenture (serving TSMC, Compal), EY Pre-Sales Manager, Watson Wyatt Senior Consultant — expertise in rewards strategy and human capital transformation." },
  { year: "2008-2023", title: "Multinational Financial Corporate HR Executive", desc: "CHUBB Life HR SVP leading 30+ team; Cigna Life CHRO with 4 consecutive HR Asia Awards. Helped employers win 8 workplace excellence awards." },
  { year: "2024-Present", title: "Founded RongRise Consulting", desc: "Focused on AI-era talent strategy, ESG governance, and SME AI empowerment. Served 300+ enterprises." },
];

const expertise = [
  { icon: "🤖", title: "AI Transformation Consulting", desc: "AI maturity assessment, Agentic AI strategy, human-AI collaboration design, AI governance framework" },
  { icon: "🎯", title: "Talent Development Strategy", desc: "Organizational capability building, digital talent training, succession planning, performance management" },
  { icon: "🌿", title: "ESG Sustainability Consulting", desc: "ESG assessment, sustainability strategy, TCSA report advisory, supply chain carbon tracking" },
  { icon: "💡", title: "Innovation Management", desc: "Business model innovation, digital transformation roadmap, change management, workshop facilitation" },
];

const values = [
  { title: "Professional Rigor", desc: "Every recommendation backed by data and theory, with precise terminology and clear logic." },
  { title: "Forward Innovation", desc: "Embracing new technology, helping businesses seize initiative rather than catch up passively." },
  { title: "Practical Execution", desc: "Every solution focuses on executability, creating visible value for businesses." },
];

export default function AboutEnPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-hero text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="max-w-2xl">
            <span className="tag bg-white/15 text-white">About Me</span>
            <h1 className="heading-hero mt-4 mb-4">
              C.J. Kuo
            </h1>
            <p className="text-body-lg text-white/85">
              Founder & Business Transformation Consultant<br />
              Helping businesses from talent strategy to AI implementation.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section">
        <div className="section-inner">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <div className="w-72 md:w-80 rounded-2xl overflow-hidden border-4 border-white shadow-xl ring-4 ring-primary/10">
                <img src="/images/cj-portrait-full.jpg" alt="C.J. Kuo — Founder of RongRise Consulting" className="w-full h-full object-cover" loading="lazy" width={594} height={884} />
              </div>
            </div>
            <div>
              <h2 className="heading-section mb-4">My<span className="text-primary">Story</span></h2>
              <div className="brand-divider mb-6" />
              <div className="space-y-4 text-text-secondary text-body leading-relaxed">
                <p>
                  <strong className="text-dark">16+ years of multinational HR management experience</strong>, including Accenture, Ernst & Young, Watson Wyatt, Chubb Life, and Cigna Life. Specialized in organizational talent strategy, rewards design, employer brand, and HR digital transformation — helping employers win <strong className="text-dark">8 workplace excellence awards</strong>.
                </p>
                <p>
                  However, the moment that truly pushed him to leave the corporate world was a conversation with a manufacturing business owner who said: <em>"I know AI is important, but my team can barely use Excel. What should I do?"</em> That was when he realized — transformation lacks technology, but more importantly, someone willing to walk the journey with businesses.
                </p>
                <p>
                  Since 2024, as an independent consultant and trainer, focusing on <strong className="text-dark">AI-era talent strategy</strong>, <strong className="text-dark">ESG governance</strong>, and <strong className="text-dark">SME AI empowerment</strong>.
                </p>
                <p>
                  Different from pure theorists or pure tool-focused vendors, C.J. Kuo's core value is — combining real AI tools and implementation experience from a human strategy perspective, designing <strong className="text-dark">executable transformation paths</strong>.
                </p>
              </div>
              <div className="mt-6">
                <Link href="/en/assistant" className="btn-ghost text-primary">
                  💬 Want to learn more? Ask the Assistant →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="section bg-bg-alt">
        <div className="section-inner">
          <div className="text-center mb-8">
            <span className="tag mb-4">Meet C.J. Kuo</span>
            <h2 className="heading-section text-dark mt-4">Hear It Directly</h2>
            <div className="brand-divider brand-divider-center mt-4" />
          </div>
          <div className="max-w-3xl mx-auto">
            <YouTubeEmbed channelId="UCFfz1iDwqqRfjWgR7GhVMGA" title="C.J. Kuo — RongRise Consulting YouTube" />
            <p className="text-center text-text-secondary text-sm mt-4">
              📺 Subscribe to <a href="https://www.youtube.com/@RongRiseConsulting" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">YouTube Channel @RongRiseConsulting</a>
            </p>
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="section">
        <div className="section-inner">
          <div className="text-center mb-12">
            <span className="tag mb-4">Expertise</span>
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

      {/* Timeline */}
      <section className="section bg-bg-alt">
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
                  {i < timeline.length - 1 && <div className="w-0.5 flex-1 bg-border mt-2" />}
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

      {/* Values */}
      <section className="section bg-gradient-subtle">
        <div className="section-inner">
          <div className="text-center mb-12">
            <span className="tag mb-4">Values</span>
            <h2 className="heading-section text-dark mt-4">My Consulting Philosophy</h2>
            <div className="brand-divider brand-divider-center mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div key={i} className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{i === 0 ? "📐" : i === 1 ? "🚀" : "✅"}</span>
                </div>
                <h3 className="heading-subsection text-dark mb-2">{v.title}</h3>
                <p className="text-text-secondary text-body-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-primary text-white py-16">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 text-center">
          <span className="tag bg-white/15 text-white mb-4">Get in Touch</span>
          <h2 className="heading-section mt-4 text-white mb-4">Ready to Transform?</h2>
          <p className="text-white/80 text-body-lg mb-6">
            Whether you are just starting or deep into your transformation journey, let us find the best path together.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:info@rongrise.com" className="btn-primary bg-white text-primary font-bold hover:bg-white/95">
              ✉️ Send Email
            </a>
            <Link href="/en/downloads" className="btn-secondary border-white/40 text-white hover:bg-white/15 hover:border-white">
              📄 Download Brochure
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
