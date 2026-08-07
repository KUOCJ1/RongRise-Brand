"use client";
import { useEffect, useState } from "react";
import { Mail } from "lucide-react";

export default function NewsletterPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  return (
    <div>
      <h1 className="page-title">電子報管理</h1>
      <p className="page-sub">「榕賀觀點」· 每週日 18:00 內容生產 / 19:00 寄送</p>

      <div className="grid">
        <div className="card">
          <div className="label"><Mail size={14} /> 訂閱人數</div>
          <div className="value">{data?.newsletter?.subscribers ?? "—"}<small> 人</small></div>
        </div>
      </div>

      <div className="panel">
        <h3>寄送邏輯</h3>
        <table>
          <thead>
            <tr><th>項目</th><th>設定</th></tr>
          </thead>
          <tbody>
            <tr><td>排程</td><td>週日 19:00（VPS cron send-cron.sh）</td></tr>
            <tr><td>去重</td><td>YYYY-WVV.SENT marker，已寄跳過</td></tr>
            <tr><td>版型</td><td>優先 send-all-html.js（v2 個人化），fallback send-all.js</td></tr>
            <tr><td>寄件者</td><td>小賀 🦞 榕耀管顧</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
