"use client";
import { useState } from "react";
import Link from "next/link";
import Script from "next/script";

const INDUSTRIES = [
  "製造業", "科技/資訊", "金融/保險", "醫療/生技",
  "教育/學術", "零售/電商", "顧問/專業服務", "其他",
];

const ROLES = [
  "C 級主管（CEO/CTO/CIO）", "中高階主管", "基層主管",
  "專員/工程師", "創業者/自由工作者", "其他",
];

const CONTENT_PREFS = [
  "企業案例", "工具教學", "政策法規",
  "產業趨勢", "實戰方法論", "國際視野",
];

const WEBSITE_FEATURES = [
  "案例搜尋", "工具推薦", "顧問配對",
  "線上課程", "討論社群", "AI 知識庫探索",
];

export default function SurveyPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", industry: "", role: "",
    content_pref: [] as string[], length_pref: "",
    helpfulness: 0, website_value: "",
    website_features: [] as string[], website_satisfaction: 0,
    want_consult: false, consult_scheduled: false, feedback: "",
  });

  const update = (field: string, value: any) =>
    setForm((f) => ({ ...f, [field]: value }));

  const toggleArray = (field: "content_pref" | "website_features", val: string) => {
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(val)
        ? f[field].filter((v) => v !== val)
        : [...f[field], val],
    }));
  };

  const handleSubmit = async () => {
    try {
      await fetch("https://rong-rise.com/api/newsletter/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {}
    setSubmitted(true);
  };

  // Progress bar
  const totalSteps = 6;
  const progress = Math.round(((step + 1) / totalSteps) * 100);

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-20 px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-2xl font-bold text-[#0D2B4E] mb-3">感謝你的回饋！</h1>
          <p className="text-slate-500 mb-8">你的每一題回答都會直接影響榕賀觀點和榕耀官網的下一步。</p>
          <div className="p-6 bg-[#0D2B4E] rounded-2xl text-white mb-6">
            <p className="text-sm opacity-80 mb-2">📌 附加服務</p>
            <p className="font-semibold mb-3">CJ 哥免費 30 分鐘線上諮詢</p>
            <a
              href="https://calendly.com/cjkuo-rongrise"
              target="_blank"
              rel="noopener"
              className="inline-block px-6 py-2.5 bg-[#E8912A] rounded-full text-sm font-bold hover:brightness-110 transition-all"
            >
              立即預約
            </a>
          </div>
          <Link href="/" className="text-sm text-[#1A6DB5] hover:underline">← 回到榕耀官網</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Progress Bar */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>榕賀觀點 × 讀者需求調查</span>
            <span>{step + 1} / {totalSteps}</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#1A6DB5] to-[#2EC4B6] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="text-center">
            <div className="text-5xl mb-4">📋</div>
            <h1 className="text-2xl font-bold text-[#0D2B4E] mb-3">3 分鐘，幫榕賀觀點做得更好</h1>
            <p className="text-slate-500 mb-2 max-w-md mx-auto">
              你的每一題回答，都會直接影響下一期內容和榕耀官網的改版方向。
            </p>
            <p className="text-xs text-slate-400 mb-8">約 10 題 · 匿名 · 資料僅用於內容優化</p>
            <button
              onClick={() => setStep(1)}
              className="px-8 py-3 bg-[#0D2B4E] text-white rounded-full font-semibold hover:bg-[#1A6DB5] transition-all"
            >
              開始填寫 →
            </button>
          </div>
        )}

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-[#0D2B4E]">關於你</h2>
            <div>
              <label className="text-sm text-slate-500 mb-1.5 block">你的產業／領域</label>
              <div className="grid grid-cols-2 gap-2">
                {INDUSTRIES.map((i) => (
                  <button
                    key={i}
                    onClick={() => update("industry", i)}
                    className={`text-sm px-4 py-2.5 rounded-xl border text-left transition-all ${
                      form.industry === i
                        ? "border-[#1A6DB5] bg-blue-50 text-[#0D2B4E] font-medium"
                        : "border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-500 mb-1.5 block">你的角色</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    onClick={() => update("role", r)}
                    className={`text-sm px-4 py-2.5 rounded-xl border text-left transition-all ${
                      form.role === r
                        ? "border-[#1A6DB5] bg-blue-50 text-[#0D2B4E] font-medium"
                        : "border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={() => setStep(0)} className="px-5 py-2.5 border border-slate-200 rounded-full text-sm text-slate-500 hover:bg-slate-50">← 上一步</button>
              <button onClick={() => setStep(2)} className="px-5 py-2.5 bg-[#0D2B4E] text-white rounded-full text-sm font-semibold hover:bg-[#1A6DB5]" disabled={!form.industry || !form.role}>下一步 →</button>
            </div>
          </div>
        )}

        {/* Step 2: Newsletter Preferences */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-[#0D2B4E]">關於榕賀觀點</h2>
            <div>
              <label className="text-sm text-slate-500 mb-1.5 block">你希望增加哪類內容？（可複選）</label>
              <div className="grid grid-cols-2 gap-2">
                {CONTENT_PREFS.map((c) => (
                  <button
                    key={c}
                    onClick={() => toggleArray("content_pref", c)}
                    className={`text-sm px-4 py-2.5 rounded-xl border text-left transition-all ${
                      form.content_pref.includes(c)
                        ? "border-[#1A6DB5] bg-blue-50 text-[#0D2B4E] font-medium"
                        : "border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-500 mb-1.5 block">偏好什麼長度？</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { v: "quick", l: "⚡ 5 分鐘快讀" },
                  { v: "deep", l: "📚 15 分鐘深度" },
                  { v: "both", l: "👍 兩者都要" },
                ].map((o) => (
                  <button
                    key={o.v}
                    onClick={() => update("length_pref", o.v)}
                    className={`text-sm px-3 py-2.5 rounded-xl border text-center transition-all ${
                      form.length_pref === o.v
                        ? "border-[#1A6DB5] bg-blue-50 text-[#0D2B4E] font-medium"
                        : "border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    {o.l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-500 mb-1.5 block">目前電子報對你的幫助程度？</label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => update("helpfulness", n)}
                    className={`w-12 h-12 rounded-xl border text-lg transition-all ${
                      form.helpfulness === n
                        ? "border-[#1A6DB5] bg-blue-50 text-[#0D2B4E] font-bold"
                        : "border-slate-200 text-slate-400 hover:border-slate-300"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-slate-300 mt-1 px-1">
                <span>不太有用</span>
                <span>非常有幫助</span>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={() => setStep(1)} className="px-5 py-2.5 border border-slate-200 rounded-full text-sm text-slate-500 hover:bg-slate-50">← 上一步</button>
              <button onClick={() => setStep(3)} className="px-5 py-2.5 bg-[#0D2B4E] text-white rounded-full text-sm font-semibold hover:bg-[#1A6DB5]">下一步 →</button>
            </div>
          </div>
        )}

        {/* Step 3: Website */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-[#0D2B4E]">關於榕耀官網</h2>
            <div>
              <label className="text-sm text-slate-500 mb-1.5 block">你希望官網增加什麼功能？（可複選）</label>
              <div className="grid grid-cols-2 gap-2">
                {WEBSITE_FEATURES.map((f) => (
                  <button
                    key={f}
                    onClick={() => toggleArray("website_features", f)}
                    className={`text-sm px-4 py-2.5 rounded-xl border text-left transition-all ${
                      form.website_features.includes(f)
                        ? "border-[#1A6DB5] bg-blue-50 text-[#0D2B4E] font-medium"
                        : "border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-500 mb-1.5 block">你曾經在官網找到什麼有價值的內容嗎？</label>
              <textarea
                value={form.website_value}
                onChange={(e) => update("website_value", e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl text-sm resize-none h-20 focus:border-[#1A6DB5] focus:ring-1 focus:ring-[#1A6DB5] outline-none"
                placeholder="自由填寫（選填）"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={() => setStep(2)} className="px-5 py-2.5 border border-slate-200 rounded-full text-sm text-slate-500 hover:bg-slate-50">← 上一步</button>
              <button onClick={() => setStep(4)} className="px-5 py-2.5 bg-[#0D2B4E] text-white rounded-full text-sm font-semibold hover:bg-[#1A6DB5]">下一步 →</button>
            </div>
          </div>
        )}

        {/* Step 4: Consultation CTA */}
        {step === 4 && (
          <div className="space-y-5 text-center">
            <div className="text-5xl mb-2">☕</div>
            <h2 className="text-lg font-bold text-[#0D2B4E]">免費 30 分鐘線上諮詢</h2>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              無論是否填寫問卷，你都可以預約 CJ 哥的一對一免費諮詢。
              聊聊 AI 轉型、人才策略、ESG 永續——任何你正在煩惱的議題。
            </p>
            <div className="p-5 bg-[#0D2B4E] rounded-2xl text-white my-4">
              <p className="text-sm opacity-80 mb-2">📌 附加服務 — 隨時可預約</p>
              <a
                href="https://calendly.com/cjkuo-rongrise"
                target="_blank"
                rel="noopener"
                className="inline-block px-6 py-2.5 bg-[#E8912A] rounded-full text-sm font-bold hover:brightness-110 transition-all"
              >
                立即預約
              </a>
            </div>
            <div className="flex gap-3 pt-4 justify-center">
              <button onClick={() => setStep(3)} className="px-5 py-2.5 border border-slate-200 rounded-full text-sm text-slate-500 hover:bg-slate-50">← 上一步</button>
              <button onClick={() => setStep(5)} className="px-5 py-2.5 bg-[#0D2B4E] text-white rounded-full text-sm font-semibold hover:bg-[#1A6DB5]">下一步 →</button>
            </div>
          </div>
        )}

        {/* Step 5: Final + Feedback */}
        {step === 5 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-[#0D2B4E]">最後一題</h2>
            <div>
              <label className="text-sm text-slate-500 mb-1.5 block">有什麼想跟我們說的嗎？</label>
              <textarea
                value={form.feedback}
                onChange={(e) => update("feedback", e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl text-sm resize-none h-28 focus:border-[#1A6DB5] focus:ring-1 focus:ring-[#1A6DB5] outline-none"
                placeholder="任何對榕賀觀點或榕耀官網的想法、建議、批評都歡迎⋯⋯"
              />
            </div>
            <div className="pt-4 text-center">
              <button
                onClick={handleSubmit}
                className="px-10 py-3 bg-[#0D2B4E] text-white rounded-full font-semibold hover:bg-[#1A6DB5] transition-all"
              >
                📮 送出問卷
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
