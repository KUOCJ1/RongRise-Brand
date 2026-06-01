"use client";

import { useState } from "react";
import { trackNewsletterSubscribe } from "@/lib/ga4-events";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("請輸入有效的 Email 地址");
      return;
    }
    setError("");
    setSubmitted(true);
    trackNewsletterSubscribe();
    // TODO: 串接 ConvertKit / Mailchimp API
    // 目前為前端展示，CJ哥填入 embed code 後即可運作
  };

  return (
    <section className="section bg-gradient-subtle">
      <div className="section-inner">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-4xl mb-4">📬</div>
          <h2 className="heading-section text-dark mb-3">訂閱轉型快訊</h2>
          <p className="text-text-secondary text-body-lg mb-6">
            每月收到最新 AI 轉型趨勢、ESG 實務攻略、課程優惠。
            不發廢文，只送有價值的內容。
          </p>

          {submitted ? (
            <div className="bg-success/10 border border-success/20 rounded-xl p-6">
              <div className="text-3xl mb-2">🎉</div>
              <h3 className="heading-subsection text-dark mb-2">訂閱成功！</h3>
              <p className="text-text-secondary">
                感謝您的訂閱。請確認您的 Email 信箱，完成驗證。
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-xl border border-border bg-white text-dark placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                免費訂閱
              </button>
            </form>
          )}

          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}

          <p className="text-text-secondary text-xs mt-4">
            🔒 我們不會洩露您的 Email。隨時可取消訂閱。
          </p>
        </div>
      </div>
    </section>
  );
}
