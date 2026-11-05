"use client";
import Link from "next/link";
import { Youtube } from "lucide-react";
import { PageHeader } from "../components/ui";

export default function YoutubePage() {
  return (
    <div>
      <PageHeader title="YouTube 頻道" sub="小賀頻道 · 影片同步與數據回饋" />

      <div className="panel">
        <h3>
          <Youtube size={16} /> 頻道
        </h3>
        <table>
          <thead>
            <tr>
              <th>項目</th>
              <th>內容</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>頻道</td>
              <td>
                <Link href="https://www.youtube.com/channel/UCFfz1iDwqqRfjWgR7GhVMGA" target="_blank">
                  榕耀管顧（品牌頻道）
                </Link>
              </td>
            </tr>
            <tr>
              <td>影片資料</td>
              <td>由容器端 cron 每日同步，寫進官網的影片資料檔；本頁只顯示排程狀態</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="panel">
        <h3>自動化排程（台北時間）</h3>
        <table>
          <thead>
            <tr>
              <th>任務</th>
              <th>時間</th>
              <th>用途</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>每日 YouTube 影片同步</td>
              <td className="mono">每天 12:15</td>
              <td>抓頻道最新影片與觀看數，更新官網 /videos</td>
            </tr>
            <tr>
              <td>影片數據回饋</td>
              <td className="mono">每天 15:00</td>
              <td>把當日數據寫回知識庫，餵下一支影片的腳本</td>
            </tr>
            <tr>
              <td>影片數據週報</td>
              <td className="mono">週一 15:45</td>
              <td>一週表現比較</td>
            </tr>
            <tr>
              <td>留言監看與回覆草稿</td>
              <td className="mono">週一 09:30</td>
              <td>草稿進待審，一律人工核准才發布</td>
            </tr>
          </tbody>
        </table>
        <p className="page-sub" style={{ marginTop: 12, marginBottom: 0 }}>
          排程以 cron 實際設定為準，這一頁是人看得懂的版本；要改時間請改 job 本身。
        </p>
      </div>

      <p className="page-sub">
        <Link href="https://rong-rise.com/videos" target="_blank">
          官網影音專區 →
        </Link>
      </p>
    </div>
  );
}
