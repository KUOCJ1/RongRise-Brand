"use client";
import { useEffect, useState } from "react";
import { Globe } from "lucide-react";

type Service = { name: string; port: number; code: string };

export default function WebsitePage() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => setServices(d.services ?? []))
      .catch(() => setServices([]));
  }, []);

  const badge = (code: string) =>
    ["200", "401", "404"].includes(code) ? (
      <span className="badge ok">UP</span>
    ) : (
      <span className="badge bad">{code || "DOWN"}</span>
    );

  return (
    <div>
      <h1 className="page-title">官網服務監控</h1>
      <p className="page-sub">各後端服務 localhost 端口健康狀態</p>

      <div className="panel">
        <h3><Globe size={16} /> 服務列表</h3>
        <table>
          <thead>
            <tr><th>服務</th><th>Port</th><th>HTTP</th><th>狀態</th></tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.name}>
                <td><strong>{s.name}</strong></td>
                <td className="mono">{s.port}</td>
                <td className="mono">{s.code}</td>
                <td>{badge(s.code)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="panel">
        <h3>對外 Domain</h3>
        <table>
          <thead>
            <tr><th>Domain</th><th>後端</th></tr>
          </thead>
          <tbody>
            <tr><td>rong-rise.com</td><td>3001 (site) + /calendar → 3002 + /api → 3002</td></tr>
            <tr><td>admin.rong-rise.com</td><td>3004（含 /iss → 3006）</td></tr>
            <tr><td>brain.rong-rise.com</td><td>3005 (portal) + /api/* → 3007 (brain-api)</td></tr>
            <tr><td>ai.rong-rise.com</td><td>8091 (Next.js)</td></tr>
            <tr><td>assess.rong-rise.com</td><td>nginx 8090 → /var/www/ai-assessment</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
