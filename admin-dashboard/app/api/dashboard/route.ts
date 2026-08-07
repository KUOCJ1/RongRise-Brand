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

export async function GET() {
  const checkPort = (port: number) =>
    run(`curl -s -o /dev/null -w "%{http_code}" --max-time 3 http://localhost:${port}`) || "000";

  // 第二大腦（VPS git clone）
  const brainFiles = run(`find /root/second-brain -name '*.md' -not -path '*/.git/*' | wc -l`);
  const brainRecent = run(`cd /root/second-brain && git log --since='7 days' --oneline | wc -l`);
  const brainUncommitted = run(`cd /root/second-brain && git status --porcelain | wc -l`);

  // 服務狀態
  const services = [
    { name: "rongrise-site", port: 3001, code: checkPort(3001) },
    { name: "calendar", port: 3002, code: checkPort(3002) },
    { name: "newsletter", port: 3003, code: checkPort(3003) },
    { name: "admin-dashboard", port: 3004, code: checkPort(3004) },
    { name: "brain-portal", port: 3005, code: checkPort(3005) },
    { name: "iss-monitor", port: 3006, code: checkPort(3006) },
    { name: "brain-api", port: 3007, code: checkPort(3007) },
    { name: "ai-landing", port: 8091, code: checkPort(8091) },
  ];

  // 系統資源
  const disk = run(`df -h / | tail -1 | awk '{print $5}'`);
  const mem = run(`free -m | awk 'NR==2{printf "%.0f", $3/$2*100}'`);

  // 電子報訂閱數（從 newsletter-api .env 取值）
  const subscribers =
    run(
      `bash -c 'set -a; source /root/newsletter-api/.env 2>/dev/null; set +a; psql -tAc "SELECT count(*) FROM subscribers" 2>/dev/null || echo 0'`
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
