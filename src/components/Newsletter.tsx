"use client";

import { useState } from "react";
import { trackNewsletterSubscribe } from "@/lib/ga4-events";

const API_URL = "https://script.google.com/macros/s/AKfycbyjI34DegVGckRyZVEU0-5PZE24dLJk4s1y25TOCAWTOpySM8Z4hQS09UQuTdnKf1bPJA/exec";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("請輸入有效的 Email 地址");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          action: "subscribe",
          email,
          name,
          source: "website",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        setSuccessMsg(data.message || "訂閱成功！");
        trackNewsletterSubscribe();
      } else {
        setError(data.error || "訂閱失敗，請稍後再試。");
      }
    } catch {
      setError("連線失敗，請稍後再試。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="newsletter" className="section bg-gradient-subtle">
      <div className="section-inner">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-4">
            <img
              src="https://i.imgur.com/Rs3O3Iv.jpeg"
              alt="小賀"
              width={64}
              height={64}
              className="rounded-full mx-auto"
              style={{ border: "3px solid #E8912A" }}
            />
          </div>

          <h2 className="heading-section text-dark mb-2">訂閱轉型快訊</h2>
          <p className="text-text-secondary text-body-lg mb-2">
            小賀每週為你整理 AI 轉型趨勢、ESG 實務攻略、課程優惠。
          </p>
          <p className="text-text-secondary text-sm mb-6">
            不發廢文，只送有價值的內容。目前已有 <strong className="text-primary">300+</strong> 位企業主訂閱。
          </p>

          {submitted ? (
            <div className="bg-success/10 border border-success/20 rounded-xl p-6">
              <div className="text-3xl mb-2">🎉</div>
              <h3 className="heading-subsection text-dark mb-2">訂閱成功！</h3>
              <p className="text-text-secondary">
                {successMsg}請確認你的 Email 信箱，完成驗證。
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 max-w-md mx-auto">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="你的名字（選填）"
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-dark placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 rounded-xl border border-border bg-white text-dark placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      處理中...
                    </span>
                  ) : (
                    "免費訂閱"
                  )}
                </button>
              </div>
            </form>
          )}

          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}

          <p className="text-text-secondary text-xs mt-4">
            🔒 我們不會洩露你的 Email。隨時可取消訂閱。
          </p>
        </div>
      </div>
    </section>
  );
}
