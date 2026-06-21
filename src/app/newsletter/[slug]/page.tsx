import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import newsletters from "@/data/newsletters.json";

// ─── Static Params for Static Export ───
export async function generateStaticParams() {
  return newsletters.newsletters.map((nl) => ({ slug: nl.slug }));
}

// ─── Metadata ───
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const nl = newsletters.newsletters.find((n) => n.slug === slug);
  if (!nl) return { title: "找不到電子報" };
  return {
    title: `${nl.title} — 榕耀管顧`,
    description: nl.summary,
    alternates: {
      canonical: `https://rong-rise.com/newsletter/${slug}`,
    },
    openGraph: {
      title: `${nl.title} — 榕耀管顧`,
      description: nl.summary,
      images: [
        {
          url: "https://rong-rise.com/images/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "榕耀管顧 RongRise Consulting",
        },
      ],
    },
  };
}

// ─── Simple Markdown → HTML Parser ───
function parseMarkdown(md: string): string {
  let html = md;

  // Remove YAML frontmatter
  html = html.replace(/^---[\s\S]*?---\n/, "");

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3 class="newsletter-h3">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="newsletter-h2">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="newsletter-h1">$1</h1>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr class="newsletter-hr" />');

  // Blockquotes
  html = html.replace(
    /^> (.+)$/gm,
    '<blockquote class="newsletter-blockquote">$1</blockquote>'
  );

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Tables
  html = html.replace(
    /\|(.+)\|\n\|[-| ]+\|\n((?:\|.+\|\n?)+)/g,
    (_match, header: string, body: string) => {
      const headers = header
        .split("|")
        .map((h: string) => h.trim())
        .filter(Boolean);
      const rows = body
        .trim()
        .split("\n")
        .map((row: string) =>
          row
            .split("|")
            .map((c: string) => c.trim())
            .filter(Boolean)
        );
      let table =
        '<div class="newsletter-table-wrap"><table class="newsletter-table"><thead><tr>';
      headers.forEach((h: string) => {
        table += `<th>${h}</th>`;
      });
      table += "</tr></thead><tbody>";
      rows.forEach((row: string[]) => {
        table += "<tr>";
        row.forEach((cell: string) => {
          table += `<td>${cell}</td>`;
        });
        table += "</tr>";
      });
      table += "</tbody></table></div>";
      return table;
    }
  );

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li class="newsletter-li">$1</li>');
  html = html.replace(
    /((?:<li class="newsletter-li">.*<\/li>\n?)+)/g,
    '<ul class="newsletter-ul">$1</ul>'
  );

  // Ordered lists (numbered items like 1. 2. 3.)
  html = html.replace(
    /^(\d+)\. (.+)$/gm,
    '<li class="newsletter-li-ordered">$2</li>'
  );

  // Links
  html = html.replace(
    /\[(.+?)\]\((.+?)\)/g,
    '<a href="$2" class="newsletter-link" target="_blank" rel="noopener">$1</a>'
  );

  // Paragraphs (lines that are not already wrapped in HTML tags)
  html = html.replace(
    /^(?!<[a-z/])((?!^\s*$).+)$/gm,
    '<p class="newsletter-p">$1</p>'
  );

  // Clean up empty lines
  html = html.replace(/\n{3,}/g, "\n\n");

  return html;
}

// ─── Page Component ───
export default async function NewsletterDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const nl = newsletters.newsletters.find((n) => n.slug === slug);

  if (!nl) {
    notFound();
  }

  // Read markdown content
  const fs = await import("fs/promises");
  const path = await import("path");

  const mdPath = path.join(
    "/opt",
    "data",
    "content-engine",
    "newsletters",
    nl.mdFile!
  );

  let mdContent = "";
  try {
    mdContent = await fs.readFile(mdPath, "utf-8");
  } catch {
    mdContent = "*內容載入中...*";
  }

  const htmlContent = parseMarkdown(mdContent);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-hero text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 md:py-16">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="tag bg-white/15 text-white">{nl.week}</span>
              {nl.id === "2026-W24" && (
                <span className="tag bg-tertiary/30 text-tertiary-light">
                  創刊號
                </span>
              )}
            </div>
            <h1 className="heading-hero mt-2 mb-3 text-white">{nl.title}</h1>
            <p className="text-body-lg text-white/80">
              {new Date(nl.date).toLocaleDateString("zh-TW", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              · 閱讀時間約 5 分鐘
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="section-inner">
          <div className="max-w-3xl mx-auto">
            <div
              className="newsletter-content"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Navigation */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link href="/newsletter" className="btn-secondary">
                  ← 返回電子報列表
                </Link>
                <Link href="/#newsletter" className="btn-primary">
                  📬 訂閱最新一期
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
