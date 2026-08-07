import { NextResponse } from "next/server";
import { execSync } from "child_process";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function run(cmd: string): string {
  try {
    return execSync(cmd, { timeout: 8, encoding: "utf-8" }).trim();
  } catch {
    return "";
  }
}

function sanitize(q: string): string {
  // 僅允許中英數字與空白，防注入
  return q.replace(/[^\u4e00-\u9fff\u3400-\u4dbfa-zA-Z0-9\s]/g, "").trim();
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const raw = url.searchParams.get("q") || "";
  const q = sanitize(raw);
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [], query: raw });
  }

  // 第二大腦全文搜尋（grep -l 列出檔名）
  const brainFiles = run(
    `grep -rl --include='*.md' -i '${q}' /root/second-brain --exclude-dir=.git 2>/dev/null | head -10`
  );
  const brainResults = brainFiles
    ? brainFiles.split("\n").filter(Boolean).slice(0, 10).map((p) => ({
        source: "brain",
        title: p.replace("/root/second-brain/", ""),
        path: p,
      }))
    : [];

  // 電子報內容搜尋（若 DB 有 titles 表）
  const newsletterTitles = run(
    `bash -c 'set -a; source /root/newsletter-api/.env 2>/dev/null; set +a; psql -tAc "SELECT title FROM newsletters WHERE title ILIKE '"'"'%${q}%'"'"' LIMIT 10" 2>/dev/null || echo 0'`
  );
  const newsletterResults =
    newsletterTitles && newsletterTitles !== "0"
      ? newsletterTitles.split("\n").filter(Boolean).slice(0, 10).map((t) => ({
          source: "newsletter",
          title: t,
          path: "newsletters 表",
        }))
      : [];

  return NextResponse.json({ results: [...brainResults, ...newsletterResults], query: raw });
}
