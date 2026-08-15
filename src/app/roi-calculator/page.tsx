"use client";

import { useState, useCallback, useMemo } from "react";
import {
  INDUSTRIES,
  SCOPES,
  calculateRoi,
  formatNt,
  formatRoi,
  type RoiResult,
} from "@/lib/roi-calculator";

/* ============================================
   AI 轉型 ROI 估算器
   三步驟：介紹 → 輸入 → 結果
   2026-08-15 小賀開發（P0-1 微型工具）
   ============================================ */

type Step = "intro" | "form" | "result";

interface FormState {
  industry: string;
  employees: number;
  scope: string[];
  name: string;
  email: string;
  company: string;
}

const EMPLOYEE_OPTIONS = [
  { value: 20, label: "20 人以下" },
  { value: 50, label: "20–50 人" },
  { value: 150, label: "50–200 人" },
  { value: 350, label: "200–500 人" },
  { value: 800, label: "500–1000 人" },
  { value: 2000, label: "1000 人以上" },
];

export default function RoiCalculatorPage() {
  const [step, setStep] = useState<Step>("intro");
  const [form, setForm] = useState<FormState>({
    industry: "",
    employees: 150,
    scope: [],
    name: "",
    email: "",
    company: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const result: RoiResult | null = useMemo(() => {
    if (step !== "result" && !submitted) return null;
    try {
      return calculateRoi(form);
    } catch {
      return null;
    }
  }, [step, form, submitted]);

  const toggleScope = useCallback((key: string) => {
    setForm((f) => ({
      ...f,
      scope: f.scope.includes(key) ? f.scope.filter((s) => s !== key) : [...f.scope, key],
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!form.industry || form.scope.length === 0) {
      setSubmitError("請選擇產業與至少一個導入範圍");
      return;
    }
    setSubmitting(true);
    setSubmitError("");

    // 留資（選填 email；填了才寫入 Newsletter API）
    if (form.email) {
      try {
        const res = await fetch("/api/newsletter/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name || "ROI 估算訪客",
            email: form.email,
            company: form.company || "",
            industry: INDUSTRIES[form.industry]?.label || form.industry,
            ai_stage: "exploring",
            challenges: form.scope.map((s) => SCOPES[s]?.label || s),
            message: "來自 AI 轉型 ROI 估算器",
            source: "roi-calculator",
            subscribed_at: new Date().toISOString(),
          }),
        });
        if (!res.ok) throw new Error("subscribe failed");
      } catch {
        // 留資失敗不阻擋結果 — 靜默
      }
    }

    setSubmitting(false);
    setSubmitted(true);
    setStep("result");
  }, [form]);

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-[#0D2B4E] via-[#0D2B4E] to-[#0A1F3A] text-white">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        {/* ===== STEP 1: 介紹 ===== */}
        {step === "intro" && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#1A6DB5]/20 border border-[#2EC4B6]/30 rounded-full px-4 py-1.5 mb-6">
              <span className="text-sm text-[#2EC4B6] font-semibold">企業 AI 轉型實用工具</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6">
              AI 轉型，<span className="text-[#E8912A]">值得嗎？</span>
              <br />
              三分鐘算出你的 ROI
            </h1>
            <p className="text-lg md:text-xl text-[#A0C4E8] max-w-2xl mx-auto mb-8 leading-relaxed">
              輸入產業、員工人數與導入範圍，立即估算 AI 轉型的
              <strong className="text-white"> 3 年投資報酬率、節省工時與回收期</strong>。
              採用保守模型，不灌水。
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mb-10">
              {[
                { icon: "⚡", label: "30 秒完成" },
                { icon: "📊", label: "透明計算模型" },
                { icon: "🎯", label: "可直接下載報告" },
              ].map((f) => (
                <div key={f.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="text-2xl mb-1">{f.icon}</div>
                  <div className="text-sm text-[#A0C4E8]">{f.label}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep("form")}
              className="bg-[#E8912A] hover:bg-[#F0A040] text-[#0D2B4E] font-bold text-lg px-10 py-4 rounded-full transition-colors shadow-lg shadow-[#E8912A]/20"
            >
              開始估算 →
            </button>
            <p className="text-xs text-[#5A7A9E] mt-6">
              資料僅用於估算，不會對外揭露。可匿名使用，填寫 Email 可獲得完整報告。
            </p>
          </div>
        )}

        {/* ===== STEP 2: 輸入 ===== */}
        {step === "form" && (
          <div>
            <button
              onClick={() => setStep("intro")}
              className="text-sm text-[#A0C4E8] hover:text-white mb-6 transition-colors"
            >
              ← 返回
            </button>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">你的企業概況</h2>
            <p className="text-[#A0C4E8] mb-8">三個問題，我們就能估算你的 AI 轉型投資回報。</p>

            <div className="space-y-8">
              {/* 產業 */}
              <div>
                <label className="block text-sm font-semibold text-[#2EC4B6] mb-3">1. 你的產業？</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(INDUSTRIES).map(([key, ind]) => (
                    <button
                      key={key}
                      onClick={() => setForm((f) => ({ ...f, industry: key }))}
                      className={`text-sm px-3 py-2.5 rounded-lg border transition-all text-left ${
                        form.industry === key
                          ? "bg-[#1A6DB5]/30 border-[#2EC4B6] text-white font-semibold"
                          : "bg-white/5 border-white/10 text-[#A0C4E8] hover:border-[#1A6DB5]"
                      }`}
                    >
                      {ind.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 員工人數 */}
              <div>
                <label className="block text-sm font-semibold text-[#2EC4B6] mb-3">2. 員工人數？</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {EMPLOYEE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setForm((f) => ({ ...f, employees: opt.value }))}
                      className={`text-sm px-3 py-2.5 rounded-lg border transition-all ${
                        form.employees === opt.value
                          ? "bg-[#1A6DB5]/30 border-[#2EC4B6] text-white font-semibold"
                          : "bg-white/5 border-white/10 text-[#A0C4E8] hover:border-[#1A6DB5]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 導入範圍 */}
              <div>
                <label className="block text-sm font-semibold text-[#2EC4B6] mb-3">
                  3. 想導入 AI 的範圍？（可複選）
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(SCOPES).map(([key, sc]) => {
                    const active = form.scope.includes(key);
                    return (
                      <button
                        key={key}
                        onClick={() => toggleScope(key)}
                        className={`flex items-center gap-3 text-sm px-4 py-3 rounded-lg border transition-all text-left ${
                          active
                            ? "bg-[#1A6DB5]/30 border-[#2EC4B6] text-white font-semibold"
                            : "bg-white/5 border-white/10 text-[#A0C4E8] hover:border-[#1A6DB5]"
                        }`}
                      >
                        <span className="text-xl">{sc.icon}</span>
                        <span className="flex-1">{sc.label}</span>
                        <span
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs ${
                            active ? "bg-[#2EC4B6] border-[#2EC4B6] text-[#0D2B4E]" : "border-[#5A7A9E]"
                          }`}
                        >
                          {active ? "✓" : ""}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 留資（選填） */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <label className="block text-sm font-semibold text-[#2EC4B6] mb-1">
                  4. 留下 Email 取得完整報告（選填）
                </label>
                <p className="text-xs text-[#5A7A9E] mb-4">填寫後可收到 PDF 版估算報告與 AI 轉型週報。</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="姓名"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm placeholder-[#5A7A9E] focus:border-[#2EC4B6] focus:outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm placeholder-[#5A7A9E] focus:border-[#2EC4B6] focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="公司名稱"
                    value={form.company}
                    onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm placeholder-[#5A7A9E] focus:border-[#2EC4B6] focus:outline-none"
                  />
                </div>
              </div>

              {submitError && (
                <div className="bg-red-500/10 border border-red-400/30 text-red-300 text-sm rounded-lg px-4 py-3">
                  {submitError}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-[#E8912A] hover:bg-[#F0A040] disabled:opacity-50 text-[#0D2B4E] font-bold text-lg px-8 py-4 rounded-full transition-colors shadow-lg shadow-[#E8912A]/20"
              >
                {submitting ? "計算中…" : "立即計算我的 ROI →"}
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 3: 結果 ===== */}
        {step === "result" && result && (
          <div>
            <button
              onClick={() => { setStep("form"); setSubmitted(false); }}
              className="text-sm text-[#A0C4E8] hover:text-white mb-6 transition-colors"
            >
              ← 重新估算
            </button>

            {/* 主數字 */}
            <div className="text-center mb-8">
              <p className="text-[#2EC4B6] font-semibold mb-2">
                {INDUSTRIES[form.industry]?.label} · {EMPLOYEE_OPTIONS.find((o) => o.value === form.employees)?.label}
              </p>
              <div className="text-5xl md:text-6xl font-black text-[#E8912A] mb-2">
                {result.netBenefit > 0 ? "+" : ""}
                {formatNt(result.netBenefit)}
              </div>
              <p className="text-[#A0C4E8] text-lg">3 年淨效益（預估）</p>
              <div className="inline-flex items-center gap-2 mt-4 bg-[#2EC4B6]/10 border border-[#2EC4B6]/30 rounded-full px-5 py-2">
                <span className="text-sm text-[#2EC4B6] font-bold">3 年 ROI {formatRoi(result.roi)}</span>
                <span className="text-[#5A7A9E]">·</span>
                <span className="text-sm text-[#A0C4E8]">
                  回收期約 {result.paybackMonths > 0 ? `${result.paybackMonths} 個月` : "超過 3 年"}
                </span>
              </div>
            </div>

            {/* 三卡 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                { icon: "⏱️", label: "每年節省工時", value: `${formatNt(result.hoursSavedPerYear)} 小時` },
                { icon: "👥", label: "相當於人力", value: `${result.staffEquivalent.toFixed(1)} 位全職員工` },
                { icon: "📉", label: "每年 AI 投資", value: `${formatNt(result.annualSubscription)} / 年` },
              ].map((c) => (
                <div key={c.label} className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                  <div className="text-2xl mb-2">{c.icon}</div>
                  <div className="text-xl font-bold text-white mb-1">{c.value}</div>
                  <div className="text-sm text-[#A0C4E8]">{c.label}</div>
                </div>
              ))}
            </div>

            {/* 逐年明細 */}
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#1A6DB5]/20 text-[#A0C4E8]">
                    <th className="px-4 py-3 text-left font-semibold">年度</th>
                    <th className="px-4 py-3 text-right font-semibold">預估效益</th>
                    <th className="px-4 py-3 text-right font-semibold">投入成本</th>
                    <th className="px-4 py-3 text-right font-semibold">淨效益</th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearly.map((y) => (
                    <tr key={y.year} className="border-t border-white/10">
                      <td className="px-4 py-3 text-white font-medium">第 {y.year} 年</td>
                      <td className="px-4 py-3 text-right text-[#2EC4B6]">+{formatNt(y.benefit)}</td>
                      <td className="px-4 py-3 text-right text-[#A0C4E8]">−{formatNt(y.cost)}</td>
                      <td className={`px-4 py-3 text-right font-bold ${y.net >= 0 ? "text-white" : "text-red-300"}`}>
                        {y.net >= 0 ? "+" : "−"}{formatNt(Math.abs(y.net))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 免責與 CTA */}
            <div className="bg-[#1A6DB5]/10 border border-[#1A6DB5]/30 rounded-xl p-5 mb-8">
              <p className="text-xs text-[#A0C4E8] leading-relaxed">
                <strong className="text-white">模型說明：</strong>本估算採用保守模型 — 產業自動化比例參考
                McKinsey 研究、實際節省率取 30%（低於業界宣稱）、採用率逐年遞增（30% → 60% → 80%）。
                實際結果會因企業流程、數據品質與執行力而異，本數字僅供決策參考。
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-bold mb-3">想讓這份估算變成行動方案？</h3>
              <p className="text-[#A0C4E8] mb-6 max-w-xl mx-auto">
                CJ 哥提供免費 30 分鐘線上諮詢，幫你把 ROI 估算轉成具體的導入藍圖。
              </p>
              <a
                href="/about/#contact"
                className="inline-block bg-[#E8912A] hover:bg-[#F0A040] text-[#0D2B4E] font-bold text-lg px-10 py-4 rounded-full transition-colors shadow-lg shadow-[#E8912A]/20"
              >
                預約免費諮詢 →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
