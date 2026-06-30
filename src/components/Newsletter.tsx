"use client";

import { useState, useEffect } from "react";
import { trackNewsletterSubscribe } from "@/lib/ga4-events";

const API_URL = "/api/newsletter";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 從 URL 參數檢查是否為確認/退訂導向
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("newsletter");
    
    if (status === "confirmed") {
      setConfirmed(true);
    } else if (status === "confirm") {
      // 剛從確認信點進來，需要發 API 請求確認
      const email = params.get("email");
      const token = params.get("token");
      if (email && token) {
        fetch(API_URL + "/confirm?email=" + encodeURIComponent(email) + "&token=" + token)
          .then(function(r) { return r.json(); })
          .then(function() {
            setConfirmed(true);
            window.history.replaceState({}, "", window.location.pathname + "#newsletter");
          })
          .catch(function() {
            setError("確認失敗，請重新訂閱。");
          });
      }
    } else if (status === "unsubscribe") {
      // 處理退訂
      const email = params.get("email");
      const token = params.get("token");
      if (email && token) {
        fetch(API_URL + "/unsubscribe?email=" + encodeURIComponent(email) + "&token=" + token)
          .then(function(r) { return r.json(); })
          .then(function() {
            setConfirmed(false);
            setError("你已成功取消訂閱。");
            window.history.replaceState({}, "", window.location.pathname + "#newsletter");
          })
          .catch(function() {
            setError("退訂失敗，請稍後再試。");
          });
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("請輸入有效的 Email 地址");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch(API_URL + "/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          source: "website",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
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

  // 確認成功頁面
  if (confirmed) {
    return (
      <section id="newsletter" className="section bg-gradient-subtle">
        <div className="section-inner">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-success/10 border border-success/20 rounded-2xl p-10">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="heading-section text-dark mb-3">訂閱確認成功！</h2>
              <p className="text-text-secondary text-body-lg leading-relaxed mb-4">
                感謝你訂閱<strong className="text-primary">榕賀觀點 AI 週報</strong>！<br />
                小賀每週會為你整理最重要的 AI 轉型趨勢、ESG 實務攻略、以及課程優惠。
              </p>
              <p className="text-text-secondary text-sm">
                請留意你的 Email 信箱，每週定期收到最新的轉型快訊 📬
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
            <div className="bg-success/10 border border-success/20 rounded-2xl p-8">
              <div className="text-4xl mb-3">✉️</div>
              <h3 className="heading-subsection text-dark mb-3">確認信已送出！</h3>
              <p className="text-text-secondary text-body leading-relaxed">
                請檢查你的 Email 信箱，點擊確認連結完成訂閱。
              </p>
              <p className="text-text-secondary text-sm mt-4">
                沒收到信？請檢查垃圾郵件信箱，或重新提交一次。
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 max-w-md mx-auto">
              <div>
                <label htmlFor="newsletter-name" className="sr-only">姓名（選填）</label>
                <input
                  id="newsletter-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="你的名字（選填）"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white text-dark placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label htmlFor="newsletter-email" className="sr-only">Email 地址</label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white text-dark placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
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
