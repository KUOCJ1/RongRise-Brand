import { NextResponse } from "next/server";
import { execSync } from "child_process";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// timeout 單位是毫秒（spawnSync 規格）。原寫 10 = 10ms，任何 shell 指令都超時。
const run = (cmd: string, fails: string[]): string => {
  try {
    return execSync(cmd, { timeout: 5000, encoding: "utf-8" }).trim();
  } catch (e) {
    fails.push(cmd.split(" ")[0]);
    console.error("[dashboard] exec failed:", cmd, (e as Error).message);
    return "";
  }
};

// 埠檢查用 Node 內建 fetch 而非 curl：省一次 spawn，也避開 spawn 逾時的坑
// （AbortSignal.timeout 同樣是毫秒）。
async function checkPort(port: number): Promise<string> {
  try {
    const res = await fetch(`http://127.0.0.1:${port}`, {
      signal: AbortSignal.timeout(2500),
      redirect: "manual",
    });
    return String(res.status);
  } catch {
    return "000";
  }
}

// 電子報訂閱數：VPS host 沒有 psql（PostgreSQL 在 Docker 容器內），
// 直接呼叫 newsletter-api 的 stats 端點取 total。
async function getNewsletterSubscribers(): Promise<string> {
  try {
    const res = await fetch(
      `http://127.0.0.1:3003/api/newsletter/stats?key=rongrise-admin-2026`,
      { signal: AbortSignal.timeout(2500) }
    );
    if (!res.ok) return "0";
    const data = await res.json();
    return String(data.total ?? "0");
  } catch {
    return "0";
  }
}

export async function GET() {
  // 第二大腦（VPS git clone）；取不到值時記進 fails，前端會顯示警示而不是留白
  const fails: string[] = [];
  const brainFiles = run(`find /root/second-brain -name '*.md' -not -path '*/.git/*' | wc -l`, fails);
  const brainRecent = run(`cd /root/second-brain && git log --since='7 days' --oneline | wc -l`, fails);
  const brainUncommitted = run(`cd /root/second-brain && git status --porcelain | wc -l`, fails);

  // 服務狀態
  const ports: [string, number][] = [
    ["rongrise-site", 3001],
    ["calendar", 3002],
    ["newsletter", 3003],
    ["admin-dashboard", 3004],
    ["brain-portal", 3005],
    ["iss-monitor", 3006],
    ["brain-api", 3007],
    ["ai-landing", 8091],
  ];
  const services = await Promise.all(
    ports.map(async ([name, port]) => ({ name, port, code: await checkPort(port) }))
  );

  // 系統資源
  const disk = run(`df -h / | tail -1 | awk '{print $5}'`, fails);
  const mem = run(`free -m | awk 'NR==2{printf "%.0f", $3/$2*100}'`, fails);

  // 電子報訂閱數（newsletter-api stats 端點）
  const subscribers = await getNewsletterSubscribers();

  // PM2 重啟次數異常偵測
  const pm2Restarts = run(`pm2 jlist 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(','.join(f'{a[\\\"name\\\"]}:{a[\\\"pm2_env\\\"][\\\"restart_time\\\"]}' for a in d))"`, fails);

  return NextResponse.json({
    secondBrain: { files: brainFiles, recent7d: brainRecent, uncommitted: brainUncommitted },
    warnings: [...new Set(fails)],
    services,
    vps: { disk, mem },
    newsletter: { subscribers },
    pm2: pm2Restarts,
    ts: new Date().toISOString(),
  });
}
