import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resource Downloads | Free Tools & Whitepapers | RongRise Consulting",
  description: "Free downloads of selected tools and resources: AI Maturity Assessment, ESG Checklist, AI Trends Report, and more. Continuously updated.",
  alternates: {
    canonical: "https://rongrise.com/en/downloads",
    languages: {
      zh: "https://rongrise.com/downloads",
    },
  },
  openGraph: {
    title: "Resource Downloads | Free Tools & Whitepapers — RongRise",
    description: "Free downloads: AI Maturity Assessment, ESG Checklist, AI Trends Report, and more.",
    images: [{ url: "https://rong-rise.com/images/og-image.jpg", width: 1200, height: 630, alt: "RongRise Consulting" }],
  },
};

interface DownloadItem {
  name: string;
  type: string;
  size: string;
  desc: string;
  href?: string;
  isNew?: boolean;
}

interface DownloadCategory {
  title: string;
  icon: string;
  items: DownloadItem[];
}

const downloadCategories: DownloadCategory[] = [
  {
    title: "Service Brochures",
    icon: "📋",
    items: [
      {
        name: "RongRise Consulting Service Overview",
        type: "PDF",
        size: "1.2 MB",
        desc: "Complete introduction to our services, core advantages, and collaboration approach.",
        href: "https://drive.google.com/file/d/1iFvZsDKs6MjgxaewB161FNFlDG1S1bDX/view?usp=sharing",
      },
      {
        name: "AI Transformation Strategy Whitepaper",
        type: "PDF",
        size: "2.8 MB",
        desc: "In-depth analysis of enterprise AI implementation strategy frameworks and practical steps.",
        href: "https://drive.google.com/file/d/1iFvZsDKs6MjgxaewB161FNFlDG1S1bDX/view?usp=sharing",
      },
    ],
  },
  {
    title: "Practical Tools",
    icon: "🛠️",
    items: [
      {
        name: "AI Maturity Self-Assessment Scale",
        type: "PDF",
        size: "61 KB",
        desc: "Free download! Assess enterprise AI maturity across five dimensions.",
        href: "https://drive.google.com/file/d/12L6UmKRu9rURwF3GZSPxIGAzT6EsmyKs/view?usp=sharing",
        isNew: true,
      },
      {
        name: "ESG Status Checklist",
        type: "PDF",
        size: "75 KB",
        desc: "A practical checklist for assessing your enterprise's current ESG implementation status.",
        href: "https://drive.google.com/file/d/1UxNhLWOJBhoxENHBX8LmzoXH-xSwpBEN/view?usp=sharing",
        isNew: true,
      },
      {
        name: "Talent Capability Assessment Template",
        type: "PDF",
        size: "78 KB",
        desc: "A structured template for building team capability maps.",
        href: "https://drive.google.com/file/d/1VOKnekMAERIpLSAnu0Usv3vKbeWGwpKs/view?usp=sharing",
      },
    ],
  },
  {
    title: "Featured Content",
    icon: "📚",
    items: [
      {
        name: "2026 AI Transformation Trends Report",
        type: "PDF",
        size: "98 KB",
        desc: "Edge AI, AI Agents, AI security, government incentives — deep analysis of four major trends.",
        href: "https://drive.google.com/file/d/1JCWY5YTSS_gfWvGx8sB7eTsE7QphdGeM/view?usp=sharing",
        isNew: true,
      },
      {
        name: "Whitepaper: Skills Transformation & Talent Development Blueprint in the GenAI Era",
        type: "PDF",
        size: "263 KB",
        desc: "In-depth analysis of GenAI's macro-level impact on talent strategy, the workplace, and enterprises.",
        href: "https://drive.google.com/file/d/19eUhNyQAb7M-BsSmlgnflaBsG1FQKMDC/view?usp=sharing",
        isNew: true,
      },
      {
        name: "Enterprise AI Tool Selection Guide",
        type: "PDF",
        size: "100 KB",
        desc: "Faced with a dazzling array of AI tools, how should enterprises make wise choices? A complete five-dimension evaluation framework.",
        href: "https://drive.google.com/file/d/1GHheU5fgiFNCONbxAtucQaKnEldQg6OU/view?usp=sharing",
        isNew: true,
      },
    ],
  },
];

export default function EnDownloadsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-hero text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <span className="tag bg-white/15 text-white mb-4">Downloads</span>
          <h1 className="heading-hero mt-4 mb-4">Resource Downloads</h1>
          <p className="text-body-lg text-white/85 max-w-2xl">
            Free downloads of selected tools and resources to help guide your transformation journey.
            Continuously updated — stay tuned.
          </p>
        </div>
      </section>

      {/* Download Categories */}
      <section className="section">
        <div className="section-inner">
          {downloadCategories.map((cat, ci) => (
            <div key={ci} className="mb-12 last:mb-0">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{cat.icon}</span>
                <h2 className="heading-subsection text-dark">{cat.title}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cat.items.map((item, ii) => (
                  <a
                    key={ii}
                    href={item.href || "#"}
                    target={item.href && item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href && item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className={`card flex items-start gap-4 group no-underline ${
                      item.href && item.href !== "#"
                        ? "cursor-pointer"
                        : "cursor-default opacity-60"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-sm">{item.type}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-dark text-[15px] group-hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                        {item.isNew && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-tertiary/10 text-tertiary font-semibold">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-text-secondary text-body-sm mb-2">{item.desc}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-text-secondary">{item.size}</span>
                        {item.href && item.href !== "#" ? (
                          <span className="text-xs font-medium text-primary group-hover:text-secondary transition-colors">
                            Download →
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-text-secondary">Coming Soon</span>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Knowledge CTA */}
      <section className="bg-gradient-subtle py-12">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="heading-subsection mb-3">Want to Understand Transformation Strategy First?</h2>
          <p className="text-text-secondary text-body mb-6">
            The Knowledge Base offers in-depth and practical transformation knowledge. We recommend reading before downloading tools.
          </p>
          <Link href="/en/knowledge" className="btn-secondary">
            Browse Knowledge Base →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-bg-alt py-16">
        <div className="max-w-[600px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="heading-subsection mb-3">Need More Customized Resources?</h2>
          <p className="text-text-secondary text-body mb-6">
            We provide one-on-one advisory consultations, tailoring transformation solutions to your enterprise&apos;s needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/en/about#contact" className="btn-primary">
              Book a Consultation
            </Link>
            <Link href="/en/assistant" className="btn-secondary">
              Ask the Assistant
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
