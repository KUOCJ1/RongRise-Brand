import Link from "next/link";
import news from "@/data/news.json";

const categoryColors: Record<string, string> = {
  "課程": "bg-tertiary/10 text-tertiary",
  "媒體": "bg-secondary/10 text-secondary",
  "資源": "bg-accent/10 text-accent-strong",
  "公告": "bg-primary/10 text-primary",
  "活動": "bg-primary/10 text-primary",
};

const categoryLabels: Record<string, string> = {
  "課程": "Course",
  "媒體": "Media",
  "資源": "Resource",
  "公告": "Announcement",
  "活動": "Event",
};

// slug → English title/summary mapping for the Chinese articles surfaced here.
// Fallback: show the Chinese title as-is (the destination page is Chinese anyway).
const enCopy: Record<string, { title: string; summary: string }> = {
  "coordination-tax": {
    title: "Coordination Tax: A Seven-Step Process, One Day of Work, Nine to Eighteen Days of Waiting",
    summary: "McKinsey measured a seven-step cross-functional process: the work inside the steps takes one day, but coordination between them takes nine to eighteen days.",
  },
  "ai-incident-notification-gap": {
    title: "Australia Took Three Months to Find Out: AI Incidents Don't Need More Rules, They Need Reporting",
    summary: "The loss was small. Taking three months to notice it was the real story. Three fields any company can add today.",
  },
  "gov-ai-subsidy-three-routes": {
    title: "Choosing a Government AI Subsidy: Three Routes for Three Company Sizes",
    summary: "The most common wrong question is 'what subsidies are available?' What matters is which route fits your size.",
  },
  "perfectionism-worse-grades": {
    title: "Why Setting Higher Goals Leads to Worse Outcomes",
    summary: "A 2022 study of 2,157 university students: the group aiming for an A+ performed worse than the group aiming to simply do well.",
  },
  "ai-permitting-bottleneck": {
    title: "Nine US States Hit Pause: AI's Bottleneck Is No Longer Chips, It's Neighbours",
    summary: "New York paused approvals for a year. The constraint has moved from compute to local consent.",
  },
  "verification-economy": {
    title: "The Verification Economy: When Output Grew 19.2x, What's Valuable Is Knowing What Can Ship",
    summary: "When production gets cheap, the scarce skill is verification — deciding what is actually good enough to go out.",
  },
  "supervision-debt-ai-agents": {
    title: "Supervision Debt: Deploying AI Agents Isn't Saving Labour, It's Borrowing Supervision Hours",
    summary: "Cisco gave 90,000 employees an AI agent. The same week, research found each person spends six extra hours a week correcting it.",
  },
  "cognitive-capital-depreciation": {
    title: "Cognitive Capital Depreciation: AI Made Answers Cheap, So Why Is Judgment Losing Value?",
    summary: "Three capabilities that don't depreciate in the AI era — and why companies keep writing them off.",
  },
  "hr-function-ai-layoff-rehire-paradox": {
    title: "Lay Off HR, Then Rehire at a Premium: In the AI Era, HR's Problem Isn't Headcount",
    summary: "The paradox companies keep running into: cutting the HR function, then paying more to bring the capability back.",
  },
  "ai-compliance-2027-taiwan-sme": {
    title: "AI Rules Land in 2027: The Most Expensive Part Is Rebuilding Records Afterwards",
    summary: "Taiwan's AI compliance timeline is set. Most of the cost isn't the tooling — it's reconstructing the audit trail.",
  },
  "xiaoha-weekly-vol2": {
    title: "Xiaoha Weekly Vol.2 — He Read My Label as a Noun",
    summary: "Notes from running a fleet of AI employees: what breaks, what surprises, and what had to be written down.",
  },
};

export default function NewsEnSection() {
  const displayNews = news.news.slice(0, 4);

  return (
    <section className="section bg-gradient-subtle">
      <div className="section-inner">
        <div className="text-center mb-12">
          <span className="tag mb-4">Latest Insights</span>
          <h2 className="heading-section text-text-primary mt-4">From the Knowledge Base</h2>
          <div className="brand-divider brand-divider-center mt-4" />
        </div>

        <div className="max-w-3xl mx-auto">
          {displayNews.map((item, i) => {
            const slug = (item.link || "").split("/").filter(Boolean).pop() || "";
            const copy = enCopy[slug];
            return (
            <Link
              key={item.id}
              href={item.link}
              className={`block no-underline group ${i < displayNews.length - 1 ? 'mb-4' : ''}`}
            >
              <div className="card flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 group-hover:shadow-lg transition-all">
                <div className="flex-shrink-0 text-center sm:min-w-[70px]">
                  <div className="text-xs text-text-secondary font-medium">
                    {new Date(item.date.replace(/\./g, "-")).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {new Date(item.date.replace(/\./g, "-")).getDate()}
                  </div>
                  <div className="text-[10px] text-text-secondary">
                    {new Date(item.date.replace(/\./g, "-")).getFullYear()}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${categoryColors[item.category] || 'bg-gray-100 text-gray-600'}`}>
                      {categoryLabels[item.category] || item.category}
                    </span>
                  </div>
                  <h3 className="text-[15px] font-semibold text-text-primary group-hover:text-primary transition-colors mb-1 leading-snug">
                    {copy ? copy.title : item.title}
                  </h3>
                  <p className="text-text-secondary text-body-sm line-clamp-2">
                    {copy ? copy.summary : item.summary}
                  </p>
                </div>

                <div className="hidden sm:flex items-center flex-shrink-0 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link href="/en/knowledge" className="btn-secondary">
            Browse the Knowledge Base →
          </Link>
        </div>
      </div>
    </section>
  );
}
