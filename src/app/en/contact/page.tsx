import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Get in Touch | RongRise Consulting",
  description: "Have questions about our services? Contact RongRise Consulting via email, LINE, or schedule a free consultation with C.J. Kuo.",
  alternates: {
    canonical: "https://rongrise.com/en/contact",
    languages: {
      zh: "https://rongrise.com/contact",
    },
  },
  openGraph: {
    title: "Contact | Get in Touch — RongRise Consulting",
    description: "Have questions? Contact RongRise Consulting via email, LINE, or schedule a free consultation.",
    images: [{ url: "https://rong-rise.com/images/og-image.jpg", width: 1200, height: 630, alt: "RongRise Consulting" }],
  },
};

export default function EnContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-hero text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <span className="tag bg-white/15 text-white mb-4">Contact</span>
          <h1 className="heading-hero mt-4 mb-4">Get in Touch</h1>
          <p className="text-body-lg text-white/85 max-w-2xl">
            Have questions about our services? Want to discuss your transformation needs?
            Reach out through any of the channels below.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="section">
        <div className="section-inner">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left: Contact Details */}
              <div>
                <h2 className="heading-section text-text-primary mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📧</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary mb-1">Email</h3>
                      <a href="mailto:info@rongrise.com" className="text-text-secondary hover:text-primary transition-colors">
                        info@rongrise.com
                      </a>
                      <p className="text-text-secondary text-sm mt-1">We typically respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📍</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary mb-1">Service Area</h3>
                      <p className="text-text-secondary">Worldwide · Online Consultation Available</p>
                      <p className="text-text-secondary text-sm mt-1">Based in Taiwan, serving clients globally</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">💬</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary mb-1">LINE Official</h3>
                      <p className="text-text-secondary">@954qxhhe</p>
                      <p className="text-text-secondary text-sm mt-1">Available for quick questions and scheduling</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🕐</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary mb-1">Consultation Hours</h3>
                      <p className="text-text-secondary">Monday – Friday: 9:00 AM – 6:00 PM (GMT+8)</p>
                      <p className="text-text-secondary text-sm mt-1">Other times available by appointment</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Quick Actions */}
              <div>
                <h2 className="heading-section text-text-primary mb-6">Quick Actions</h2>
                <div className="space-y-4">
                  <div className="card">
                    <h3 className="heading-subsection text-text-primary mb-2">Book a Free Consultation</h3>
                    <p className="text-text-secondary text-body-sm mb-4">
                      Schedule a free 30-minute consultation with C.J. Kuo to discuss your business transformation needs.
                    </p>
                    <a
                      href="mailto:info@rongrise.com?subject=Consultation%20Request"
                      className="btn-primary inline-flex items-center gap-2"
                    >
                      ✉️ Send Email
                    </a>
                  </div>

                  <div className="card">
                    <h3 className="heading-subsection text-text-primary mb-2">Ask the Assistant</h3>
                    <p className="text-text-secondary text-body-sm mb-4">
                      Our AI Assistant is available 24/7 with C.J. Kuo&apos;s complete knowledge base.
                    </p>
                    <Link href="/en/assistant" className="btn-secondary inline-flex items-center gap-2">
                      💬 Ask the Assistant →
                    </Link>
                  </div>

                  <div className="card">
                    <h3 className="heading-subsection text-text-primary mb-2">Download Resources</h3>
                    <p className="text-text-secondary text-body-sm mb-4">
                      Get our service brochure, AI maturity assessment, ESG checklist, and more.
                    </p>
                    <Link href="/en/downloads" className="btn-ghost text-primary inline-flex items-center gap-2">
                      📄 Browse Downloads →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="section bg-bg-alt">
        <div className="section-inner">
          <div className="text-center mb-8">
            <h2 className="heading-section text-text-primary mb-2">Connect on Social Media</h2>
            <p className="text-text-secondary">Follow us for the latest insights and updates</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://www.linkedin.com/in/c-j-kuo-5629b97b/"
              target="_blank"
              rel="noopener noreferrer"
              className="card flex items-center gap-3 px-6 py-4 no-underline group hover:border-primary/30 transition-colors"
            >
              <span className="text-2xl">💼</span>
              <div>
                <p className="font-semibold text-text-primary group-hover:text-primary transition-colors">LinkedIn</p>
                <p className="text-text-secondary text-sm">C.J. Kuo</p>
              </div>
            </a>

            <a
              href="https://www.facebook.com/cj.kuo1"
              target="_blank"
              rel="noopener noreferrer"
              className="card flex items-center gap-3 px-6 py-4 no-underline group hover:border-primary/30 transition-colors"
            >
              <span className="text-2xl">📘</span>
              <div>
                <p className="font-semibold text-text-primary group-hover:text-primary transition-colors">Facebook</p>
                <p className="text-text-secondary text-sm">CJ Kuo</p>
              </div>
            </a>

            <a
              href="https://www.youtube.com/@RongRiseConsulting"
              target="_blank"
              rel="noopener noreferrer"
              className="card flex items-center gap-3 px-6 py-4 no-underline group hover:border-primary/30 transition-colors"
            >
              <span className="text-2xl">📺</span>
              <div>
                <p className="font-semibold text-text-primary group-hover:text-primary transition-colors">YouTube</p>
                <p className="text-text-secondary text-sm">@RongRiseConsulting</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="heading-section text-white mb-4">Ready to Start Your Transformation Journey?</h2>
          <p className="text-white/80 text-body-lg mb-8">
            No matter what stage of transformation you&apos;re at, we can provide professional and practical advice.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:info@rongrise.com" className="btn-primary bg-white text-primary font-bold hover:bg-white/95">
              ✉️ Send Email
            </a>
            <Link href="/en/assistant" className="btn-secondary border-white/40 text-white hover:bg-white/15 hover:border-white">
              💬 Ask the Assistant
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
