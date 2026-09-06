import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "研究專刊｜白皮書 — 榕耀管顧",
  description: "榕耀管顧研究專刊系列，探討 AI 時代的管理議題：心智頻寬、AI Agent 績效管理、任務變形蟲。免費閱讀。",
  alternates: {
    canonical: "https://rongrise.com/research",
  },
  openGraph: {
    title: "研究專刊｜白皮書 — 榕耀管顧",
    description: "AI 時代的管理專題研究，免費閱讀。",
    images: [{ url: "https://rong-rise.com/images/og-image.jpg", width: 1200, height: 630, alt: "榕耀管顧 RongRise Consulting" }],
  },
};

interface ResearchPaper {
  title: string;
  sub: string;
  series: string;
  desc: string;
  wordCount: string;
  date: string;
  href: string;
  hrefAlt?: { label: string; url: string };
  isNew?: boolean;
  tags: string[];
}

const papers: ResearchPaper[] = [
  {
    title: "心智頻寬詛咒",
    sub: "當管理層的大腦成為 AI 轉型最大的瓶頸",
    series: "研究專刊系列第 3 本",
    desc: "AI 輸出速度超越人類判斷速度、恐懼稅吃掉心智頻寬、判斷力正在萎縮——三股力量疊加，形成「心智頻寬詛咒」。本書提出水庫模型解釋頻寬的消耗機制，分析 AI 時代三個老問題的新面目（基本歸因謬誤、恐懼稅、管理真空），並給出三個可行方向。",
    wordCount: "12,000 字",
    date: "2026.09",
    href: "/research/mental-bandwidth-curse/",
    hrefAlt: { label: "⚡ 精華版（7 分鐘）", url: "/research/mental-bandwidth-curse/highlights/" },
    isNew: true,
    tags: ["心智頻寬", "決策疲勞", "管理真空", "認知科學"],
  },
  {
    title: "AI Agent 績效管理",
    sub: "McKinsey 給 2026 年 HR 的 5 個訊號",
    series: "研究專刊系列第 2 本",
    desc: "McKinsey 在 2026 年 8 月發表《Your AI Agents Need Performance Management Too》訪談。本書從該訪談萃出 5 個關鍵訊號——CHRO → Chief Performance Officer、AI Agent 的績效管理、業務主管才是 Agent 主人、People Technologists 新物種、HR 須理解 Agent——並與既有框架（恐懼稅、HR 五層模型、Pilot Trap）碰撞，給出落地路徑。",
    wordCount: "8,500 字",
    date: "2026.08",
    href: "/research/ai-agent-performance-management/",
    isNew: true,
    tags: ["AI Agent", "McKinsey", "HR 轉型", "績效管理"],
  },
  {
    title: "任務變形蟲",
    sub: "重新定義 AI 時代的工作單位",
    series: "研究專刊系列第 1 本",
    desc: "當 AI Agent 可以在一小時內完成人類三天的例行工作，組織設計的基本單位還是「職位」嗎？本書提出「任務變形蟲」框架：從職位本位轉向任務本位，讓工作像變形蟲一樣隨環境伸縮。含榕耀管顧 31 個 AI agent 的自身營運實證。",
    wordCount: "10,200 字",
    date: "2026.07",
    href: "/research/task-amoeba/",
    tags: ["組織設計", "任務本位", "AI Agent", "工作再定義"],
  },
];

export default function ResearchPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-hero text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <span className="tag bg-white/15 text-white mb-4">研究專刊</span>
          <h1 className="heading-hero mt-4 mb-4">白皮書・研究專刊</h1>
          <p className="text-body-lg text-white/85 max-w-2xl">
            AI 時代的管理議題，每期一個深度主題。<br />
            從現象到機制到解方，全部免費閱讀。
          </p>
        </div>
      </section>

      {/* Papers List */}
      <section className="section">
        <div className="section-inner">
          <div className="space-y-8">
            {papers.map((paper, i) => (
              <article
                key={i}
                className="card p-6 md:p-8 relative overflow-hidden"
              >
                {paper.isNew && (
                  <span className="absolute top-0 right-0 bg-tertiary text-white text-[11px] font-bold px-3 py-1 rounded-bl-xl">
                    NEW
                  </span>
                )}
                <div className="text-[12px] text-tertiary font-semibold mb-2 tracking-wider">
                  {paper.series}
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-dark mb-1">
                  {paper.title}
                </h2>
                <p className="text-text-secondary text-sm font-medium mb-3">
                  {paper.sub}
                </p>
                <p className="text-text-secondary text-body-sm mb-4 leading-relaxed">
                  {paper.desc}
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {paper.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-primary/5 text-primary/70"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-4 text-xs text-text-secondary">
                    <span>📄 {paper.wordCount}</span>
                    <span>📅 {paper.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {paper.hrefAlt && (
                      <Link
                        href={paper.hrefAlt.url}
                        className="text-xs font-medium text-text-secondary hover:text-primary border border-border rounded-full px-3 py-1.5 transition-colors"
                      >
                        {paper.hrefAlt.label}
                      </Link>
                    )}
                    <Link
                      href={paper.href}
                      className="btn-primary text-sm px-4 py-1.5"
                    >
                      閱讀全文 →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Series CTA */}
      <section className="bg-bg-alt py-16">
        <div className="max-w-[600px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="heading-subsection mb-3">持續關注新專刊</h2>
          <p className="text-text-secondary text-body mb-6">
            研究專刊系列不定期推出。訂閱榕賀觀點電子報，第一時間收到新刊通知。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/newsletter" className="btn-primary">
              📬 訂閱電子報
            </Link>
            <Link href="/about#contact" className="btn-secondary">
              預約諮詢
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}