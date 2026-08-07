import { NextResponse } from "next/server";
import { execSync } from "child_process";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function run(cmd: string): string {
  try {
    return execSync(cmd, { timeout: 10, encoding: "utf-8" }).trim();
  } catch {
    return "";
  }
}

// ⚠️ 不要用 execSync+curl 檢查埠：本 VPS 上 node spawn curl/wget 會掛（ETIMEDOUT），
// 用 Node 內建 fetch（AbortSignal.timeout）才是可靠做法。
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

export async function GET() {
  // 第二大腦（VPS git clone）
  const brainFiles = run(`find /root/second-brain -name '*.md' -not -path '*/.git/*' | wc -l`);
  const brainRecent = run(`cd /root/second-brain && git log --since='7 days' --oneline | wc -l`);
  const brainUncommitted = run(`cd /root/second-brain && git status --porcelain | wc -l`);

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
  const disk = run(`df -h / | tail -1 | awk '{print $5}'`);
  const mem = run(`free -m | awk 'NR==2{printf "%.0f", $3/$2*100}'`);

  // 電子報訂閱數（從 newsletter-api .env 取值）
  const subscribers =
    run(
      `bash -c 'set -a; source /root/newsletter-api/.env 2>/dev/null; set +a; psql -tAc "SELECT count(*) FROM newsletter_subscribers" 2>/dev/null || echo 0'`
    ) || "0";

  // PM2 重啟次數異常偵測
  const pm2Restarts = run(`pm2 jlist 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(','.join(f'{a[\\\"name\\\"]}:{a[\\\"pm2_env\\\"][\\\"restart_time\\\"]}' for a in d))"`);

  return NextResponse.json({
    secondBrain: { files: brainFiles, recent7d: brainRecent, uncommitted: brainUncommitted },
    services,
    vps: { disk, mem },
    newsletter: { subscribers },
    pm2: pm2Restarts,
    ts: new Date().toISOString(),
  });
}
