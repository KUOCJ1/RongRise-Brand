"use client";

import { useState } from "react";
import Link from "next/link";

/* ============================================
   English Knowledge Base Page (with filter)
   ============================================ */

const categories = ["All", "AI Transformation", "Talent Strategy", "ESG Sustainability", "Case Studies", "Tools & Resources", "Strategy Management"];

const articles = [
  {
    slug: "ai-transformation-bootcamp",
    cat: "AI Transformation",
    title: "AI Transformation Bootcamp: From Introduction to Enterprise Implementation",
    date: "2026.05.28",
    readTime: "12 min",
    excerpt: "C.J. Kuo's core lecture essentials. Covers AI evolution path, GenAI fundamentals, AI hallucination risk management, RTIF prompt engineering framework, and enterprise AI maturity model.",
    tags: ["AI Transformation", "Enterprise Implementation", "Prompt Engineering", "AI Literacy"],
  },
  {
    slug: "hr-ai-course-design",
    cat: "Talent Strategy",
    title: "HR × AI: From Understanding to Implementation — Course Design",
    date: "2026.05.28",
    readTime: "10 min",
    excerpt: "A two-day, 10-module course outline designed for HR professionals. Built on the 'Recruit→Deploy→Develop→Retain' framework, incorporating AI tool practice, prompt engineering, Talent Grid 2.0, and HR AI compliance governance.",
    tags: ["HR", "AI Training", "Talent Strategy", "Course Design"],
  },
  {
    slug: "sme-esg-guide",
    cat: "ESG Sustainability",
    title: "ESG Practical Guide for SMEs",
    date: "2025.11.10",
    readTime: "7 min",
    excerpt: "ESG isn't just for large corporations. How SMEs can implement sustainability in daily operations to create differentiated competitive advantage. From carbon footprint assessment to social impact.",
    tags: ["ESG", "Sustainability", "SMEs"],
  },
  {
    slug: "manufacturing-ai-quality",
    cat: "Case Studies",
    title: "Manufacturing AI Quality Inspection Implementation Case",
    date: "2025.10.22",
    readTime: "5 min",
    excerpt: "How a traditional manufacturer in central Taiwan successfully implemented an AI vision inspection system in three months, reducing defect rates by 40%. Sharing challenges, solutions, and key success factors.",
    tags: ["Manufacturing", "AI Application", "Quality Management"],
  },
  {
    slug: "ai-maturity-assessment",
    cat: "Tools & Resources",
    title: "Enterprise AI Maturity Self-Assessment Scale",
    date: "2025.10.05",
    readTime: "3 min",
    excerpt: "Free download! A five-dimension scale to help enterprises quickly assess their AI maturity level, covering infrastructure, data quality, talent capability, organizational culture, and application scenarios.",
    tags: ["AI Maturity", "Self-Assessment Tool", "Free Resource"],
  },
  {
    slug: "team-innovation-management",
    cat: "Talent Strategy",
    title: "Management Methods to Inspire Team Innovation",
    date: "2025.09.18",
    readTime: "6 min",
    excerpt: "Innovation isn't just a slogan. Exploring how through institutional design, incentive mechanisms, and cultural shaping, team members can proactively embrace change and propose innovative solutions.",
    tags: ["Innovation Management", "Team Leadership", "Organizational Culture"],
  },
  {
    slug: "ai-tool-selection-guide",
    cat: "Tools & Resources",
    title: "Enterprise AI Tool Selection Guide: How to Choose the Right Tool, Not the Most Expensive One",
    date: "2026.05.28",
    readTime: "8 min",
    excerpt: "Faced with a dazzling array of AI tools, how should enterprises make wise choices? A systematic AI tool selection framework from needs assessment to cost evaluation.",
    tags: ["AI Tools", "Selection Guide", "Cost Evaluation", "Implementation Strategy"],
  },
  {
    slug: "service-ai-chatbot-case",
    cat: "Case Studies",
    title: "Service Industry AI Customer Service Implementation: The Key to Reducing Complaints by 60%",
    date: "2026.05.28",
    readTime: "8 min",
    excerpt: "How a mid-sized e-commerce company reduced customer complaints by 60% and saved 45% in customer service costs within six months through an AI customer service system.",
    tags: ["Service Industry", "AI Customer Service", "Chatbot", "Cost Savings"],
  },
  {
    slug: "gov-ai-subsidy-guide",
    cat: "Tools & Resources",
    title: "2026 Government AI Incentive Resources — Complete Guide",
    date: "2026.05.28",
    readTime: "6 min",
    excerpt: "What AI-related incentives does the government offer in 2026? From the Ministry of Economic Affairs to the Ministry of Digital Affairs, a comprehensive compilation of all applicable AI transformation resources.",
    tags: ["Government Incentives", "AI Transformation", "Resource Guide", "Free Resource"],
  },
  {
    slug: "ai-transformation-trends-2026",
    cat: "AI Transformation",
    title: "2026 AI Transformation: Four Major Trends — From Tool Adoption to Organizational Change",
    date: "2026.05.28",
    readTime: "10 min",
    excerpt: "Based on the latest TechNews and iThome reports, 2026 AI transformation presents four major trends: Edge AI surge, AI Agents entering daily enterprise work, AI security becoming a top priority, government incentives accelerating.",
    tags: ["AI Transformation Trends", "2026", "Edge AI", "AI Agent", "AI Security"],
  },
  {
    slug: "agentic-ai-transformation-workshop",
    cat: "AI Transformation",
    title: "Enterprise Agentic AI Transformation Executive Alignment Workshop: A Complete Framework from Vision to Implementation",
    date: "2026.05.28",
    readTime: "12 min",
    excerpt: "How to get executives aligned on AI transformation in one day? From pre-workshop pain point discovery, Agent scenario assessment canvases, multi-agent collaboration scripts, to consultant talking points and governance frameworks.",
    tags: ["Agentic AI", "Enterprise Transformation", "Workshop Design", "Executives", "AI Governance"],
  },
  {
    slug: "hr-ai-transformation-five-layers",
    cat: "Talent Strategy",
    title: "HR's Five-Layer AI Transformation Responsibility Framework: From Organizational Friction to Strategic Influence",
    date: "2026.05.29",
    readTime: "15 min",
    excerpt: "MIT studied 300 enterprise AI cases — 95% produced no measurable P&L impact. The problem isn't technology; it's internal organizational friction. C.J. Kuo proposes a five-layer HR responsibility framework.",
    tags: ["HR", "AI Transformation", "Organizational Change", "Talent Strategy", "AI Governance", "Compensation Design"],
  },
  {
    slug: "strategy-subtraction-traditional-industry",
    cat: "Strategy Management",
    title: "Strategy is Subtraction: Why Traditional Enterprises Must Learn to 'Stop Doing'",
    date: "2026.05.29",
    readTime: "18 min",
    excerpt: "Roger Martin says the essence of strategy is choice. But in the field, I saw resources already depleted while everyone kept adding. Deep analysis from triple pressures on traditional industries to Netflix's pivotal turning point.",
    tags: ["Strategy Management", "Traditional Industry Transformation", "Generational Succession", "Family Business", "Organizational Change"],
  },
];

export default function EnKnowledgePage() {
  const [activeCat, setActiveCat] = useState("All");

  const filtered =
    activeCat === "All"
      ? articles
      : articles.filter((a) => a.cat === activeCat);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-hero text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <span className="tag bg-white/15 text-white mb-4">Knowledge Base</span>
          <h1 className="heading-hero mt-4 mb-4">Knowledge Sharing</h1>
          <p className="text-body-lg text-white/85 max-w-2xl">
            Practical insights on AI transformation, talent strategy, and ESG sustainability
            to help you navigate the transformation journey.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white border-b border-border sticky top-16 z-40">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCat === cat
                    ? "bg-primary text-white"
                    : "bg-bg-alt text-text-secondary hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="section bg-bg-alt">
        <div className="section-inner">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-text-secondary text-lg">No articles in this category yet</p>
              <button
                onClick={() => setActiveCat("All")}
                className="btn-ghost text-primary mt-4"
              >
                View All Articles
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post, i) => (
                <Link
                  key={post.slug}
                  href={`/en/knowledge/${post.slug}`}
                  className="card group no-underline flex flex-col"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="tag">{post.cat}</span>
                    <span className="text-xs text-text-secondary">{post.readTime} read</span>
                  </div>
                  <h3 className="heading-subsection text-dark group-hover:text-primary transition-colors mb-2">
                    {post.title}
                  </h3>
                  <p className="text-text-secondary text-body-sm flex-1 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-light">
                    <span className="text-xs text-text-secondary">{post.date}</span>
                    <span className="text-xs font-medium text-primary group-hover:text-secondary transition-colors">
                      Read More →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-bg-alt pt-0 pb-20">
        <div className="section-inner text-center">
          <div className="bg-white rounded-2xl border border-border p-8 md:p-12">
            <h2 className="heading-subsection mb-3">Can&apos;t Find What You Need?</h2>
            <p className="text-text-secondary text-body mb-6">
              Feel free to contact us, or ask the Assistant for more information.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/en/about#contact" className="btn-primary">
                Contact a Consultant
              </Link>
              <Link href="/en/assistant" className="btn-secondary">
                Ask the Assistant
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
