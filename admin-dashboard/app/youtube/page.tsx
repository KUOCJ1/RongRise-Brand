"use client";
import { useEffect, useState } from "react";
import { Youtube } from "lucide-react";

export default function YoutubePage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  return (
    <div>
      <h1 className="page-title">YouTube 頻道</h1>
      <p className="page-sub">小賀頻道 · 每週三 12:00 影片生產排程</p>

      <div className="panel">
        <h3><Youtube size={16} /> 頻道概況</h3>
        <p className="page-sub" style={{ marginBottom: 0 }}>
          影片同步資料由容器端「每日 YouTube 影片同步」cron（04:00）產出，
          完整統計需 YouTube API key（目前未配置於 VPS）。
          頻道 ID：UCFfz1iDwqqRfjWgR7GhVMGA
        </p>
      </div>

      <div className="panel">
        <h3>生產管線</h3>
        <table>
          <thead>
            <tr><th>階段</th><th>排程</th><th>狀態</th></tr>
          </thead>
          <tbody>
            <tr><td>weekly-video-producer</td><td>週三 12:00</td><td><span className="badge ok">啟用</span></td></tr>
            <tr><td>每日 YouTube 同步</td><td>每日 04:00</td><td><span className="badge ok">啟用</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
