"use client";
import { Globe } from "lucide-react";
import { Kpi, PageHeader, SvcPill } from "../components/ui";
import { useDashboard } from "../components/useDashboard";

export default function WebsitePage() {
  const { data, err, loading, updatedAt, reload } = useDashboard();
  const svc = data?.services ?? [];
  const up = svc.filter((s) => s.state === "up").length;

  return (
    <div>
      <PageHeader
        title="官網服務監控"
        sub="對外網站與後端服務的即時狀態"
        updatedAt={updatedAt}
        onRefresh={reload}
        loading={loading}
      />

      {err && <div className="error-box">{err}</div>}

      <div className="grid">
        <Kpi
          label="服務正常"
          icon={<Globe size={14} />}
          value={svc.length ? `${up}/${svc.length}` : "—"}
          tone={up === svc.length ? "ok" : "warn"}
          hint="4xx 會標成「存活」：有回應但根路徑沒有路由"
        />
      </div>

      <div className="panel">
        <h3>
          <Globe size={16} /> 服務列表
        </h3>
        <table>
          <thead>
            <tr>
              <th>服務</th>
              <th>Port</th>
              <th>狀態</th>
              <th className="hide-sm">備註</th>
            </tr>
          </thead>
          <tbody>
            {svc.map((s) => (
              <tr key={s.name}>
                <td>
                  <strong>{s.label}</strong>
                  <div className="sub mono">{s.name}</div>
                </td>
                <td className="mono">{s.port}</td>
                <td>
                  <SvcPill state={s.state} code={s.code} />
                </td>
                <td className="hide-sm page-sub" style={{ marginBottom: 0 }}>
                  {s.note ?? ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="panel">
        <h3>對外網域 → 後端對照</h3>
        <table>
          <thead>
            <tr>
              <th>網域</th>
              <th>路徑</th>
              <th>後端</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>rong-rise.com</td>
              <td>其餘全部</td>
              <td>3001 官網（Next static）</td>
            </tr>
            <tr>
              <td>rong-rise.com</td>
              <td>/calendar、/api</td>
              <td>3002 行事曆</td>
            </tr>
            <tr>
              <td>rong-rise.com</td>
              <td>/api/newsletter、/api/courses/enroll*</td>
              <td>3003 電子報 API</td>
            </tr>
            <tr>
              <td>rong-rise.com</td>
              <td>/api/assistant</td>
              <td>public-assistant</td>
            </tr>
            <tr>
              <td>rong-rise.com</td>
              <td>/ops</td>
              <td>3001 營運總覽（獨立帳密）</td>
            </tr>
            <tr>
              <td>admin.rong-rise.com</td>
              <td>/</td>
              <td>3004 本儀表板</td>
            </tr>
            <tr>
              <td>admin.rong-rise.com</td>
              <td>/iss</td>
              <td>3006 系統監控</td>
            </tr>
            <tr>
              <td>brain.rong-rise.com</td>
              <td>/api/*</td>
              <td>3007 第二大腦 API</td>
            </tr>
            <tr>
              <td>brain.rong-rise.com</td>
              <td>其餘</td>
              <td>3005 知識庫 Portal</td>
            </tr>
            <tr>
              <td>ai.rong-rise.com</td>
              <td>—</td>
              <td>8091 AI 諮詢頁</td>
            </tr>
            <tr>
              <td>assess.rong-rise.com</td>
              <td>—</td>
              <td>nginx 8090 靜態站</td>
            </tr>
            <tr>
              <td>launch.rong-rise.com</td>
              <td>—</td>
              <td>8092 行動工作台</td>
            </tr>
            <tr>
              <td>workspace.rong-rise.com</td>
              <td>—</td>
              <td>3000 Hermes Workspace（容器）</td>
            </tr>
            <tr>
              <td>n8n.rong-rise.com</td>
              <td>—</td>
              <td>5678 n8n</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
