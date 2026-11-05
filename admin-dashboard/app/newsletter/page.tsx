"use client";
import Link from "next/link";
import { CalendarClock, Mail, Send, Users } from "lucide-react";
import { Kpi, PageHeader } from "../components/ui";
import { useDashboard, v } from "../components/useDashboard";

export default function NewsletterPage() {
  const { data, err, loading, updatedAt, reload } = useDashboard();
  const nl = data?.newsletter;

  return (
    <div>
      <PageHeader
        title="電子報管理"
        sub="榕賀觀點 · 週一組織與人才刊、週四市場與成本刊"
        updatedAt={updatedAt}
        onRefresh={reload}
        loading={loading}
      />

      {err && <div className="error-box">{err}</div>}

      <div className="grid">
        <Kpi
          label="訂閱人數"
          icon={<Users size={14} />}
          value={v(nl?.subscribers)}
          unit="人"
          hint="含未確認訂閱者（現行寄送邏輯）"
        />
        <Kpi
          label="待寄期別"
          icon={<Send size={14} />}
          value={nl?.pending?.length ? String(nl.pending.length) : "0"}
          unit="期"
          tone={nl?.pending?.length ? "warn" : "ok"}
          hint={nl?.pending?.length ? nl.pending.join("、") : "沒有已核准未寄出的期別"}
        />
        <Kpi
          label="下一班寄送"
          icon={<CalendarClock size={14} />}
          value={v(nl?.nextGate)}
          hint={`約 ${v(nl?.nextGateIn)}後 · 台北時間`}
        />
        <Kpi
          label="最近一次寄出"
          icon={<Mail size={14} />}
          value={nl?.lastSent?.issue || "—"}
          hint={nl?.lastSent?.at ? `${nl.lastSent.at}（台北）` : ""}
        />
      </div>

      <div className="panel">
        <h3>寄送機制</h3>
        <table>
          <thead>
            <tr>
              <th>項目</th>
              <th>設定</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>內容生產</td>
              <td>週一 20:00（週一刊）、週四 20:40（週四刊），產完寄審閱稿到你的信箱</td>
            </tr>
            <tr>
              <td>寄送閘門</td>
              <td>
                <strong>每天台北 09:00／21:00</strong> 兩班，掃「已核准未寄出」的期別寄送
              </td>
            </tr>
            <tr>
              <td>核准方式</td>
              <td>你回「核准」→ 標記 APPROVED → 下一班寄出（晚上 21:00 後核准＝隔天 09:00 寄）</td>
            </tr>
            <tr>
              <td>去重</td>
              <td>寄出後留下 SENT 標記，同一期不會重寄</td>
            </tr>
            <tr>
              <td>官網上架</td>
              <td>每天 09:30／21:30 自動把已核准或已寄出的期別補上架</td>
            </tr>
            <tr>
              <td>寄後驗證</td>
              <td>每天 10:00 用 Resend 回讀實際送達狀態</td>
            </tr>
            <tr>
              <td>寄件者</td>
              <td>小賀 🦞 榕耀管顧 · SMTP（Resend）</td>
            </tr>
          </tbody>
        </table>
      </div>

      {nl?.pending && nl.pending.length > 0 && (
        <div className="panel">
          <h3>待寄佇列</h3>
          <ul className="list">
            {nl.pending.map((p) => (
              <li key={p}>
                <strong>{p}</strong>
                <span className="sub"> · 下一班 {nl.nextGate}（台北）寄出</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="page-sub">
        <Link href="https://rong-rise.com/newsletter" target="_blank">
          官網電子報專區 →
        </Link>
      </p>
    </div>
  );
}
