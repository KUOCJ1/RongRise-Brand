"use client";

import { useState } from "react";

const API_URL = "/api/newsletter";

/**
 * 文章頁底部訂閱 CTA（精簡版，非完整表單區塊）
 * 目的：讓讀完文章的人就地訂閱，不用自己找入口
 */
export default function InlineSubscribe() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatus("error");
      setMsg("請填寫 Email");
      return;
    }
    setStatus("loading");
    try {
      const r = await fetch(API_URL + "/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), name: name.trim(), source: "article-inline" }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok) {
        setStatus("done");
        setMsg("確認信已寄出，請到信箱點確認連結 ✉️");
      } else {
        setStatus("error");
        setMsg(d.error || "訂閱失敗，請稍後再試");
      }
    } catch {
      setStatus("error");
      setMsg("連線失敗，請稍後再試");
    }
  };

  if (status === "done") {
    return (
      <div className="mt-12 rounded-2xl border border-success/25 bg-success/5 p-6 text-center">
        <div className="text-3xl mb-2">🎉</div>
        <p className="text-text-primary font-bold mb-1">訂閱確認信已寄出</p>
        <p className="text-text-secondary text-sm">
          請到信箱點擊確認連結，就完成訂閱了。（找不到請看垃圾郵件）
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12 rounded-2xl border border-border bg-gradient-subtle p-6 md:p-7">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl leading-none">🦞</span>
        <div>
          <p className="text-text-primary font-bold text-base leading-snug">
            每週兩封，一次讀懂 AI 轉型
          </p>
          <p className="text-text-secondary text-sm leading-relaxed mt-1">
            榕賀觀點 AI 週報：週一談組織與人才，週四談市場與成本。
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="你的稱呼（選填）"
          className="sm:w-32 rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="你的 Email"
          required
          className="flex-1 rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-primary text-sm whitespace-nowrap disabled:opacity-60"
        >
          {status === "loading" ? "送出中…" : "免費訂閱"}
        </button>
      </form>

      {status === "error" && (
        <p className="mt-2 text-xs text-danger">{msg}</p>
      )}

      <p className="mt-3 text-xs text-text-muted leading-relaxed">
        每週 2 封，隨時可一鍵取消。我不會轉賣你的信箱，也不會寄廣告。
      </p>
    </div>
  );
}
