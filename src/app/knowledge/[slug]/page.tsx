import Link from "next/link";
import articlesData from "@/data/articles.json";
import type { Metadata } from "next";
import ArticleTracker from "@/components/ArticleTracker";
import ArticleToc from "@/components/ArticleToc";

/* ============================================
   知識庫文章單頁 Knowledge Base Article Page
   Static Export 相容
   ============================================ */

const SITE_URL = "https://rong-rise.com";

interface Article {
  slug: string;
  cat: string;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  tags: string[];
  body: string;
}

function getArticle(slug: string): Article | undefined {
  return (articlesData as Article[]).find((a) => a.slug === slug);
}

function getRelatedArticles(currentSlug: string, cat: string): Article[] {
  return (articlesData as Article[])
    .filter((a) => a.slug !== currentSlug && a.cat === cat)
    .slice(0, 2);
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-dark font-semibold">$1</strong>')
    .replace(/`(.+?)`/g, '<code class="bg-bg-alt px-1.5 py-0.5 rounded text-sm font-mono text-primary">$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary hover:underline font-medium">$1</a>');
}

function renderBody(body: string): React.ReactNode[] {
  const lines = body.split("\n");
  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableRows: string[][] = [];
  let tableKey = 0;

  const flushTable = () => {
    if (tableRows.length > 0) {
      const headers = tableRows[0];
      const dataRows = tableRows.slice(2);
      elements.push(
        <div key={`t-${tableKey++}`} className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-primary/5">
                {headers.map((h, i) => (
                  <th
                    key={i}
                    className="px-4 py-2.5 text-left font-semibold text-primary border-b-2 border-primary/20"
                  >
                    {h.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, ri) => (
                <tr
                  key={ri}
                  className="border-b border-border-light hover:bg-bg-alt transition-colors"
                >
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2.5 text-text-secondary">
                      {cell.trim()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Table detection
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }
      const cells = line.trim().slice(1, -1).split("|");
      if (cells.every((c) => /^[\s-:]+$/.test(c))) continue;
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      flushTable();
      inTable = false;
    }

    if (line.trim() === "") continue;

    // H2
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={`h2-${i}`} className="heading-subsection text-dark mt-10 mb-4 pb-2 border-b border-border-light">
          {line.slice(3)}
        </h2>
      );
      continue;
    }

    // H3
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-lg font-semibold text-dark mt-8 mb-3">
          {line.slice(4)}
        </h3>
      );
      continue;
    }

    // Horizontal rule
    if (line.trim() === "---") {
      elements.push(<hr key={`hr-${i}`} className="my-8 border-border-light" />);
      continue;
    }

    // Unordered list
    if (line.match(/^[-•]\s/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^[-•]\s/)) {
        items.push(lines[i].replace(/^[-•]\s/, ""));
        i++;
      }
      i--;
      elements.push(
        <ul key={`ul-${i}`} className="space-y-2 my-4 ml-1">
          {items.map((item, ii) => (
            <li key={ii} className="flex items-start gap-2 text-text-secondary">
              <span className="text-tertiary mt-1.5 flex-shrink-0">•</span>
              <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (line.match(/^\d+\.\s/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      i--;
      elements.push(
        <ol key={`ol-${i}`} className="space-y-3 my-4 ml-1">
          {items.map((item, ii) => (
            <li key={ii} className="flex items-start gap-3 text-text-secondary">
              <span className="w-7 h-7 rounded-full bg-primary/10 text-primary font-semibold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                {ii + 1}
              </span>
              <span className="flex-1" dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Code block
    if (line.trim().startsWith("```")) {
      const lang = line.trim().slice(3);
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <div key={`code-${i}`} className="my-6 rounded-xl overflow-hidden border border-border">
          {lang && (
            <div className="bg-bg-dark text-white/70 text-xs px-4 py-2 font-mono">
              {lang}
            </div>
          )}
          <pre className="bg-[#1e1e2e] text-[#cdd6f4] p-4 overflow-x-auto text-sm leading-relaxed">
            <code>{codeLines.join("\n")}</code>
          </pre>
        </div>
      );
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={`bq-${i}`} className="border-l-4 border-tertiary bg-tertiary/5 rounded-r-lg px-5 py-4 my-6">
          <p className="text-text-primary font-medium italic" dangerouslySetInnerHTML={{ __html: formatInline(line.slice(2)) }} />
        </blockquote>
      );
      continue;
    }

    // Paragraph
    elements.push(
      <p key={`p-${i}`} className="text-text-secondary leading-relaxed my-4" dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
    );
  }

  if (inTable) flushTable();
  return elements;
}

// Static export: 產生所有文章頁面的 params
// 注意：原本是 async，改為 sync 以符合 Next.js 16 static export 要求
export function generateStaticParams() {
  return (articlesData as { slug: string }[]).map((a) => ({ slug: a.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    return (
      <div className="section text-center py-20">
        <h1 className="heading-section text-dark mb-4">找不到這篇文章</h1>
        <p className="text-text-secondary mb-6">請確認網址是否正確，或返回知識庫瀏覽其他文章。</p>
        <Link href="/knowledge" className="btn-secondary">返回知識庫</Link>
      </div>
    );
  }

  const related = getRelatedArticles(slug, article.cat);

  return (
    <>
      <ArticleTracker slug={slug} title={article.title} category={article.cat} />

      {/* Article Header */}
      <section className="bg-gradient-hero text-white">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-12 md:py-16">
          <Link
            href="/knowledge"
            className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-6 transition-colors"
          >
            ← 返回知識庫
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="tag bg-white/15 text-white">{article.cat}</span>
            <span className="text-white/60 text-sm">{article.date}</span>
            <span className="text-white/60 text-sm">·</span>
            <span className="text-white/60 text-sm">閱讀約 {article.readTime}</span>
          </div>
          <h1 className="heading-hero text-3xl md:text-4xl leading-tight">
            {article.title}
          </h1>
          <p className="text-white/80 text-lg mt-4 leading-relaxed">
            {article.excerpt}
          </p>
        </div>
      </section>

      {/* Article Body */}
      <section className="py-8 md:py-12">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1 rounded-full bg-primary/5 text-primary font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Content */}
          <div className="relative">
            <ArticleToc />
            <article>
              {renderBody(article.body)}
            </article>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link href="/knowledge" className="btn-secondary text-sm">
                ← 返回知識庫
              </Link>
              <div className="flex gap-3">
                <Link
                  href="/assistant"
                  className="btn-ghost text-sm text-primary"
                >
                  💬 問問小幫手
                </Link>
                <Link
                  href="/about#contact"
                  className="btn-ghost text-sm text-primary"
                >
                  📧 聯繫顧問
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="bg-bg-alt py-12 md:py-16">
          <div className="max-w-[800px] mx-auto px-4 sm:px-6">
            <h2 className="heading-subsection text-dark mb-6">相關閱讀</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {related.map((r, i) => (
                <Link
                  key={i}
                  href={`/knowledge/${r.slug}`}
                  className="card group no-underline block"
                >
                  <span className="tag mb-2">{r.cat}</span>
                  <h3 className="font-semibold text-dark group-hover:text-primary transition-colors mb-2">
                    {r.title}
                  </h3>
                  <p className="text-text-secondary text-sm line-clamp-2">
                    {r.excerpt}
                  </p>
                  <span className="text-xs text-primary mt-3 inline-block">閱讀更多 →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Article CTA */}
      <section className="py-12 md:py-16">
        <div className="max-w-[700px] mx-auto px-4 sm:px-6">
          <div className="bg-gradient-hero rounded-2xl p-8 md:p-10 text-white text-center">
            <h3 className="heading-subsection text-white mb-3">
              有問題想深入討論？
            </h3>
            <p className="text-white/80 text-body mb-6">
              每一篇文章都是轉型的起點。如果您對內容有任何疑問，或想討論如何套用在您的企業情境，歡迎預約免費諮詢。
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/about#contact" className="btn-primary bg-white text-primary font-bold hover:bg-white/95">
                ✉️ 預約免費諮詢
              </Link>
              <Link href="/assistant" className="btn-secondary border-white/40 text-white hover:bg-white/15 hover:border-white">
                💬 問問小幫手
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// slug → 文章專屬配圖檔名映射
const COVER_MAP: Record<string, string> = {
  "ai-transformation-bootcamp": "article-ai-bootcamp.jpg",
  "hr-ai-course-design": "article-hr-ai-course.jpg",
  "sme-esg-guide": "article-sme-esg.jpg",
  "manufacturing-ai-quality": "article-manufacturing-ai.jpg",
  "ai-maturity-assessment": "article-ai-maturity.jpg",
  "team-innovation-management": "article-team-innovation.jpg",
  "ai-tool-selection-guide": "article-ai-tool-selection.jpg",
  "service-ai-chatbot-case": "article-service-chatbot.jpg",
  "gov-ai-subsidy-guide": "article-gov-subsidy.jpg",
  "ai-transformation-trends-2026": "article-ai-trends-2026.jpg",
  "agentic-ai-transformation-workshop": "article-agentic-ai.jpg",
  "hr-ai-transformation-five-layers": "article-hr-five-layers.jpg",
  "strategy-subtraction-traditional-industry": "article-strategy-subtraction.jpg",
};

// 每篇文章獨立的 SEO metadata
export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const article = (articlesData as Article[]).find((a) => a.slug === params.slug);
  if (!article) {
    return { title: "文章不存在 ｜ 知識庫" };
  }
  const coverFile = COVER_MAP[params.slug] || "og-image.jpg";
  return {
    title: `${article.title} ｜ ${article.cat}`,
    description: article.excerpt,
    openGraph: {
      type: "article",
      title: `${article.title} — 榕耀管顧`,
      description: article.excerpt,
      url: `${SITE_URL}/knowledge/${article.slug}`,
      images: [
        {
          url: `${SITE_URL}/images/${coverFile}`,
          width: 800,
          height: 400,
          alt: article.title,
        },
      ],
    },
  };
}
