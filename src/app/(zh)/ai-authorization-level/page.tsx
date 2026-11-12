"use client";

import { useState, useCallback } from "react";
import {
  getDimensions,
  evaluate,
  type DimensionKey,
  type AuthLevelResult,
} from "@/lib/ai-authorization-level";
import { withUtmPayload } from "@/lib/utm";

/* ============================================
   AI 員工授權等級測驗（B5-2 微型工具）
   方法論：榕耀管顧研究專刊《人類與 AI 的授權悖論》
   四級：L1 建議 / L2 可逆執行 / L3 不可逆執行 / L4 對外代表

   留規則（與 human-ai-alignment 一致）：
   1. 顯示條件用獨立的 leadEmail 狀態
   2. 先交結果畫面，背景送 fetch，不 await 在切換之前
   3. fetch 包 try/catch + AbortSignal.timeout(10000)，失敗静默
   4. company 空著要送「未填寫」
   ============================================ */

type Step = "intro" | "quiz" | "result";

const DIMENSIONS = getDimensions();
const TOTAL_QUESTIONS = DIMENSIONS.length;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LEVEL_COLORS: Record<string, string> = {
  L1: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  L2: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  L3: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  L4: "bg-red-500/20 text-red-300 border-red-500/30",
};

const LEVEL_BAR_COLORS: Record<string, string> = {
  L1: "bg-teal-400",
  L2: "bg-blue-400",
  L3: "bg-orange-400",
  L4: "bg-red-400",
};

function LevelBadge({ level, label }: { level: string; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border ${
        LEVEL_COLORS[level] || "bg-white/10 text-white"
      }`}
    >
      {label}
    </span>
  );
}

export default function AIAuthorizationLevelPage() {
  const [step, setStep] = useState<Step>("intro");
  const [taskDescription, setTaskDescription] = useState("");
  const [answers, setAnswers] = useState<Record<DimensionKey, number>>({
    data: 0,
    cost: 0,
    review: 0,
    external: 0,
  });
  const [result, setResult] = useState<AuthLevelResult | null>(null);
  const [copied, setCopied] = useState(false);

  // 留資
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [leadEmail, setLeadEmail] = useState<string | null>(null);
  const [leadError, setLeadError] = useState<string | null>(null);
  const [leadSubmitting, setLeadSubmitting] = useState(false);

  const answeredCount = Object.values(answers).filter((v) => v > 0).length;
  const allAnswered = answeredCount === TOTAL_QUESTIONS;

  const setAnswer = useCallback((key: DimensionKey, value: number) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  const showResult = useCallback(() => {
    if (!allAnswered) return;
    setResult(evaluate(answers, taskDescription));
    setStep("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [allAnswered, answers, taskDescription]);

  const restart = useCallback(() => {
    setTaskDescription("");
    setAnswers({ data: 0, cost: 0, review: 0, external: 0 });
    setResult(null);
    setLeadEmail(null);
    setLeadError(null);
    setName("");
    setEmail("");
    setCompany("");
    setCopied(false);
    setStep("intro");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const emailIsValid = EMAIL_RE.test(email.trim());

  const stageMap: Record<string, string> = {
    L1: "not_started",
    L2: "exploring",
    L3: "piloting",
    L4: "scaling",
  };

  const submitLead = useCallback(() => {
    if (!result || !emailIsValid || leadSubmitting) return;
    setLeadSubmitting(true);
    try {
      const pending = fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(10000),
        body: JSON.stringify(withUtmPayload({
          name: name.trim() || "授權等級測驗訪客",
          email: email.trim(),
          company: company.trim() || "未填寫",
          industry: "其他／綜合",
          ai_stage: stageMap[result.level] ?? "exploring",
          auth_level: result.level,
          challenges: ["授權等級判斷", result.levelLabel],
          message: `任務：${
            taskDescription.trim() || "未填寫"
          }；建議等級：${result.levelLabel}；${result.gaps
            .map((g) => g.label)
            .join("、") || "無缺口"}`,
          source: "ai-authorization-level",
        })),
      });
      setLeadError(null);
      pending
        .then((res) => {
          if (res.ok) {
            setLeadEmail(email.trim());
          } else {
            setLeadError("送出失敗，請稍後再試，或直接預約免費諮詢。");
          }
        })
        .catch(() => {
          setLeadError("送出失敗，請檢查網路後再試，或直接預約免費諮詢。");
        })
        .finally(() => setLeadSubmitting(false));
    } catch {
      setLeadSubmitting(false);
      setLeadError("這個瀏覽器無法送出表單，請直接預約免費諮詢。");
    }
  }, [result, emailIsValid, leadSubmitting, name, email, company, taskDescription]);

  const copyReport = async () => {
    if (!result) return;
    const text = result.reportText;
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
        // noop
      }
      document.body.removeChild(ta);
    }
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-[#0D2B4E] via-[#0D2B4E] to-[#0A1F3A] text-white">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <p className="sr-only" aria-live="polite">
          {step === "intro"
            ? "AI 員工授權等級測驗介紹"
            : step === "quiz"
            ? "作答四個維度"
            : "測驗結果"}
        </p>

        {/* ===== STEP 1: intro ===== */}
        {step === "intro" && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#1A6DB5]/20 border border-[#2EC4B6]/30 rounded-full px-4 py-1.5 mb-6">
              <span className="text-sm text-[#2EC4B6] font-semibold">
                榕耀管顧原創 · 授權悖論四級
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6">
              這件事，
              <br />
              <span className="text-[#2EC4B6]">AI 該做到什麼程度？</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              不是「能不能」，是「該不該」。
              <strong className="text-white">授權該用「能不能回頭」分級</strong>
              ，不是用金額或部門。
              四個維度、約 3 分鐘，判斷一個任務適合 L1 到 L4 的哪一級。
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-8">
              {[
                { l: "L1", n: "建議", d: "AI 產出，人決定" },
                { l: "L2", n: "可逆執行", d: "AI 動手，錯了能恢復" },
                { l: "L3", n: "不可逆執行", d: "做了回不去，雙人核准" },
                { l: "L4", n: "對外代表", d: "綁住公司，具名授權" },
              ].map((item) => (
                <div key={item.l} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-[#2EC4B6]">{item.l}</div>
                  <div className="text-sm font-semibold text-white/90">{item.n}</div>
                  <div className="text-[11px] text-white/55 mt-1">{item.d}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setStep("quiz");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="bg-[#E8912A] hover:bg-[#F5A623] text-white font-bold px-10 py-4 rounded-full text-lg transition-colors shadow-lg"
            >
              開始測驗 →
            </button>
            <p className="text-white/60 text-xs mt-4">4 題 · 約 3 分鐘 · 不需留資即可看完整結果</p>
          </div>
        )}

        {/* ===== STEP 2: quiz ===== */}
        {step === "quiz" && (
          <div className="max-w-2xl mx-auto">
            {/* progress */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden"
                role="progressbar"
                aria-label={`作答進度：${answeredCount} / ${TOTAL_QUESTIONS}`}
                aria-valuemin={0}
                aria-valuemax={TOTAL_QUESTIONS}
                aria-valuenow={answeredCount}
              >
                <div
                  className="h-full bg-[#2EC4B6] rounded-full transition-all"
                  style={{ width: `${(answeredCount / TOTAL_QUESTIONS) * 100}%` }}
                />
              </div>
              <span className="text-white/50 text-sm tabular-nums">
                {answeredCount} / {TOTAL_QUESTIONS}
              </span>
            </div>

            {/* task description */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8">
              <label htmlFor="task-desc" className="block text-white font-semibold mb-2">
                先形容一下這個任務（選填，結果報告會帶上）
              </label>
              <textarea
                id="task-desc"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="例如：每週三自動給客戶發送週報郵件"
                rows={3}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#2EC4B6] resize-none"
              />
            </div>

            <div className="space-y-6">
              {DIMENSIONS.map((dim, idx) => (
                <fieldset key={dim.key} className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <legend className="text-white font-semibold mb-4">
                    <span className="text-[#2EC4B6] font-bold">{idx + 1}.</span>{" "}
                    <span className="mr-2" aria-hidden="true">
                      {dim.icon}
                    </span>
                    {dim.question}
                  </legend>
                  <div className="space-y-2">
                    {dim.options.map((opt) => {
                      const selected = answers[dim.key] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setAnswer(dim.key, opt.value)}
                          aria-pressed={selected}
                          className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${
                            selected
                              ? "bg-[#1A6DB5]/30 border border-[#2EC4B6]/60"
                              : "bg-white/5 border border-white/5 hover:bg-white/10"
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`shrink-0 w-5 h-5 rounded-full border text-[10px] font-bold flex items-center justify-center mt-0.5 ${
                              selected
                                ? "border-[#2EC4B6] bg-[#2EC4B6] text-[#0D2B4E]"
                                : "border-white/30 text-white/40"
                            }`}
                          >
                            {opt.value}
                          </span>
                          <span className={`text-sm leading-relaxed ${selected ? "text-white" : "text-white/75"}`}>
                            {opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>

            <div className="flex items-center justify-between mt-8">
              <button
                onClick={() => {
                  setStep("intro");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-6 py-3 rounded-full font-semibold text-white/70 hover:text-white transition-colors"
              >
                ← 返回介紹
              </button>
              <button
                onClick={showResult}
                disabled={!allAnswered}
                className="bg-[#E8912A] hover:bg-[#F5A623] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-full transition-colors shadow-lg"
              >
                看結果 →
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 3: result ===== */}
        {step === "result" && result && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-[#1A6DB5]/20 border border-[#2EC4B6]/30 rounded-full px-4 py-1.5 mb-6">
                <span className="text-sm text-[#2EC4B6] font-semibold">AI 員工授權等級測驗結果</span>
              </div>
              <div className="text-5xl mb-4">{result.icon}</div>
              <h1 className="text-3xl md:text-4xl font-black mb-4">
                <span className="text-[#2EC4B6]">{result.levelLabel}</span>
              </h1>
              <p className="text-xl text-white/90 font-semibold mb-4">{result.headline}</p>
              <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">{result.summary}</p>
            </div>

            {/* dimension bars */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
              <h2 className="text-lg font-bold mb-5">四維度評分</h2>
              <div className="space-y-4">
                {DIMENSIONS.map((dim) => {
                  const score = answers[dim.key];
                  const pct = (score / 5) * 100;
                  return (
                    <div key={dim.key}>
                      <div className="flex items-center justify-between gap-3 mb-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span aria-hidden="true">{dim.icon}</span>
                          <span className="text-white/80 font-medium text-sm whitespace-nowrap">{dim.label}</span>
                        </div>
                        <span className="text-white font-bold text-sm tabular-nums">{score} / 5</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${LEVEL_BAR_COLORS[result.level] || "bg-[#2EC4B6]"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-white/55 text-xs mt-4">
                資料穩定度：5 分越穩定、越適合自動化；
                錯誤成本、人工覆核難度、外部影響範圍：5 分風險越高、越不適合自動化。
                簡單說：資料越穩定、成本越低、覆核越容易、外部越小，越適合讓 AI 自動執行。
              </p>
            </div>

            {/* gaps */}
            {result.gaps.length > 0 && (
              <div className="bg-[#E8912A]/10 border border-[#E8912A]/40 rounded-2xl p-6 mb-8">
                <h2 className="text-lg font-bold text-[#E8912A] mb-4">⚠️ 缺口提醒</h2>
                <ul className="space-y-3">
                  {result.gaps.map((g) => (
                    <li key={g.key} className="text-white/80 text-sm leading-relaxed">
                      <strong className="text-white">{g.label}：</strong>
                      {g.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* risks */}
            {result.risks.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
                <h2 className="text-lg font-bold mb-4">主要風險</h2>
                <ul className="space-y-2">
                  {result.risks.map((r, i) => (
                    <li key={i} className="text-white/75 text-sm leading-relaxed">
                      • {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* audit */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
              <h2 className="text-lg font-bold mb-4">必要審核機制</h2>
              <ul className="space-y-3">
                {result.audit.map((a, i) => (
                  <li key={i} className="flex gap-3 text-white/80 text-sm leading-relaxed">
                    <span className="shrink-0 text-[#2EC4B6]">✓</span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            {/* checklist */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
              <h2 className="text-lg font-bold mb-4">下一步檢查清單</h2>
              <ul className="space-y-3">
                {result.checklist.map((c, i) => (
                  <li key={i} className="flex gap-3 text-white/80 text-sm leading-relaxed">
                    <span className="shrink-0 text-white/40">{i + 1}.</span>
                    {c}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-3 mt-6 pt-5 border-t border-white/10">
                <button
                  onClick={copyReport}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-colors"
                >
                  {copied ? "✓ 已複製" : "複製完整報告"}
                </button>
                <span className="text-white/55 text-xs">把結果貼給顧問，討論從授權等級開始</span>
              </div>
            </div>

            {/* lead capture */}
            {leadEmail === null ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitLead();
                }}
                className="bg-gradient-to-br from-[#1A6DB5]/20 to-[#2EC4B6]/10 border border-[#2EC4B6]/30 rounded-2xl p-6 mb-8"
              >
                <h2 className="text-lg font-bold mb-1">📨 想追蹤授權四級的實作方法？</h2>
                <p className="text-white/60 text-sm mb-4 leading-relaxed">
                  留下 Email，我會把授權四級的檢查表、企業案例與常見錯誤寫進《榕賀觀點》電子報，約每個月一至兩封。
                  不留 Email 也看得到完整結果。
                </p>
                <div className="grid sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label htmlFor="aal-name" className="block text-white/50 text-xs mb-1">
                      姓名（選填）
                    </label>
                    <input
                      id="aal-name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="怎麼稱呼你"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#2EC4B6]"
                    />
                  </div>
                  <div>
                    <label htmlFor="aal-email" className="block text-white/50 text-xs mb-1">
                      Email（必填）
                    </label>
                    <input
                      id="aal-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      aria-invalid={email.length > 0 && !emailIsValid}
                      aria-describedby={email.length > 0 && !emailIsValid ? "aal-email-error" : undefined}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#2EC4B6]"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="aal-company" className="block text-white/50 text-xs mb-1">
                    公司名稱（選填）
                  </label>
                  <input
                    id="aal-company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="公司或單位"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#2EC4B6]"
                  />
                </div>
                {email.length > 0 && !emailIsValid && (
                  <p id="aal-email-error" className="text-red-300 text-xs mb-3">請輸入有效的 Email 格式</p>
                )}
                {leadError && <p className="text-red-300 text-sm mb-3">{leadError}</p>}
                <button
                  type="submit"
                  disabled={!emailIsValid || leadSubmitting}
                  className="bg-[#E8912A] hover:bg-[#F5A623] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-full transition-colors"
                >
                  {leadSubmitting ? "送出中..." : "訂閱電子報 →"}
                </button>
                <p className="text-white/60 text-xs mt-3">只寄電子報，隨時可退訂。</p>
              </form>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8" role="status">
                <p className="text-white/60 text-sm leading-relaxed">
                  已收到 {leadEmail}，之後會把授權四級的實作心得寫進《榕賀觀點》寄到這個信箱（若沒收到，請看垃圾信件匣）。
                  想更快討論你們的授權邊界，直接
                  <a href="/about/#contact" className="text-[#2EC4B6] hover:text-[#7FE3D8] font-semibold ml-1">
                    預約免費諮詢
                  </a>
                  。
                </p>
              </div>
            )}

            {/* CTAs */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <h2 className="text-xl font-bold mb-2">接下來可以做什麼？</h2>
              <p className="text-white/70 text-sm mb-6 leading-relaxed max-w-xl mx-auto">
                授權等級是單一任務的判斷。如果你想知道整個組織的人機策略是不是對齊，或是
                AI 員工管理到了哪一階，可以繼續測。
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="/human-ai-alignment"
                  className="bg-[#1A6DB5] hover:bg-[#2680CC] text-white font-bold px-8 py-3 rounded-full transition-colors"
                >
                  人機策略對齊度自評 →
                </a>
                <a
                  href="/ai-employee-diagnosis"
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-full transition-colors"
                >
                  AI 員工管理五階自評 →
                </a>
                <a
                  href="/about/#contact"
                  className="text-[#E8912A] hover:text-[#F5A623] font-semibold px-4 py-3 transition-colors"
                >
                  預約免費諮詢 →
                </a>
              </div>
              <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-white/55 text-xs text-left leading-relaxed">
                  本工具依榕耀管顧研究專刊《人類與 AI 的授權悖論》計分，分級依據為「能不能回頭」，而非金額或部門。
                </p>
                <button
                  onClick={restart}
                  className="text-white/65 hover:text-white text-xs underline underline-offset-4 shrink-0"
                >
                  重新測驗
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
