import { NextResponse } from "next/server";
import { execSync } from "child_process";
import fs from "fs";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// ── 路徑（VPS host 上的實際位置）───────────────────────────────
// 第二大腦要看「活的 vault」（bind mount），不是 /root 那個每日才 pull 一次的 clone，
// 否則數字會慢一天（2026-11-05 修）。
const VAULT = "/docker/hermes-agent-pnka/data/second-brain";
const CRON_JOBS = "/docker/hermes-agent-pnka/data/cron/jobs.json";
const NL_DIR = "/root/newsletter-api";

type Svc = {
  name: string;
  label: string;
  port: number;
  code: string;
  state: "up" | "idle" | "down";
  note?: string;
};

const run = (cmd: string, fails: string[]): string => {
  try {
    // timeout 單位是毫秒；maxBuffer 放大，pm2 jlist 會超過預設 1MB
    return execSync(cmd, { timeout: 8000, encoding: "utf-8", maxBuffer: 8 * 1024 * 1024 }).trim();
  } catch (e) {
    fails.push(cmd.split(" ")[0]);
    console.error("[dashboard] exec failed:", cmd, (e as Error).message);
    return "";
  }
};

async function checkPort(port: number): Promise<string> {
  try {
    const res = await fetch(`http://127.0.0.1:${port}`, {
      signal: AbortSignal.timeout(2000),
      redirect: "manual",
    });
    return String(res.status);
  } catch {
    return "000";
  }
}

/** 2xx/3xx = 正常；4xx = 活著但根路徑沒有路由（API-only 服務）；000/5xx = 異常 */
function classify(code: string): "up" | "idle" | "down" {
  if (code === "000") return "down";
  const n = Number(code);
  if (n >= 200 && n < 400) return "up";
  if (n >= 400 && n < 500) return "idle";
  return "down";
}

// ── 電子報 ────────────────────────────────────────────────────
function nextGate(): Date {
  // 閘門＝VPS cron `0 1,13 * * *`（UTC）＝台北 09:00／21:00
  const now = new Date();
  const cands = [1, 13].map((h) => {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), h, 0, 0, 0));
    if (d.getTime() <= now.getTime()) d.setUTCDate(d.getUTCDate() + 1);
    return d;
  });
  return cands.sort((a, b) => a.getTime() - b.getTime())[0];
}

function fmtTPE(d: Date, withTime = true): string {
  return d.toLocaleString("zh-TW", {
    timeZone: "Asia/Taipei",
    hour12: false,
    month: "2-digit",
    day: "2-digit",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

function readNewsletter() {
  const out = {
    pending: [] as string[],
    lastSent: { issue: "", at: "" },
    nextGate: "",
    nextGateIn: "",
  };
  try {
    const files = fs.readdirSync(NL_DIR);
    const issued = files.filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
    const sent = new Set(files.filter((f) => f.endsWith(".SENT")).map((f) => f.replace(/\.SENT$/, "")));
    const approved = new Set(files.filter((f) => f.endsWith(".APPROVED")).map((f) => f.replace(/\.APPROVED$/, "")));
    out.pending = issued.filter((i) => approved.has(i) && !sent.has(i)).sort();

    let latest = 0;
    for (const i of issued) {
      if (!sent.has(i)) continue;
      const st = fs.statSync(`${NL_DIR}/${i}.SENT`);
      if (st.mtimeMs > latest) {
        latest = st.mtimeMs;
        out.lastSent = { issue: i, at: fmtTPE(new Date(st.mtimeMs)) };
      }
    }
  } catch (e) {
    console.error("[dashboard] newsletter read failed:", (e as Error).message);
  }

  const g = nextGate();
  out.nextGate = fmtTPE(g);
  const mins = Math.max(0, Math.round((g.getTime() - Date.now()) / 60000));
  out.nextGateIn = mins >= 60 ? `${Math.floor(mins / 60)} 小時 ${mins % 60} 分` : `${mins} 分`;
  return out;
}

async function getSubscribers(): Promise<string> {
  try {
    const res = await fetch("http://127.0.0.1:3003/api/newsletter/stats?key=rongrise-admin-2026", {
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) return "";
    const data = await res.json();
    return String(data.total ?? "");
  } catch {
    return "";
  }
}

// ── Cron 部隊 ─────────────────────────────────────────────────
type CronInfo = {
  total: number;
  enabled: number;
  failed: { name: string; id: string; last: string }[];
  next: { name: string; when: string }[];
};

function readCron(): CronInfo | null {
  try {
    const raw = JSON.parse(fs.readFileSync(CRON_JOBS, "utf-8"));
    const jobs: any[] = Array.isArray(raw) ? raw : raw.jobs ?? [];
    const enabled = jobs.filter((j) => j.enabled);
    const bad = jobs.filter(
      (j) => j.enabled && j.last_status && !["ok", "success", "None", "null"].includes(String(j.last_status))
    );
    const upcoming = enabled
      .filter((j) => j.next_run_at)
      .sort((a, b) => String(a.next_run_at).localeCompare(String(b.next_run_at)))
      .slice(0, 6)
      .map((j) => ({ name: j.name ?? j.id, when: fmtTPE(new Date(j.next_run_at)) }));
    return {
      total: jobs.length,
      enabled: enabled.length,
      failed: bad.slice(0, 6).map((j) => ({ name: j.name ?? j.id, id: j.id, last: String(j.last_status) })),
      next: upcoming,
    };
  } catch (e) {
    console.error("[dashboard] cron read failed:", (e as Error).message);
    return null;
  }
}

// ── PM2 ───────────────────────────────────────────────────────
function readPm2(fails: string[]) {
  try {
    const raw = run("pm2 jlist", fails);
    if (!raw) return { items: [] as any[], total: 0 };
    const arr = JSON.parse(raw);
    const items = arr.map((a: any) => ({
      name: a.name,
      restarts: a.pm2_env?.restart_time ?? 0,
      status: a.pm2_env?.status ?? "unknown",
      memMb: Math.round((a.monit?.memory ?? 0) / 1024 / 1024),
    }));
    items.sort((a: any, b: any) => b.restarts - a.restarts);
    return { items, total: items.length };
  } catch (e) {
    fails.push("pm2");
    console.error("[dashboard] pm2 parse failed:", (e as Error).message);
    return { items: [] as any[], total: 0 };
  }
}

export async function GET() {
  const fails: string[] = [];

  const brainFiles = run(`find ${VAULT} -name '*.md' -not -path '*/.git/*' | wc -l`, fails);
  const gitSafe = `git -c safe.directory=${VAULT} -C ${VAULT}`;
  const brainRecent = run(`${gitSafe} log --since='7 days' --oneline | wc -l`, fails);
  const brainUncommitted = run(`${gitSafe} status --porcelain | wc -l`, fails);
  const brainLast = run(`${gitSafe} log -1 --format='%cs %s'`, fails);

  const portDefs: [string, string, number, string?][] = [
    ["site", "官網（Next）", 3001],
    ["calendar", "行事曆 API", 3002],
    ["newsletter", "電子報 API", 3003, "根路徑無路由，404 屬正常"],
    ["admin", "Admin 儀表板", 3004],
    ["brain-portal", "第二大腦 Portal", 3005],
    ["iss-monitor", "系統監控（ISS）", 3006, "需登入，401 屬正常"],
    ["brain-api", "第二大腦 API", 3007, "根路徑無路由，404 屬正常"],
    ["cognee", "Cognee Bridge", 3100, "只綁 127.0.0.1"],
    ["ai-landing", "AI 諮詢頁", 8091],
    ["launchpad", "行動工作台", 8092],
    ["n8n", "n8n 自動化", 5678],
    ["hermes", "Hermes Gateway", 8642, "需金鑰，401 屬正常"],
  ];
  const services: Svc[] = await Promise.all(
    portDefs.map(async ([name, label, port, note]) => {
      const code = await checkPort(port);
      return { name, label, port, code, state: classify(code), note };
    })
  );

  const disk = run(`df -P / | tail -1 | awk '{print $5" "$3" "$2}'`, fails).split(" ");
  const memRaw = run(`free -m | awk 'NR==2{printf "%s %s", $3, $2}'`, fails).split(" ");
  const load = run(`cat /proc/loadavg | cut -d' ' -f1-3`, fails);
  const uptime = run(`uptime -p | sed 's/^up //'`, fails);

  const [subscribers, nl] = await Promise.all([getSubscribers(), Promise.resolve(readNewsletter())]);
  const cron = readCron();
  const pm2 = readPm2(fails);

  const diskPct = Number((disk[0] || "0").replace("%", ""));
  const memPct = memRaw[1] ? Math.round((Number(memRaw[0]) / Number(memRaw[1])) * 100) : 0;

  // ── 待處理警示（給人看的優先順序）──
  const issues: { level: "warn" | "bad"; text: string }[] = [];
  const downSvc = services.filter((s) => s.state === "down");
  if (downSvc.length) {
    issues.push({ level: "bad", text: `${downSvc.length} 個服務沒有回應：${downSvc.map((s) => s.label).join("、")}` });
  }
  if (diskPct >= 85) issues.push({ level: "bad", text: `磁碟 ${diskPct}%，已進入自動清理警戒` });
  else if (diskPct >= 80) issues.push({ level: "warn", text: `磁碟 ${diskPct}%，接近上限` });
  if (memPct >= 90) issues.push({ level: "warn", text: `記憶體 ${memPct}%` });
  if (cron?.failed.length) {
    issues.push({
      level: "bad",
      text: `${cron.failed.length} 支 cron 上次執行失敗：${cron.failed.map((f) => f.name).join("、")}`,
    });
  }
  if (Number(brainUncommitted) > 20) {
    issues.push({ level: "warn", text: `第二大腦有 ${brainUncommitted} 個未提交變更` });
  }
  if (nl.pending.length) {
    issues.push({ level: "warn", text: `電子報有 ${nl.pending.length} 期待寄：${nl.pending.join("、")}` });
  }
  if (fails.length) {
    issues.push({
      level: "warn",
      text: `量測失敗：${[...new Set(fails)].join("、")}（顯示 — 代表取不到，不是 0）`,
    });
  }

  const health = issues.some((i) => i.level === "bad") ? "bad" : issues.length ? "warn" : "ok";

  return NextResponse.json({
    ts: new Date().toISOString(),
    health,
    issues,
    warnings: [...new Set(fails)],
    secondBrain: {
      files: brainFiles,
      recent7d: brainRecent,
      uncommitted: brainUncommitted,
      last: brainLast,
    },
    services,
    vps: {
      disk: disk[0] || "",
      diskPct,
      diskUsed: disk[1] || "",
      diskTotal: disk[2] || "",
      mem: memPct,
      memUsed: memRaw[0] || "",
      memTotal: memRaw[1] || "",
      load,
      uptime,
    },
    newsletter: { subscribers: subscribers || "", ...nl },
    cron,
    pm2,
  });
}
