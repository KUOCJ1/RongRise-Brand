"use client";

import { useState, useCallback, useMemo } from "react";
import {
  SIZE_META,
  AREA_META,
  STAGE_META,
  BUDGET_META,
  generateRoadmap,
  roadmapToText,
  type RoadmapResult,
  type SizeKey,
  type AreaKey,
  type StageKey,
  type BudgetKey,
} from "@/lib/ai-roadmap";

/* ============================================
   AI 轉型路線圖生成器（AI Transformation Roadmap Generator）
   三步驟：介紹 → 填寫 → 路線圖
   2026-09-01 小賀開發（第二批 B2-1 微型工具）
   方法論：任務變形蟲（盤點先行）× Pilot Trap（試點驗證）
           × 10-20-70（投資配置）× 治理五檢查
   漏斗定位：amoeba-scan（盤點）→ roi-calculator（估 ROI）
             → ai-roadmap（怎麼做）→ 預約諮詢
   ============================================ */

type Step = "intro" | "form" | "result";

export default function AiRoadmapPage() {
  const [step, setStep] = useState<Step>("intro");
  const [size, setSize] = useState<SizeKey | null>(null);
  const [areas, setAreas] = useState<AreaKey[]>([]);
  const [stage, setStage] = useState<StageKey | null>(null);
  const [budget, setBudget] = useState<BudgetKey | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [copied, setCopied] = useState(false);

  const result: RoadmapResult | null = useMemo(() => {
    if (step !== "result" || !size || !stage || !budget || areas.length === 0) return null;
    return generateRoadmap({ size, areas, stage, budget });
  }, [step, size, areas, stage, budget]);

  const toggleArea = useCallback((key: AreaKey) => {
    setAreas((list) => (list.includes(key) ? list.filter((x) => x !== key) : [...list, key]));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!size) {
      setSubmitError("請選擇企業規模");
      return;
    }
    if (areas.length === 0) {
      setSubmitError("請至少勾選一個想導入 AI 的範圍");
      return;
    }
    if (!stage) {
      setSubmitError("請選擇目前的導入進度");
      return;
    }
    if (!budget) {
      setSubmitError("請選擇預算心態（不知道也選「還不清楚」）");
      return;
    }
    setSubmitting(true);
    setSubmitError("");

    // 留資（選填 email；填了才寫入 Newsletter API）
    if (email) {
      try {
        const stageKey = stage as StageKey;
        const challengeByStage: Record<StageKey, string> = {
          "not-started": "不知道從哪裡開始",
          piloting: "太多工具不知道選哪個",
          partial: "缺乏技術人才",
        };
        const aiStageByStage: Record<StageKey, string> = {
          "not-started": "not_started",
          piloting: "piloting",
          partial: "scaling",
        };
        const res = await fetch("/api/newsletter/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name || "路線圖訪客",
            email,
            company: company || "",
            industry: "其他／綜合",
            ai_stage: aiStageByStage[stageKey],
            challenges: [challengeByStage[stageKey]],
            message: `來自 AI 轉型路線圖生成器（規模 ${SIZE_META[size].label} · 範圍 ${areas
              .map((a) => AREA_META[a].label)
              .join("、")} · 現況 ${STAGE_META[stageKey].label}）`,
            source: "ai-roadmap",
            subscribed_at: new Date().toISOString(),
          }),
        });
        if (!res.ok) throw new Error("subscribe failed");
      } catch {
        // 留資失敗不阻擋結果 — 靜默
      }
    }

    setSubmitting(false);
    setStep("result");
  }, [size, areas, stage, budget, email, name, company]);

  const copyReport = useCallback(async () => {
    if (!result) return;
    const text = roadmapToText(result);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // execCommand fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
      } catch {
        // ignore
      }
      document.body.removeChild(ta);
    }
    setTimeout(() => setCopied(false), 2500);
  }, [result]);

  const areaOptions = (Object.keys(AREA_META) as AreaKey[]).map((k) => ({
    key: k,
    ...AREA_META[k],
  }));

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-[#0D2B4E] via-[#0D2B4E] to-[#0A1F3A] text-white">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        {/* ===== STEP 1: 介紹 ===== */}
        {step === "intro" && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#1A6DB5]/20 border border-[#2EC4B6]/30 rounded-full px-4 py-1.5 mb-6">
              <span className="text-sm text-[#2EC4B6] font-semibold">AI 轉型 × 12 個月落地藍圖</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6">
              知道該導入 AI，
              <br />
              但<span className="text-[#E8912A]">不知道從哪裡開始？</span>
            </h1>
            <p className="text-lg md:text-xl text-[#A0C4E8] max-w-2xl mx-auto mb-8 leading-relaxed">
              填四個問題——規模、想導入的範圍、目前進度、預算心態——立即生成你專屬的
              <strong className="text-white"> 12 個月 AI 轉型路線圖</strong>：
              三階段行動清單、試點場景推薦、10-20-70 投資配置建議。
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mb-10">
              {[
                { icon: "🗺️", label: "三階段藍圖" },
                { icon: "🎯", label: "試點場景推薦" },
                { icon: "💰", label: "投資配置建議" },
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
              生成我的路線圖 →
            </button>
            <p className="text-xs text-[#5A7A9E] mt-6">
              方法論交織榕耀管顧的研究成果：《任務變形蟲》盤點方法、
              McKinsey Pilot Trap 試點陷阱、10-20-70 投資原則與治理五檢查——不是單一框架的套版。
            </p>
          </div>
        )}

        {/* ===== STEP 2: 填寫 ===== */}
        {step === "form" && (
          <div>
            <button
              onClick={() => setStep("intro")}
              className="text-sm text-[#A0C4E8] hover:text-white mb-6 transition-colors"
            >
              ← 返回
            </button>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">四個問題，一張路線圖</h2>
            <p className="text-[#A0C4E8] mb-8">約 2 分鐘。答案隨時可以改，生成後也能重新填。</p>

            {/* 1. 企業規模 */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-[#2EC4B6] mb-3">
                1. 企業規模（員工人數）
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(Object.keys(SIZE_META) as SizeKey[]).map((k) => {
                  const active = size === k;
                  return (
                    <button
                      key={k}
                      onClick={() => setSize(k)}
                      className={`text-sm px-4 py-3 rounded-lg border transition-all text-left ${
                        active
                          ? "bg-[#1A6DB5]/30 border-[#2EC4B6] text-white font-semibold"
                          : "bg-white/5 border-white/10 text-[#A0C4E8] hover:border-[#1A6DB5]"
                      }`}
                    >
                      {SIZE_META[k].label}
                    </button>
                  );
                })}
              </div>
              {size && <p className="text-xs text-[#5A7A9E] mt-2">{SIZE_META[size].teamHint}</p>}
            </div>

            {/* 2. 導入範圍 */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-[#2EC4B6] mb-3">
                2. 想導入 AI 的範圍（可複選）
                <span className="ml-2 text-xs text-[#5A7A9E] font-normal">已選 {areas.length} 項</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {areaOptions.map((a) => {
                  const active = areas.includes(a.key);
                  return (
                    <button
                      key={a.key}
                      onClick={() => toggleArea(a.key)}
                      className={`flex items-center gap-3 text-sm px-4 py-3 rounded-lg border transition-all text-left ${
                        active
                          ? "bg-[#1A6DB5]/30 border-[#2EC4B6] text-white font-semibold"
                          : "bg-white/5 border-white/10 text-[#A0C4E8] hover:border-[#1A6DB5]"
                      }`}
                    >
                      <span className="text-xl">{a.icon}</span>
                      <span className="flex-1">{a.label}</span>
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

            {/* 3. 目前進度 */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-[#2EC4B6] mb-3">
                3. 目前的導入進度
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {(Object.keys(STAGE_META) as StageKey[]).map((k) => {
                  const active = stage === k;
                  return (
                    <button
                      key={k}
                      onClick={() => setStage(k)}
                      className={`text-sm px-4 py-3 rounded-lg border transition-all text-left ${
                        active
                          ? "bg-[#1A6DB5]/30 border-[#2EC4B6] text-white font-semibold"
                          : "bg-white/5 border-white/10 text-[#A0C4E8] hover:border-[#1A6DB5]"
                      }`}
                    >
                      {STAGE_META[k].label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. 預算心態 */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-[#2EC4B6] mb-3">
                4. 一年可以投入的預算
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {(Object.keys(BUDGET_META) as BudgetKey[]).map((k) => {
                  const active = budget === k;
                  return (
                    <button
                      key={k}
                      onClick={() => setBudget(k)}
                      className={`text-sm px-4 py-3 rounded-lg border transition-all text-left ${
                        active
                          ? "bg-[#1A6DB5]/30 border-[#2EC4B6] text-white font-semibold"
                          : "bg-white/5 border-white/10 text-[#A0C4E8] hover:border-[#1A6DB5]"
                      }`}
                    >
                      {BUDGET_META[k].label}
                    </button>
                  );
                })}
              </div>
              {budget && <p className="text-xs text-[#5A7A9E] mt-2">{BUDGET_META[budget].hint}</p>}
            </div>

            {/* 留資（選填） */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
              <label className="block text-sm font-semibold text-[#2EC4B6] mb-1">
                留下 Email 取得路線圖副本（選填）
              </label>
              <p className="text-xs text-[#5A7A9E] mb-4">填寫後可收到完整路線圖與 AI 轉型週報，隨時可退訂。</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="姓名"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm placeholder-[#5A7A9E] focus:border-[#2EC4B6] focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm placeholder-[#5A7A9E] focus:border-[#2EC4B6] focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="公司名稱"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm placeholder-[#5A7A9E] focus:border-[#2EC4B6] focus:outline-none"
                />
              </div>
            </div>

            {submitError && (
              <div className="bg-red-500/10 border border-red-400/30 text-red-300 text-sm rounded-lg px-4 py-3 mb-6">
                {submitError}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-[#E8912A] hover:bg-[#F0A040] disabled:opacity-50 text-[#0D2B4E] font-bold text-lg px-8 py-4 rounded-full transition-colors shadow-lg shadow-[#E8912A]/20"
            >
              {submitting ? "生成中…" : "生成我的 12 個月路線圖 →"}
            </button>
          </div>
        )}

        {/* ===== STEP 3: 結果 ===== */}
        {step === "result" && result && (
          <div>
            <button
              onClick={() => setStep("form")}
              className="text-sm text-[#A0C4E8] hover:text-white mb-6 transition-colors"
            >
              ← 重新填寫
            </button>

            {/* 標題總結 */}
            <div className="text-center mb-8">
              <p className="text-[#2EC4B6] font-semibold mb-2">你的 AI 轉型路線圖 · 12 個月</p>
              <h2 className="text-2xl md:text-3xl font-black leading-snug mb-4 max-w-3xl mx-auto">
                {result.headline}
              </h2>
              <p className="text-[#A0C4E8] leading-relaxed max-w-2xl mx-auto mb-6">{result.summary}</p>
              <button
                onClick={copyReport}
                className={`inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-full border transition-colors ${
                  copied
                    ? "bg-[#2EC4B6]/20 border-[#2EC4B6] text-[#2EC4B6]"
                    : "bg-[#1A6DB5]/20 border-[#2EC4B6]/50 text-[#2EC4B6] hover:bg-[#1A6DB5]/40"
                }`}
              >
                {copied ? "✓ 已複製完整路線圖" : "📋 複製完整路線圖（純文字）"}
              </button>
            </div>

            {/* 三階段 */}
            <div className="space-y-6 mb-8">
              {result.phases.map((p, idx) => (
                <div key={p.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/10 flex flex-wrap items-center gap-3">
                    <span className="inline-block bg-[#E8912A] text-[#0D2B4E] text-xs font-black px-3 py-1 rounded-full">
                      PHASE {idx + 1}
                    </span>
                    <span className="font-bold text-[#2EC4B6]">{p.months}</span>
                    <span className="font-bold text-lg">{p.theme}</span>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-[#A0C4E8] leading-relaxed mb-5">
                      <strong className="text-white">目標：</strong>
                      {p.goal}
                    </p>
                    <div className="mb-4">
                      <div className="text-xs font-bold text-[#2EC4B6] mb-2">關鍵行動</div>
                      <ol className="space-y-2">
                        {p.actions.map((a, i) => (
                          <li key={i} className="flex gap-3 text-sm leading-relaxed">
                            <span className="shrink-0 w-5 h-5 rounded-full bg-[#1A6DB5]/30 border border-[#1A6DB5]/50 text-[#7CB8E8] text-xs font-bold flex items-center justify-center mt-0.5">
                              {i + 1}
                            </span>
                            <span className="text-[#C9DCEF]">
                              {a.text}
                              {a.href && (
                                <a
                                  href={a.href}
                                  className="ml-2 text-[#2EC4B6] hover:underline font-semibold"
                                >
                                  {a.linkLabel || a.href} →
                                </a>
                              )}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    {p.scenarios.length > 0 && (
                      <div className="mb-4">
                        <div className="text-xs font-bold text-[#2EC4B6] mb-2">推薦場景</div>
                        <div className="flex flex-wrap gap-2">
                          {p.scenarios.map((s) => (
                            <span
                              key={s}
                              className="text-xs bg-[#2EC4B6]/10 border border-[#2EC4B6]/30 text-[#2EC4B6] px-3 py-1.5 rounded-full"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-bold text-[#2EC4B6] mb-2">成功指標</div>
                      <div className="flex flex-wrap gap-2">
                        {p.metrics.map((m) => (
                          <span
                            key={m}
                            className="text-xs bg-[#1A6DB5]/20 border border-[#1A6DB5]/40 text-[#7CB8E8] px-3 py-1.5 rounded-full"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                    {p.warning && (
                      <div className="mt-4 bg-[#E8912A]/10 border border-[#E8912A]/30 rounded-lg px-4 py-3 text-sm text-[#F5C77E]">
                        ⚠️ {p.warning}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 投資配置 */}
            <div className="bg-[#1A6DB5]/10 border border-[#1A6DB5]/30 rounded-xl p-5 mb-8">
              <h3 className="font-bold mb-1">
                💰 {result.investment.label}
                <span className="ml-2 text-sm font-normal text-[#A0C4E8]">
                  總預算級距
                  <span className="text-[#E8912A] font-bold text-lg ml-1">{result.investment.total}</span>
                  元（新台幣／年）
                </span>
              </h3>
              <div className="space-y-3 mt-4">
                {result.investment.splits.map((s) => (
                  <div key={s.name}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-semibold">
                        {s.name} <span className="text-[#2EC4B6]">{s.pct}%</span>
                        <span className="text-[#A0C4E8] font-normal ml-2">約 {s.amount} 元</span>
                      </span>
                      <span className="text-xs text-[#5A7A9E]">{s.desc}</span>
                    </div>
                    <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          s.name === "人" ? "bg-[#E8912A]" : s.name === "流程" ? "bg-[#2EC4B6]" : "bg-[#1A6DB5]"
                        }`}
                        style={{ width: `${s.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#A0C4E8] leading-relaxed mt-4">{result.investment.note}</p>
            </div>

            {/* 全程注意 */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8">
              <h3 className="font-bold mb-3">🚧 這 12 個月全程要注意</h3>
              <ul className="space-y-2">
                {result.watchouts.map((w, i) => (
                  <li key={i} className="flex gap-3 text-sm text-[#C9DCEF] leading-relaxed">
                    <span className="text-[#E8912A] shrink-0">▸</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 免責 */}
            <div className="bg-[#1A6DB5]/10 border border-[#1A6DB5]/30 rounded-xl p-5 mb-8">
              <p className="text-xs text-[#A0C4E8] leading-relaxed">{result.footerNote}</p>
            </div>

            {/* CTA */}
            <div className="text-center mb-6">
              <h3 className="text-xl md:text-2xl font-bold mb-3">有路線圖了，下一步？</h3>
              <p className="text-[#A0C4E8] mb-6 max-w-xl mx-auto">
                路線圖是通用框架，落地要看你的資料條件與產業特性。先做任務盤點、算算 ROI，或直接預約免費 30 分鐘諮詢，把路線圖校準成你的專案。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
                <a
                  href="/amoeba-scan"
                  className="inline-block bg-[#1A6DB5]/20 border border-[#2EC4B6]/50 text-[#2EC4B6] hover:bg-[#1A6DB5]/40 font-bold text-lg px-8 py-4 rounded-full transition-colors"
                >
                  先做任務盤點 →
                </a>
                <a
                  href="/roi-calculator"
                  className="inline-block bg-[#1A6DB5]/20 border border-[#2EC4B6]/50 text-[#2EC4B6] hover:bg-[#1A6DB5]/40 font-bold text-lg px-8 py-4 rounded-full transition-colors"
                >
                  估算 ROI →
                </a>
                <a
                  href="/about/#contact"
                  className="inline-block bg-[#E8912A] hover:bg-[#F0A040] text-[#0D2B4E] font-bold text-lg px-8 py-4 rounded-full transition-colors shadow-lg shadow-[#E8912A]/20"
                >
                  預約免費諮詢 →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
