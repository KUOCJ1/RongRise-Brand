import { NextResponse } from "next/server";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const VAULT = "/docker/hermes-agent-pnka/data/second-brain";
const NL_DIR = "/root/newsletter-api";

function run(cmd: string): string {
  try {
    return execSync(cmd, { timeout: 8000, encoding: "utf-8", maxBuffer: 8 * 1024 * 1024 }).trim();
  } catch {
    return "";
  }
}

function sanitize(q: string): string {
  // 僅允許中英數字與空白，防注入
  return q.replace(/[^\u4e00-\u9fff\u3400-\u4dbfa-zA-Z0-9\s]/g, "").trim();
}

/** 抓命中處前後文，回傳一行摘要 */
function snippet(file: string, q: string): string {
  try {
    const lines = fs.readFileSync(file, "utf-8").split("\n");
    const idx = lines.findIndex((l) => l.toLowerCase().includes(q.toLowerCase()));
    if (idx < 0) return "";
    const chunk = lines
      .slice(Math.max(0, idx - 1), idx + 2)
      .join(" ")
      .replace(/#+\s*/g, "")
      .replace(/\s+/g, " ")
      .trim();
    const at = chunk.toLowerCase().indexOf(q.toLowerCase());
    const from = Math.max(0, at - 30);
    return (from > 0 ? "…" : "") + chunk.slice(from, from + 120);
  } catch {
    return "";
  }
}

/** 從 frontmatter 取 title，取不到就用檔名 */
function titleOf(file: string): string {
  try {
    const head = fs.readFileSync(file, "utf-8").slice(0, 800);
    const m = head.match(/^title:\s*"?([^"\n]+)"?/m);
    if (m) return m[1].trim();
  } catch {
    /* ignore */
  }
  return path.basename(file, ".md");
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const raw = url.searchParams.get("q") || "";
  const q = sanitize(raw);
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [], query: raw, counts: { brain: 0, newsletter: 0 } });
  }

  // ── 第二大腦：活的 vault（原本指 /root/second-brain，慢一天）──
  const brainRaw = run(
    `grep -rl --include='*.md' -i ${JSON.stringify(q)} ${VAULT} --exclude-dir=.git 2>/dev/null | head -8`
  );
  const brainResults = brainRaw
    ? brainRaw
        .split("\n")
        .filter(Boolean)
        .map((p) => ({
          source: "brain" as const,
          title: titleOf(p),
          path: p.replace(`${VAULT}/`, ""),
          snippet: snippet(p, q),
          url: "",
        }))
    : [];

  // ── 電子報：直接搜 .md。VPS 沒有 psql，原本那條 SQL 查詢永遠回空 ──
  const nlRaw = run(`grep -rl -i ${JSON.stringify(q)} ${NL_DIR}/*.md 2>/dev/null | head -6`);
  const nlResults = nlRaw
    ? nlRaw
        .split("\n")
        .filter(Boolean)
        .map((p) => {
          const issue = path.basename(p, ".md");
          return {
            source: "newsletter" as const,
            title: titleOf(p),
            path: issue,
            snippet: snippet(p, q),
            url: `https://rong-rise.com/newsletter/${issue}`,
          };
        })
    : [];

  return NextResponse.json({
    results: [...brainResults, ...nlResults],
    query: raw,
    counts: { brain: brainResults.length, newsletter: nlResults.length },
  });
}
