"use client";

import { useState } from "react";
import Head from "next/head";

/* ============================================
   AI 轉型自我評估 Landing Page
   rong-rise.com/ai-assessment
   ============================================ */

const SITE_URL = "https://rong-rise.com";
const PAGE_TITLE = "AI 轉型免費評估 | 榕耀管顧 RongRise";
const PAGE_DESCRIPTION =
  "3 分鐘完成 AI 轉型成熟度評估，獲得專屬建議報告。協助中小企業主了解目前 AI 應用階段，找到最適合的下一步。";
const OG_IMAGE = `${SITE_URL}/images/og-ai-assessment.jpg`;

// 產業選項
const INDUSTRIES = [
  "製造業",
  "服務業",
  "零售/電商",
  "科技/軟體",
  "金融/保險",
  "醫療/健康",
  "教育/培訓",
  "營造/工程",
  "物流/運輸",
  "餐飲/觀光",
  "其他",
];

// AI 階段選項
const AI_STAGES = [
  {
    value: "not_started",
    label: "還沒開始",
    desc: "還在觀望，不確定從哪裡開始",
  },
  {
    value: "exploring",
    label: "剛開始探索",
    desc: "有聽過一些工具，但還沒正式導入",
  },
  {
    value: "piloting",
    label: "小規模試用",
    desc: "部門或個人開始用 AI 工具",
  },
  {
    value: "scaling",
    label: "正在擴大",
    desc: "已經看到成效，想擴大應用範圍",
  },
  {
    value: "mature",
    label: "已經成熟",
    desc: "AI 已經是日常運作的一部分",
  },
];

// 挑戰選項（多選）
const CHALLENGES = [
  "不知道從哪裡開始",
  "預算有限",
  "缺乏技術人才",
  "擔心員工反彈",
  "不確定 ROI 怎麼算",
  "資料品質不夠好",
  "太多工具不知道選哪個",
  "主管不支持",
];

export default function AIAssessmentLanding() {
  const [step, setStep] = useState(0); // 0=landing, 1=form, 2=thankyou
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    industry: "",
    aiStage: "",
    challenges: [] as string[],
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChallengeToggle = (c: string) => {
    setForm((prev) => ({
      ...prev,
      challenges: prev.challenges.includes(c)
        ? prev.challenges.filter((x) => x !== c)
        : [...prev.challenges, c],
    }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.company || !form.industry || !form.aiStage) {
      setError("請填寫所有必填欄位");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          industry: form.industry,
          ai_stage: form.aiStage,
          challenges: form.challenges,
          message: form.message,
          source: "ai-assessment-landing",
          subscribed_at: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error("伺服器錯誤，請稍後再試");
      setStep(2);
    } catch (e: any) {
      setError(e.message || "提交失敗，請稍後再試");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:url" content={`${SITE_URL}/ai-assessment`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-[#0D1B2A] to-[#0a1628] text-white">
        {/* Hero Section */}
        {step === 0 && (
          <section className="relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#1A6DB5] rounded-full opacity-10 blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#2EC4B6] rounded-full opacity-10 blur-3xl" />

            <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
              <div className="inline-block px-4 py-1.5 bg-[#1A6DB5]/20 border border-[#1A6DB5]/30 rounded-full text-[#2EC4B6] text-sm font-medium mb-6">
                🎯 免費評估工具
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                你的企業 AI 轉型
                <br />
                <span className="text-[#E8912A]">走到哪一步了？</span>
              </h1>

              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                3 分鐘完成評估，獲得專屬 AI 轉型建議報告。
                <br />
                超過 200 家中小企業主已經透過這份評估找到方向。
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <button
                  onClick={() => setStep(1)}
                  className="px-8 py-4 bg-[#E8912A] hover:bg-[#F5B84A] text-[#0D1B2A] font-bold rounded-xl text-lg transition-all shadow-lg shadow-[#E8912A]/20 hover:shadow-[#E8912A]/40"
                >
                  開始免費評估 →
                </button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <span className="text-[#2EC4B6]">✓</span> 完全免費
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-[#2EC4B6]">✓</span> 3 分鐘完成
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-[#2EC4B6]">✓</span> 專屬建議報告
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-[#2EC4B6]">✓</span> 無推銷壓力
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Form Section */}
        {step === 1 && (
          <section className="max-w-2xl mx-auto px-6 py-16">
            <button
              onClick={() => setStep(0)}
              className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 text-sm"
            >
              ← 返回
            </button>

            <h2 className="text-3xl font-bold mb-2">AI 轉型成熟度評估</h2>
            <p className="text-gray-400 mb-8">填寫以下資訊，我們將寄送專屬建議報告到你的信箱。</p>

            <div className="space-y-6">
              {/* 姓名 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  姓名 <span className="text-[#E8912A]">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#1A6DB5] focus:ring-1 focus:ring-[#1A6DB5]"
                  placeholder="你的名字"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email <span className="text-[#E8912A]">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#1A6DB5] focus:ring-1 focus:ring-[#1A6DB5]"
                  placeholder="your@email.com"
                />
              </div>

              {/* 公司名稱 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  公司名稱 <span className="text-[#E8912A]">*</span>
                </label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#1A6DB5] focus:ring-1 focus:ring-[#1A6DB5]"
                  placeholder="你的公司名稱"
                />
              </div>

              {/* 產業 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  所屬產業 <span className="text-[#E8912A]">*</span>
                </label>
                <select
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#1A6DB5] focus:ring-1 focus:ring-[#1A6DB5]"
                >
                  <option value="" className="bg-[#0D1B2A]">請選擇產業</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind} className="bg-[#0D1B2A]">
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              {/* AI 階段 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  目前 AI 應用階段 <span className="text-[#E8912A]">*</span>
                </label>
                <div className="space-y-3">
                  {AI_STAGES.map((stage) => (
                    <label
                      key={stage.value}
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        form.aiStage === stage.value
                          ? "border-[#1A6DB5] bg-[#1A6DB5]/10"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <input
                        type="radio"
                        name="aiStage"
                        value={stage.value}
                        checked={form.aiStage === stage.value}
                        onChange={(e) => setForm({ ...form, aiStage: e.target.value })}
                        className="mt-1 accent-[#E8912A]"
                      />
                      <div>
                        <div className="font-medium">{stage.label}</div>
                        <div className="text-sm text-gray-400">{stage.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* 挑戰（多選） */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  目前遇到的最大挑戰（可多選）
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CHALLENGES.map((c) => (
                    <label
                      key={c}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer text-sm transition-all ${
                        form.challenges.includes(c)
                          ? "border-[#2EC4B6] bg-[#2EC4B6]/10 text-[#2EC4B6]"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={form.challenges.includes(c)}
                        onChange={() => handleChallengeToggle(c)}
                        className="accent-[#2EC4B6]"
                      />
                      {c}
                    </label>
                  ))}
                </div>
              </div>

              {/* 補充 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  想補充的資訊（選填）
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#1A6DB5] focus:ring-1 focus:ring-[#1A6DB5] resize-none"
                  placeholder="例如：我們公司 50 人，主要做 B2B 製造..."
                />
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full px-8 py-4 bg-[#E8912A] hover:bg-[#F5B84A] disabled:bg-gray-600 text-[#0D1B2A] font-bold rounded-xl text-lg transition-all shadow-lg shadow-[#E8912A]/20"
              >
                {submitting ? "提交中..." : "取得我的專屬報告 →"}
              </button>

              <p className="text-xs text-gray-500 text-center">
                提交後即表示你同意收到 RongRise 的電子報。你可以隨時取消訂閱。
              </p>
            </div>
          </section>
        )}

        {/* Thank You Section */}
        {step === 2 && (
          <section className="max-w-2xl mx-auto px-6 py-20 text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold mb-4">感謝你完成評估！</h2>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              你的專屬 AI 轉型建議報告已經寄送到 <span className="text-[#E8912A] font-medium">{form.email}</span>。
              <br />
              請檢查收件匣（可能會在垃圾郵件匣）。
            </p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 text-left">
              <h3 className="font-bold text-lg mb-4">📧 接下來你會收到：</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <span className="text-[#E8912A] font-bold">Day 0</span>
                  <div>
                    <div className="font-medium">歡迎信 + 你的評估報告</div>
                    <div className="text-sm text-gray-400">根據你的回答客製化的 AI 轉型建議</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-[#E8912A] font-bold">Day 3</span>
                  <div>
                    <div className="font-medium">同行夥伴怎麼做？</div>
                    <div className="text-sm text-gray-400">真實案例分享，讓你看到可能性</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-[#E8912A] font-bold">Day 5</span>
                  <div>
                    <div className="font-medium">AI 轉型 3 大地雷</div>
                    <div className="text-sm text-gray-400">避開最常見的錯誤，少走冤枉路</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-[#E8912A] font-bold">Day 7</span>
                  <div>
                    <div className="font-medium">選擇 AI 顧問前必問 5 個問題</div>
                    <div className="text-sm text-gray-400">幫你找到最適合的合作夥伴</div>
                  </div>
                </div>
              </div>
            </div>

            <a
              href="/knowledge"
              className="inline-block px-6 py-3 border border-white/20 rounded-xl text-gray-300 hover:text-white hover:border-white/40 transition-all"
            >
              先看看知識庫文章 →
            </a>
          </section>
        )}

        {/* Footer */}
        <footer className="border-t border-white/5 py-8 text-center text-sm text-gray-500">
          <p>© 2026 榕耀管顧 RongRise Consulting. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
}
