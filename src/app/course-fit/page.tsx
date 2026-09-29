"use client";

import { useState, useCallback, useMemo } from "react";
import {
  ROLE_META,
  EXPERIENCE_META,
  READINESS_META,
  COMMITMENT_META,
  evaluateCourseFit,
  fitReportText,
  type FitInput,
  type RoleKey,
  type ExperienceKey,
  type ReadinessKey,
  type CommitmentKey,
  type FitResult,
} from "@/lib/course-fit";

/* ============================================
   課程適配度自評（Course Fit Assessment）
   三步驟：介紹 → 作答 → 結果
   2026-09-29 小賀開發（第三批 B3-1 微型工具）

   服務對象：Agentic AI for HR 初階班（2026-11-14）與進階班（2026-12-05）
   目的：讓報名前自評「你的組織準備好上這堂課了嗎」，依結果推薦班級 + 預習清單。
   ============================================ */

type Step = "intro" | "quiz" | "result";

const ROLES: RoleKey[] = ["hr", "owner", "consultant", "it", "other"];
const EXPERIENCES: ExperienceKey[] = ["none", "tool_user", "agent_builder", "team_runner"];
const READINESS: ReadinessKey[] = ["no", "partial", "yes"];
const COMMITMENTS: CommitmentKey[] = ["half", "full", "two_days"];

const READY_QUESTIONS: { key: keyof FitInput; label: string; options: ReadinessKey[] }[] = [
  { key: "hasTask", label: "你是否已經有一個明確、想交給 AI 員工處理的任務？", options: READINESS },
  { key: "hasData", label: "這個任務需要的資料或範例，你是否可以取得？", options: READINESS },
  { key: "hasSupport", label: "主管或組織是否支持你課後把產出帶回公司試點？", options: READINESS },
];

export default function CourseFitPage() {
  const [step, setStep] = useState<Step>("intro");
  const [input, setInput] = useState<FitInput>({
    role: "hr",
    experience: "tool_user",
    hasTask: "partial",
    hasData: "partial",
    hasSupport: "partial",
    commitment: "full",
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [leadSent, setLeadSent] = useState(false);

  const result: FitResult | null = useMemo(
    () => (step === "result" ? evaluateCourseFit(input) : null),
    [step, input]
  );

  const setField = useCallback(<K extends keyof FitInput>(key: K, value: FitInput[K]) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    // 先計算結果，用於留資 message，避免 setStep 後 result 尚未重算時 message 為 null
    const computed = evaluateCourseFit(input);
    setStep("result");

    if (email && !leadSent) {
      try {
        const res = await fetch("/api/newsletter/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(10000),
          body: JSON.stringify({
            name: name || "課程適配度自評訪客",
            email,
            company: company || "未填寫",
            industry: "其他／綜合",
            ai_stage: input.experience === "none" ? "not_started" : "exploring",
            challenges: ["課程選擇"],
            message: `來自課程適配度自評（建議 ${computed.match.title}）`,
            source: "course-fit",
            subscribed_at: new Date().toISOString(),
          }),
        });
        if (res.ok) setLeadSent(true);
      } catch {
        // silent: 留資失敗不阻擋結果
      }
    }
    setSubmitting(false);
  }, [email, leadSent, name, company, input]);

  const copyReport = useCallback(async () => {
    if (!result) return;
    const text = fitReportText(input, result);
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
        // ignore
      }
      document.body.removeChild(ta);
    }
    setTimeout(() => setCopied(false), 2500);
  }, [input, result]);

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-[#0D2B4E] via-[#0D2B4E] to-[#0A1F3A] text-white">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        {/* ===== STEP 1: INTRO ===== */}
        {step === "intro" && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#1A6DB5]/20 border border-[#2EC4B6]/30 rounded-full px-4 py-1.5 mb-6">
              <span className="text-sm text-[#2EC4B6] font-semibold">Agentic AI for HR · 課程適配度自評</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6">
              哪一班適合你？
              <br />
              <span className="text-[#E8912A]">五分鐘</span>測出來
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              我們開了兩班課：初階班（11/14）帶你完成第一個 AI 員工；進階班（12/5）帶你設計多 AI 員工協作流程。
              回答六個問題，立即知道哪一班對你現階段最有價值，以及上課前要補什麼。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
              {[
                { icon: "📋", label: "六道題目" },
                { icon: "🎯", label: "班級推薦" },
                { icon: "📚", label: "預習清單" },
              ].map((f) => (
                <div key={f.label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="text-2xl mb-1">{f.icon}</div>
                  <div className="text-sm text-white/70">{f.label}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep("quiz")}
              className="bg-[#E8912A] hover:bg-[#F5A623] text-white font-bold px-10 py-4 rounded-full text-lg transition-colors shadow-lg"
            >
              開始自評 →
            </button>
            <p className="text-white/40 text-xs mt-4">約 5 分鐘 · 不需留資即可看結果</p>
          </div>
        )}

        {/* ===== STEP 2: QUIZ ===== */}
        {step === "quiz" && (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setStep("intro")}
              className="text-sm text-white/60 hover:text-white mb-6 transition-colors"
            >
              ← 返回介紹
            </button>
            <h2 className="text-2xl md:text-3xl font-black mb-2">六個問題，找到適合你的班級</h2>
            <p className="text-white/50 text-sm mb-8">誠實回答就好，系統會根據你的經驗與組織準備度給建議。</p>

            {/* 角色 */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-[#2EC4B6] mb-3">1. 你的角色？</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {ROLES.map((key) => (
                  <button
                    key={key}
                    onClick={() => setField("role", key)}
                    className={`text-sm px-4 py-3 rounded-lg border transition-all text-left ${
                      input.role === key
                        ? "bg-[#1A6DB5]/30 border-[#2EC4B6] text-white font-semibold"
                        : "bg-white/5 border-white/10 text-white/70 hover:border-[#1A6DB5]"
                    }`}
                  >
                    {ROLE_META[key].label}
                  </button>
                ))}
              </div>
            </div>

            {/* 經驗 */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-[#2EC4B6] mb-3">2. 你目前的 AI 使用經驗？</label>
              <div className="space-y-2">
                {EXPERIENCES.map((key) => (
                  <button
                    key={key}
                    onClick={() => setField("experience", key)}
                    className={`w-full text-sm px-4 py-3 rounded-lg border transition-all text-left ${
                      input.experience === key
                        ? "bg-[#1A6DB5]/30 border-[#2EC4B6] text-white font-semibold"
                        : "bg-white/5 border-white/10 text-white/70 hover:border-[#1A6DB5]"
                    }`}
                  >
                    {EXPERIENCE_META[key].label}
                  </button>
                ))}
              </div>
            </div>

            {/* 準備度三題 */}
            {READY_QUESTIONS.map((q) => (
              <div key={q.key} className="mb-8">
                <label className="block text-sm font-semibold text-[#2EC4B6] mb-3">{q.label}</label>
                <div className="grid grid-cols-3 gap-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setField(q.key, opt)}
                      className={`text-sm px-3 py-3 rounded-lg border transition-all ${
                        input[q.key] === opt
                          ? "bg-[#1A6DB5]/30 border-[#2EC4B6] text-white font-semibold"
                          : "bg-white/5 border-white/10 text-white/70 hover:border-[#1A6DB5]"
                      }`}
                    >
                      {READINESS_META[opt].label}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* 可投入時間 */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-[#2EC4B6] mb-3">6. 你可以投入的時間？</label>
              <div className="space-y-2">
                {COMMITMENTS.map((key) => (
                  <button
                    key={key}
                    onClick={() => setField("commitment", key)}
                    className={`w-full text-sm px-4 py-3 rounded-lg border transition-all text-left ${
                      input.commitment === key
                        ? "bg-[#1A6DB5]/30 border-[#2EC4B6] text-white font-semibold"
                        : "bg-white/5 border-white/10 text-white/70 hover:border-[#1A6DB5]"
                    }`}
                  >
                    {COMMITMENT_META[key].label}
                  </button>
                ))}
              </div>
            </div>

            {/* 留資 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
              <h3 className="font-bold mb-1">📬 收到完整評估與預習清單（選填）</h3>
              <p className="text-white/40 text-xs mb-4">留下 Email，我們會把評估結果與建議預習資源寄給你。</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="姓名"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#2EC4B6]"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#2EC4B6]"
                />
                <input
                  type="text"
                  placeholder="公司（選填）"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#2EC4B6]"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-[#E8912A] hover:bg-[#F5A623] disabled:opacity-50 text-white font-bold text-lg px-8 py-4 rounded-full transition-colors shadow-lg"
            >
              {submitting ? "計算中…" : "看推薦結果 →"}
            </button>
          </div>
        )}

        {/* ===== STEP 3: RESULT ===== */}
        {step === "result" && result && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-[#1A6DB5]/20 border border-[#2EC4B6]/30 rounded-full px-4 py-1.5 mb-6">
                <span className="text-sm text-[#2EC4B6] font-semibold">課程適配度評估完成</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black mb-4">
                建議你上：
                <br className="md:hidden" />
                <span className="text-[#E8912A]">{result.match.title}</span>
              </h1>
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-4xl font-black text-[#2EC4B6]">{result.readinessScore}</span>
                <span className="text-white/50 text-lg">/ 100</span>
              </div>
              <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">{result.summary}</p>
            </div>

            {/* 推薦理由 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-8">
              <h2 className="text-lg font-bold mb-3">為什麼這樣建議？</h2>
              <p className="text-white/80 text-sm leading-relaxed mb-5">{result.match.reason}</p>
              <h3 className="text-sm font-bold text-[#2EC4B6] mb-3">這堂課你會帶走什麼</h3>
              <ul className="space-y-2">
                {result.match.previewList.map((p, i) => (
                  <li key={i} className="text-white/75 text-sm leading-relaxed flex gap-2">
                    <span className="text-[#E8912A] shrink-0">{i + 1}.</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 分項分數 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-8">
              <h2 className="text-lg font-bold mb-5">你的準備度分佈</h2>
              <div className="space-y-4">
                {result.breakdown.map((b) => {
                  const pct = Math.round((b.score / b.max) * 100);
                  return (
                    <div key={b.label}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-white/80">{b.label}</span>
                        <span className="text-white/50 text-xs">{b.score}/{b.max}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#2EC4B6] rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-white/50 w-10 text-right">{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 預習清單 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-8">
              <h2 className="text-lg font-bold mb-4">課前預習 / 準備清單</h2>
              <ul className="space-y-3">
                {result.prep.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                    <span className={`shrink-0 mt-0.5 ${p.done ? "text-[#2EC4B6]" : "text-white/30"}`}>
                      {p.done ? "✓" : "□"}
                    </span>
                    <span className={p.done ? "line-through text-white/40" : ""}>{p.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="text-center space-y-4 mb-8">
              {result.match.level === "not_ready" ? (
                <>
                  <p className="text-white/60 text-sm">
                    還沒準備好也沒關係。先預約一對一諮詢，我們協助你判斷最適合的時間點。
                  </p>
                  <a
                    href={result.cta.primary}
                    className="inline-block bg-[#E8912A] hover:bg-[#F5A623] text-white font-bold px-8 py-3.5 rounded-full transition-colors"
                  >
                    預約免費諮詢 →
                  </a>
                </>
              ) : (
                <>
                  <p className="text-white/60 text-sm">
                    建議先查看課程詳情與報名資訊。如果還不確定，也可以預約諮詢討論。
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={result.cta.primary}
                      className="inline-block bg-[#E8912A] hover:bg-[#F5A623] text-white font-bold px-8 py-3.5 rounded-full transition-colors"
                    >
                      查看課程詳情 →
                    </a>
                    {result.cta.secondary && (
                      <a
                        href={result.cta.secondary}
                        className="inline-block bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-full transition-colors"
                      >
                        也看看另一班
                      </a>
                    )}
                    <a
                      href="/about/#contact"
                      className="inline-block text-[#2EC4B6] hover:text-[#7FE3D8] font-semibold px-4 py-3 transition-colors"
                    >
                      預約諮詢 →
                    </a>
                  </div>
                </>
              )}
            </div>

            {/* 複製報告 */}
            <div className="flex items-center justify-center gap-3 mb-10">
              <button
                onClick={copyReport}
                className={`inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-full border transition-colors ${
                  copied
                    ? "bg-[#2EC4B6]/20 border-[#2EC4B6] text-[#2EC4B6]"
                    : "bg-[#1A6DB5]/20 border-[#2EC4B6]/50 text-[#2EC4B6] hover:bg-[#1A6DB5]/40"
                }`}
              >
                {copied ? "✓ 已複製報告" : "📋 複製完整報告"}
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => {
                  setStep("quiz");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-white/60 hover:text-white text-sm font-semibold transition-colors"
              >
                ← 重新填寫
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
