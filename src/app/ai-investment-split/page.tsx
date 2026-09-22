"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BUCKET_META,
  BUCKET_ORDER,
  STAGE_META,
  evaluateAllocation,
  splitReportText,
  formatWan,
  type AllocationInput,
  type BucketResult,
  type SplitResult,
  type StageKey,
} from "@/lib/ai-investment-split";

/* ============================================
   AI 投資配置體檢（10-20-70 Split Checkup）
   三步驟：介紹 → 輸入 → 結果
   2026-09-22 小賀開發（B2-5 微型工具）

   方法論：
   - 10-20-70 投資原則（技術 10% / 流程 20% / 人 70%）
   - 階段位移：起步期／試點期／規模化期的合理區間不同
   - 預算釋出節奏 30/40/30：預算與驗證綁定，防 Pilot Trap
   - 任務變形蟲：先盤點、再花錢

   漏斗定位：ai-investment-split → ai-roadmap → roi-calculator → 預約諮詢
   ============================================ */

type Step = "intro" | "form" | "result";

const STAGE_KEYS: StageKey[] = ["starting", "piloting", "scaling"];

const PRESETS: { label: string; hint: string; tech: number; process: number; people: number }[] = [
  { label: "標準 10-20-70", hint: "試點期建議配置", tech: 10, process: 20, people: 70 },
  { label: "工具導向 70/20/10", hint: "常見的失衡型態", tech: 70, process: 20, people: 10 },
  { label: "平均分配 34/33/33", hint: "看起來公平，但沒有重點", tech: 34, process: 33, people: 33 },
];

const STATUS_STYLE: Record<BucketResult["status"], { bar: string; badge: string; text: string }> = {
  ok: { bar: "bg-[#2EC4B6]", badge: "bg-[#2EC4B6]/20 text-[#2EC4B6] border-[#2EC4B6]/40", text: "落在區間" },
  low: { bar: "bg-[#E8912A]", badge: "bg-[#E8912A]/20 text-[#E8912A] border-[#E8912A]/40", text: "不足" },
  high: { bar: "bg-[#F2705C]", badge: "bg-[#F2705C]/20 text-[#F2705C] border-[#F2705C]/40", text: "超配" },
};

const GRADE_STYLE: Record<SplitResult["gradeColor"], string> = {
  green: "bg-[#2EC4B6]/20 text-[#2EC4B6] border-[#2EC4B6]/40",
  yellow: "bg-yellow-400/20 text-yellow-300 border-yellow-400/40",
  orange: "bg-[#E8912A]/20 text-[#E8912A] border-[#E8912A]/40",
  red: "bg-[#F2705C]/20 text-[#F2705C] border-[#F2705C]/40",
};

export default function AIInvestmentSplitPage() {
  const [step, setStep] = useState<Step>("intro");
  const [stage, setStage] = useState<StageKey>("piloting");
  const [budget, setBudget] = useState("300");
  const [tech, setTech] = useState("35");
  const [processPct, setProcessPct] = useState("30");
  const [people, setPeople] = useState("35");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [leadEmail, setLeadEmail] = useState<string | null>(null);
  const [result, setResult] = useState<SplitResult | null>(null);
  const [copied, setCopied] = useState(false);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);

  const num = (s: string) => {
    const n = parseFloat(s);
    return isNaN(n) ? 0 : n;
  };

  const budgetWan = num(budget);
  // 與 rules engine 一致：逐桶四捨五入後再加總（避免 33.5/33.5/33 這類輸入兩邊算不一樣）
  const totalPct = Math.round(num(tech)) + Math.round(num(processPct)) + Math.round(num(people));
  const canSubmit = budgetWan > 0 && totalPct > 0;

  // 步驟切到結果頁時把焦點移到標題，讓鍵盤與螢幕閱讀器使用者知道畫面已更新
  useEffect(() => {
    if (step === "result") resultHeadingRef.current?.focus();
  }, [step]);

  const buildInput = useCallback(
    (): AllocationInput => ({
      stage,
      budgetWan: num(budget),
      techPct: num(tech),
      processPct: num(processPct),
      peoplePct: num(people),
    }),
    [stage, budget, tech, processPct, people]
  );

  const handleSubmit = useCallback(
    (scrollToTop = true) => {
      if (!canSubmit) return;

      const input = buildInput();
      const r = evaluateAllocation(input);
      setResult(r);

      // 先交結果畫面，再處理留資——任何情況都不讓使用者等不到結果
      setStep("result");
      if (scrollToTop) window.scrollTo({ top: 0, behavior: "smooth" });

      // 留資（選填）：背景送出。不 await、失敗靜默；
      // 用「上次送出的 Email」比對而不是布林值，改過信箱再送出時才會真的重送。
      if (email && email !== leadEmail) {
        try {
          const pending = fetch("/api/newsletter/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: AbortSignal.timeout(10000),
            body: JSON.stringify({
              name: name || "投資配置體檢訪客",
              email,
              company: company || "未填寫",
              industry: "其他／綜合",
              ai_stage: stage === "starting" ? "not_started" : stage === "piloting" ? "piloting" : "scaling",
              challenges: ["AI 投資配置", "預算編列"],
              message: `配置體檢：技術 ${input.techPct}% / 流程 ${input.processPct}% / 人 ${input.peoplePct}%（預算 ${formatWan(
                input.budgetWan
              )}）`,
              source: "ai-investment-split",
              subscribed_at: new Date().toISOString(),
            }),
          });
          // 請求確實送出後才顯示「已送出」，避免在送不出去的環境給出假的成功訊息
          setLeadEmail(email);
          pending.catch(() => {
            // silent：留資失敗不影響結果，也不打擾使用者
          });
        } catch {
          // silent：即使環境不支援 AbortSignal.timeout 也不能擋住結果畫面
        }
      }
    },
    [canSubmit, buildInput, email, leadEmail, name, company, stage]
  );

  const copyReport = async () => {
    if (!result) return;
    const text = splitReportText(buildInput(), result);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
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
        /* silent */
      }
      document.body.removeChild(ta);
    }
    setTimeout(() => setCopied(false), 2500);
  };

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setTech(String(p.tech));
    setProcessPct(String(p.process));
    setPeople(String(p.people));
  };

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-[#0D2B4E] via-[#0D2B4E] to-[#0A1F3A] text-white">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        {/* ===== STEP 1: INTRO ===== */}
        {step === "intro" && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#1A6DB5]/20 border border-[#2EC4B6]/30 rounded-full px-4 py-1.5 mb-6">
              <span className="text-sm text-[#2EC4B6] font-semibold">10-20-70 · 預算配置體檢</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6">
              你的 AI 預算，
              <br />
              花在<span className="text-[#2EC4B6]">對的地方</span>了嗎？
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              AI 轉型最常見的失敗不是「買錯工具」，而是
              <strong className="text-white">錢的結構錯了</strong>——技術買太多、人的能力給太少。
              10-20-70 是顧問業常用的經驗原則：<strong className="text-white">技術 10%、流程 20%、人 70%</strong>。
              輸入你的預算與配置，兩分鐘看出哪一桶失衡、該把錢移到哪裡。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
              {BUCKET_ORDER.map((key) => {
                const meta = BUCKET_META[key];
                const pct = key === "tech" ? 10 : key === "process" ? 20 : 70;
                return (
                  <div key={key} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{meta.icon}</span>
                      <span className="text-2xl font-black text-[#2EC4B6]">{pct}%</span>
                    </div>
                    <div className="font-bold text-white/90 mb-1">{meta.label}</div>
                    <div className="text-xs text-white/50 leading-relaxed">{meta.desc}</div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => {
                setStep("form");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="bg-[#E8912A] hover:bg-[#F5A623] text-white font-bold px-10 py-4 rounded-full text-lg transition-colors shadow-lg"
            >
              開始體檢 →
            </button>
            <p className="text-white/40 text-xs mt-4">約 2 分鐘 · 不需留資即可看結果</p>
          </div>
        )}

        {/* ===== STEP 2: FORM ===== */}
        {step === "form" && (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-black mb-2">輸入你的預算與配置</h1>
            <p className="text-white/50 text-sm mb-8">
              三桶的定義：技術＝工具授權與整合；流程＝流程重畫與導入執行；人＝培訓、種子人員與能力建置。
            </p>

            {/* 預算 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
              <label htmlFor="budget" className="block font-bold mb-2">
                年度 AI 投資預算（萬元）
              </label>
              <p className="text-white/40 text-xs mb-3">
                含工具授權、顧問輔導、培訓與內部人力工時；沒有正式預算就填「今年大概會花多少」。
              </p>
              <input
                id="budget"
                type="number"
                min={1}
                step={10}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2EC4B6]"
                aria-describedby="budget-hint"
              />
              <p id="budget-hint" className="text-white/40 text-xs mt-2">
                目前輸入：{budgetWan > 0 ? formatWan(budgetWan) : "尚未輸入"}
              </p>
            </div>

            {/* 階段 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
              <fieldset>
                <legend className="font-bold mb-1">你目前在哪個階段？</legend>
                <p className="text-white/40 text-xs mb-4">
                  建議配置會依階段位移：起步期技術少一點、規模化期技術授權會上升。
                </p>
                <div className="space-y-2">
                  {STAGE_KEYS.map((key) => (
                    <label
                      key={key}
                      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        stage === key
                          ? "bg-[#1A6DB5]/30 border border-[#1A6DB5]/50"
                          : "bg-white/5 border border-white/5 hover:bg-white/10"
                      }`}
                    >
                      <input
                        type="radio"
                        name="stage"
                        value={key}
                        checked={stage === key}
                        onChange={() => setStage(key)}
                        className="mt-1 accent-[#E8912A]"
                      />
                      <span>
                        <span className="block text-white/90 text-sm font-semibold">{STAGE_META[key].label}</span>
                        <span className="block text-white/45 text-xs mt-0.5">{STAGE_META[key].hint}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            {/* 配置 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
              <h2 className="font-bold mb-1">目前（或預計）的配置比例</h2>
              <p className="text-white/40 text-xs mb-4">
                三桶合計應為 100%。如果還在構想階段，先填「打算怎麼分」也可以。
              </p>

              <div className="flex flex-wrap gap-2 mb-5">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => applyPreset(p)}
                    aria-pressed={num(tech) === p.tech && num(processPct) === p.process && num(people) === p.people}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    {p.label}
                    <span className="text-white/40 ml-1">（{p.hint}）</span>
                  </button>
                ))}
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {BUCKET_ORDER.map((key) => {
                  const meta = BUCKET_META[key];
                  const value = key === "tech" ? tech : key === "process" ? processPct : people;
                  const setValue = key === "tech" ? setTech : key === "process" ? setProcessPct : setPeople;
                  return (
                    <div key={key}>
                      <label htmlFor={`pct-${key}`} className="block text-sm font-semibold mb-2">
                        {meta.icon} {meta.label}（%）
                      </label>
                      <input
                        id={`pct-${key}`}
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2EC4B6]"
                      />
                    </div>
                  );
                })}
              </div>

              <p
                className={`text-xs mt-4 font-semibold ${
                  totalPct === 100 ? "text-[#2EC4B6]" : "text-[#E8912A]"
                }`}
                role="status"
              >
                合計 {totalPct}%{totalPct === 100 ? "（正確）" : "——不等於 100%，建議先確認"}
              </p>
            </div>

            {/* 留資 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
              <h2 className="font-bold mb-1">📬 想收到完整配置建議書？（選填）</h2>
              <p className="text-white/40 text-xs mb-4">
                留 Email 可收到《AI 投資配置檢核表》，並在預算檢討時提醒你複檢。不留也能看結果。
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mb-3">
                <input
                  id="lead-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="姓名（選填）"
                  aria-label="姓名"
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#2EC4B6]"
                />
                <input
                  id="lead-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email（選填）"
                  aria-label="Email"
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#2EC4B6]"
                />
              </div>
              <label htmlFor="lead-company" className="sr-only">
                公司名稱
              </label>
              <input
                id="lead-company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="公司名稱（選填）"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#2EC4B6]"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => {
                  setStep("intro");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-6 py-3 rounded-full font-semibold text-white/70 hover:text-white transition-colors"
              >
                ← 回上一步
              </button>
              <button
                onClick={() => handleSubmit(true)}
                disabled={!canSubmit}
                className="bg-[#E8912A] hover:bg-[#F5A623] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-8 py-3.5 rounded-full transition-colors shadow-lg"
              >
                看體檢結果 →
              </button>
            </div>
            {!canSubmit && (
              <p className="text-[#E8912A] text-xs text-right mt-3" role="status">
                請先填入大於 0 的年度預算，以及三桶合計大於 0% 的配置比例。
              </p>
            )}
          </div>
        )}

        {/* ===== STEP 3: RESULT ===== */}
        {step === "result" && result && (
          <div className="max-w-3xl mx-auto">
            {/* Headline */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-[#1A6DB5]/20 border border-[#2EC4B6]/30 rounded-full px-4 py-1.5 mb-6">
                <span className="text-sm text-[#2EC4B6] font-semibold">AI 投資配置體檢結果</span>
              </div>
              <h1 ref={resultHeadingRef} tabIndex={-1} className="text-3xl md:text-4xl font-black mb-4 focus:outline-none">
                配置健康分 <span className="text-[#2EC4B6]">{result.healthScore}</span> 分
              </h1>
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold border ${GRADE_STYLE[result.gradeColor]}`}>
                  {result.grade}
                </span>
                <span className="text-white/50 text-sm">
                  {formatWan(budgetWan)} · {STAGE_META[stage].label.replace(/（.*）/, "")}
                </span>
              </div>
              <p className="text-white font-bold mb-4">{result.headline}</p>
              <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">{result.summary}</p>
            </div>

            {/* 三桶對照 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-8">
              <h2 className="text-lg font-bold mb-1">三桶對照：目前 vs 建議區間</h2>
              <p className="text-white/40 text-xs mb-6">
                深色長條＝你目前的配置；綠色區塊＝這個階段的建議區間（{STAGE_META[stage].rationale}）
              </p>
              <div className="space-y-7">
                {result.buckets.map((b) => {
                  const style = STATUS_STYLE[b.status];
                  return (
                    <div key={b.key}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{b.icon}</span>
                          <span className="font-bold">{b.label}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${style.badge}`}>
                            {style.text}
                          </span>
                        </div>
                        <span className="text-sm text-white/60">
                          目前 {b.currentPct}%（{b.currentAmount}）
                        </span>
                      </div>

                      {/* 目前 */}
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="text-xs text-white/45 w-8 shrink-0">目前</span>
                        <div
                          className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden"
                          role="img"
                          aria-label={`${b.label}桶目前配置 ${b.currentPct}%`}
                        >
                          <div className={`h-full rounded-full ${style.bar}`} style={{ width: `${b.currentPct}%` }} />
                        </div>
                        <span className="text-xs font-bold w-10 text-right">{b.currentPct}%</span>
                      </div>

                      {/* 建議 */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-white/45 w-8 shrink-0">建議</span>
                        <div
                          className="flex-1 h-3 bg-white/10 rounded-full relative overflow-hidden"
                          role="img"
                          aria-label={`${b.label}桶建議區間 ${b.targetRange[0]}% 到 ${b.targetRange[1]}%`}
                        >
                          <div
                            className="absolute inset-y-0 bg-[#2EC4B6]/70 rounded-full"
                            style={{
                              left: `${b.targetRange[0]}%`,
                              width: `${b.targetRange[1] - b.targetRange[0]}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-white/60 w-10 text-right">
                          {b.targetRange[0]}–{b.targetRange[1]}
                        </span>
                      </div>

                      <p className="text-xs text-white/50 mt-2">
                        建議金額約 {b.targetAmount} · <span className="text-white/70">{b.gapLabel}</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 診斷 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-8">
              <h2 className="text-lg font-bold mb-4">🔎 診斷</h2>
              <ul className="space-y-3">
                {result.diagnosis.map((d, i) => (
                  <li key={i} className="text-white/75 text-sm leading-relaxed flex gap-2">
                    <span className="text-[#2EC4B6] shrink-0">•</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 調整行動 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-8">
              <h2 className="text-lg font-bold mb-4">🎯 這一桶怎麼調</h2>
              <div className="space-y-6">
                {result.buckets.map((b) => (
                  <div key={b.key}>
                    <h3 className="font-bold text-white/90 mb-2">
                      {b.icon} {b.label}桶
                      <span className="text-white/40 text-xs font-normal ml-2">
                        目前 {b.currentPct}% ／ 建議 {b.targetRange[0]}–{b.targetRange[1]}%
                      </span>
                    </h3>
                    <ul className="space-y-2">
                      {b.actions.map((a, i) => (
                        <li key={i} className="text-white/75 text-sm leading-relaxed flex gap-2">
                          <span className="text-[#E8912A] shrink-0">→</span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* 症狀自檢 */}
            {result.symptoms.length > 0 && (
              <div className="bg-[#E8912A]/10 border border-[#E8912A]/30 rounded-2xl p-6 md:p-8 mb-8">
                <h2 className="text-lg font-bold mb-1 text-[#F5A623]">🩺 症狀自檢：有沒有這些情況？</h2>
                <p className="text-white/50 text-xs mb-5">勾中任何一項，代表那個桶的錢確實花得不夠或花錯了地方。</p>
                <div className="space-y-5">
                  {result.symptoms.map((s) => (
                    <div key={s.bucket}>
                      <div className="font-semibold text-white/85 text-sm mb-2">{s.bucket}</div>
                      <ul className="space-y-2">
                        {s.items.map((it, i) => (
                          <li key={i} className="text-white/70 text-sm flex gap-2">
                            <span className="text-white/30 shrink-0">□</span>
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 釋出節奏 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-8">
              <h2 className="text-lg font-bold mb-1">📅 預算不要一次給完：30 / 40 / 30</h2>
              <p className="text-white/50 text-xs mb-6 leading-relaxed">
                配置對了一半，另一半是「什麼時候給錢」。把預算與驗證里程碑綁定，是避免落入 Pilot Trap（試點永遠在試點、資源耗盡）最具體的機制。
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                {result.releasePhases.map((p) => (
                  <div key={p.label} className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <div className="text-xs text-white/45 mb-1">{p.label}</div>
                    <div className="text-2xl font-black text-[#2EC4B6] mb-1">{p.pct}%</div>
                    <div className="text-sm font-bold text-white/80 mb-3">{p.amount}</div>
                    <p className="text-white/60 text-xs leading-relaxed">{p.gate}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 換算 */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {result.conversions.map((c) => (
                <div key={c.title} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="font-bold mb-3">{c.title}</h3>
                  <ul className="space-y-2 mb-4">
                    {c.lines.map((l, i) => (
                      <li key={i} className="text-white/75 text-sm leading-relaxed flex gap-2">
                        <span className="text-[#2EC4B6] shrink-0">·</span>
                        <span>{l}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-white/40 text-xs leading-relaxed">{c.note}</p>
                </div>
              ))}
            </div>

            {/* 複製 */}
            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={copyReport}
                aria-pressed={copied}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-colors"
              >
                {copied ? "✓ 已複製" : "複製完整報告"}
              </button>
              <span className="text-white/40 text-xs">貼給財務或顧問，預算檢討會議會好談很多</span>
            </div>

            {/* 留資 */}
            {!leadEmail ? (
              <div className="bg-gradient-to-br from-[#1A6DB5]/20 to-[#2EC4B6]/10 border border-[#2EC4B6]/30 rounded-2xl p-6 mb-8">
                <h2 className="text-lg font-bold mb-1">📬 想拿到完整配置建議書？</h2>
                <p className="text-white/60 text-sm mb-4 leading-relaxed">
                  留下 Email，我們寄送《AI 投資配置檢核表》（含各階段建議區間與採購前自問清單）。
                </p>
                <div className="grid sm:grid-cols-2 gap-3 mb-3">
                  <label htmlFor="result-name" className="sr-only">
                    姓名
                  </label>
                  <input
                    id="result-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="姓名（選填）"
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#2EC4B6]"
                  />
                  <label htmlFor="result-email" className="sr-only">
                    Email
                  </label>
                  <input
                    id="result-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email（必填）"
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#2EC4B6]"
                  />
                </div>
                <label htmlFor="result-company" className="sr-only">
                  公司名稱
                </label>
                <input
                  id="result-company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="公司名稱（選填）"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#2EC4B6] mb-4"
                />
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={!email}
                  className="bg-[#E8912A] hover:bg-[#F5A623] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-full transition-colors"
                >
                  訂閱並取得檢核表 →
                </button>
                {!email && (
                  <p className="text-white/40 text-xs mt-3" role="status">
                    填上 Email 即可送出（不留 Email 也能看到完整結果）。
                  </p>
                )}
                <p className="text-white/30 text-xs mt-3">我們只寄有用的內容，隨時可退訂。</p>
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8" role="status">
                <p className="text-white/60 text-sm leading-relaxed">
                  已送出 {leadEmail}，檢核表會寄到這個信箱。若一直沒收到，直接
                  <a href="/about/#contact" className="text-[#2EC4B6] hover:text-[#7FE3D8] font-semibold ml-1">
                    預約免費諮詢
                  </a>
                  比較快。
                </p>
              </div>
            )}

            {/* 漏斗 CTA */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <h2 className="text-xl font-bold mb-2">配置校準之後，下一步？</h2>
              <p className="text-white/60 text-sm mb-6 leading-relaxed">
                比例對了，接著要知道「錢花下去會回什麼」。用 ROI 估算器把節省工時換算成金額，
                再用路線圖生成器把配置排進 12 個月的行動計畫。
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="/roi-calculator"
                  className="bg-[#1A6DB5] hover:bg-[#2680CC] text-white font-bold px-8 py-3 rounded-full transition-colors"
                >
                  估算 AI 投資回報 →
                </a>
                <a
                  href="/ai-roadmap"
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-full transition-colors"
                >
                  生成 12 個月路線圖
                </a>
                <a
                  href="/about/#contact"
                  className="text-[#E8912A] hover:text-[#F5A623] font-semibold px-4 py-3 transition-colors"
                >
                  預約免費諮詢 →
                </a>
              </div>
              <p className="text-white/30 text-xs mt-6 leading-relaxed">{result.disclaimer}</p>
              <div className="mt-5 flex items-center justify-center gap-4">
                <button
                  onClick={() => {
                    setStep("form");
                    setResult(null);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-white/60 hover:text-white text-sm font-semibold transition-colors"
                >
                  重新輸入配置
                </button>
                <span className="text-white/20">|</span>
                <a href="/tools" className="text-white/60 hover:text-white text-sm font-semibold transition-colors">
                  回工具箱
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
