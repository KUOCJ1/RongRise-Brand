"use client";
import Link from "next/link";
import { Brain, Clock, GitCommitHorizontal } from "lucide-react";
import { Kpi, PageHeader } from "../components/ui";
import { useDashboard, v } from "../components/useDashboard";

export default function BrainPage() {
  const { data, err, loading, updatedAt, reload } = useDashboard();
  const b = data?.secondBrain;
  const uncommitted = Number(b?.uncommitted ?? 0);

  return (
    <div>
      <PageHeader
        title="第二大腦監控"
        sub="知識庫即時狀態（讀的是活的 vault，不是備份 clone）"
        updatedAt={updatedAt}
        onRefresh={reload}
        loading={loading}
      />

      {err && <div className="error-box">{err}</div>}

      <div className="grid">
        <Kpi label="筆記總數" icon={<Brain size={14} />} value={v(b?.files)} unit="篇" />
        <Kpi label="7 天內提交" icon={<GitCommitHorizontal size={14} />} value={v(b?.recent7d)} unit="次" />
        <Kpi
          label="未提交變更"
          icon={<Clock size={14} />}
          value={v(b?.uncommitted)}
          unit="個檔案"
          tone={uncommitted > 20 ? "warn" : "ok"}
          hint={uncommitted > 20 ? "累積偏多，需 commit + push" : "正常"}
        />
      </div>

      <div className="panel">
        <h3>最後一次提交</h3>
        <p className="mono" style={{ marginBottom: 0 }}>
          {b?.last || "—"}
        </p>
      </div>

      <div className="panel">
        <h3>這頁的數字怎麼來的</h3>
        <table>
          <thead>
            <tr>
              <th>項目</th>
              <th>說明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>資料來源</td>
              <td>
                VPS 上的活 vault（容器 /opt/data/second-brain 的 bind mount），
                <strong>不是</strong> /root 那個只給 Cognee 用的 clone
              </td>
            </tr>
            <tr>
              <td>同步方式</td>
              <td>容器端每 6 小時 git pull；寫入後由各流程自行 commit + push 到 GitHub</td>
            </tr>
            <tr>
              <td>未提交變更</td>
              <td>持續累積代表某支流程寫了檔沒提交，需要回頭修產出端</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="page-sub">
        <Link href="https://brain.rong-rise.com" target="_blank">
          開啟第二大腦 Portal →
        </Link>
      </p>
    </div>
  );
}
