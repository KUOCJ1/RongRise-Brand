"use client";

import { useState, useCallback } from "react";
import {
  getAllStages,
  evaluate,
  getStageKeyList,
  type StageKey,
  type StageResult,
  type DiagnosisResult,
} from "@/lib/ai-employee-diagnosis";

/* ============================================
   Agentic AI 員工管理學五階自評
   三步驟：介紹 → 作答 → 結果
   2026-10-27 小賀開發（B4-1 微型工具）
   方法論：榕耀管顧原創「Agentic AI 員工管理學」
   五階生命週期：招募 → 入職 → 考核 → 治理 → 成長
   漏斗定位：ai-employee-diagnosis → ai-roadmap / course-fit → 預約諮詢
   ============================================ */

type Step = "intro" | "quiz" | "result";
type LeadStatus = "idle" | "loading" | "success" | "error";

const STAGES = getAllStages();
const STAGE_KEYS: StageKey[] = getStageKeyList();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ===== Sub-components ===== */

function RadarChart({ result }: { result: DiagnosisResult }) {
  const cx = 150, cy = 150, r = 110;
  const angles = [0, 72, 144, 216, 288].map((d) => (d - 90) * Math.PI / 180);
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const scores = STAGE_KEYS.map((k) => {
    const s = result.stages.find((d) => d.key === k);
    return s ? s.score / 5 : 0;
  });

  const points = scores.map((s, i) => ({
    x: cx + r * s * Math.cos(angles[i]),
    y: cy + r * s * Math.sin(angles[i]),
  }));
  const polyPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  const labelRadius = r + 22;
  const labels = STAGES.map((s) => s.label);

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-xs mx-auto" style={{ height: 300 }} role="img" aria-label="AI 員工管理學五階雷達圖">
      {levels.map((level) => {
        const pts = angles
          .map((a) => ({ x: cx + r * level * Math.cos(a), y: cy + r * level * Math.sin(a) }))
          .map((p) => `${p.x},${p.y}`)
          .join(" ");
        return <polygon key={level} points={pts} fill="none" stroke="#1E3A5F" strokeWidth="1" />;
      })}
      {angles.map((a, i) => (
        <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)} stroke="#1E3A5F" strokeWidth="1" />
      ))}
      <polygon points={polyPoints} fill="rgba(46, 196, 182, 0.25)" stroke="#2EC4B6" strokeWidth="2" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#2EC4B6" />
      ))}
      {labels.map((label, i) => (
        <text
          key={i}
          x={cx + labelRadius * Math.cos(angles[i])}
          y={cy + labelRadius * Math.sin(angles[i])}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-[12px] fill-[#A0C4E8] font-semibold"
        >
          {label}
        </text>
      ))}
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-white">
        {result.overallScore.toFixed(1)}
      </text>
    </svg>
  );
}

function LevelBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    "起步期": "bg-red-500/20 text-red-300",
    "形成期": "bg-orange-500/20 text-orange-300",
    "發展期": "bg-yellow-500/20 text-yellow-300",
    "成熟期": "bg-green-500/20 text-green-300",
    "標竿期": "bg-blue-500/20 text-blue-300",
  };
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${colors[level] || "bg-white/10 text-white"}`}>
      {level}
    </span>
  );
}

function StatusBadge({ status }: { status: StageResult["status"] }) {
  const colors: Record<string, string> = {
    "紅燈": "bg-red-500/20 text-red-300 border-red-500/30",
    "黃燈": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    "綠燈": "bg-green-500/20 text-green-300 border-green-500/30",
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${colors[status] || ""}`}>
      {status}
    </span>
  );
}

export default function AIEmployeeDiagnosisPage() {
  const [step, setStep] = useState<Step>("intro");
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [leadStatus, setLeadStatus] = useState<LeadStatus>("idle");
  const [leadError, setLeadError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [copied, setCopied] = useState(false);

  const currentStage = STAGES[currentStageIdx];
  const isLastStage = currentStageIdx === STAGES.length - 1;

  const currentStageAnswered = currentStage
    ? currentStage.questions.every((q) => answers[q.id] !== undefined)
    : false;

  const allAnswered = STAGES.every((s) => s.questions.every((q) => answers[q.id] !== undefined));

  const setAnswer = useCallback((qId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  }, []);

  const goToNextStage = useCallback(() => {
    if (currentStageIdx < STAGES.length - 1) {
      setCurrentStageIdx((i) => i + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStageIdx]);

  const goToPrevStage = useCallback(() => {
    if (currentStageIdx > 0) {
      setCurrentStageIdx((i) => i - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStageIdx]);

  const computeResult = useCallback(() => {
    const scores: Record<StageKey, number[]> = {
      recruit: [],
      onboard: [],
      appraise: [],
      govern: [],
      grow: [],
    };
    for (const s of STAGES) {
      for (const q of s.questions) {
        scores[s.key].push(answers[q.id]);
      }
    }
    return evaluate(scores);
  }, [answers]);

  const showResult = useCallback(() => {
    if (!allAnswered) return;
    setResult(computeResult());
    setStep("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [allAnswered, computeResult]);

  const emailIsValid = EMAIL_RE.test(email.trim());

  const submitLead = useCallback(async () => {
    if (!emailIsValid) return;
    setLeadStatus("loading");
    setLeadError(null);
    setSuccessMessage(null);

    let timer: ReturnType<typeof setTimeout> | null = null;
    try {
      const controller = new AbortController();
      timer = setTimeout(() => controller.abort(), 10000);

      // 2026-10-27 備註：正式站的 /api/newsletter/subscribe 由 VPS 的 Node API 提供，
      // 只存 email、name、source。不要收公司名稱或診斷摘要（後端不存）。
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          name: name.trim() || "五階自評訪客",
          email: email.trim(),
          source: "ai-employee-diagnosis",
        }),
      });
      if (timer) clearTimeout(timer);

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setLeadStatus("error");
        setLeadError(data.userMessage || "送出失敗，請確認 Email 格式後再試");
        return;
      }

      setLeadStatus("success");
      setSuccessMessage(data.message || null);
    } catch (err) {
      if (timer) clearTimeout(timer);
      setLeadStatus("error");
      setLeadError(err instanceof Error && err.name === "AbortError"
        ? "連線超時，請檢查網路後再試"
        : "送出時發生錯誤，請稍後再試"
      );
    }
  }, [emailIsValid, name, email]);

  const copyReport = async () => {
    if (!result) return;
    const lines: string[] = [];
    lines.push("【Agentic AI 員工管理學五階自評結果】");
    lines.push(`整體成熟度：${result.overallScore.toFixed(1)} 分（${result.overallLevel}）`);
    lines.push("");
    lines.push("五階評分：");
    for (const s of result.stages) {
      lines.push(`• ${s.icon} ${s.label}：${s.score.toFixed(1)} 分（${s.level}／${s.status}）`);
    }
    lines.push("");
    lines.push(`風險階段：${result.risks.length > 0 ? result.risks.map((r) => r.stage).join("、") : "無，五階全綠"}`);
    lines.push("");
    lines.push("優先行動：");
    for (const rec of result.recommendations) {
      lines.push(`• ${rec.stage}（${rec.priority === "high" ? "高優先" : rec.priority === "medium" ? "中優先" : "持續優化"}）：${rec.text}`);
    }
    const text = lines.join("\n");
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
      try { document.execCommand("copy"); setCopied(true); } catch {}
      document.body.removeChild(ta);
    }
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-[#0D2B4E] via-[#0D2B4E] to-[#0A1F3A] text-white">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">

        {/* ===== STEP 1: INTRO ===== */}
        {step === "intro" && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#1A6DB5]/20 border border-[#2EC4B6]/30 rounded-full px-4 py-1.5 mb-6">
              <span className="text-sm text-[#2EC4B6] font-semibold">榕耀管顧原創·Agentic AI 員工管理學</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6">
              你的 AI，<br />
              <span className="text-[#2EC4B6]">是被管理的員工嗎？</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              導入 AI 的瓶頸不是技術，是管理。
              招募、入職、考核、治理、成長——
              <strong className="text-white">五階生命週期 × 15 題</strong>，
              5 分鐘診斷你的 AI 員工管理走到哪裡。
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-3xl mx-auto mb-10">
              {STAGES.map((s) => (
                <div key={s.key} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-sm font-semibold text-white/80">{s.label}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => { setStep("quiz"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="bg-[#E8912A] hover:bg-[#F5A623] text-white font-bold px-10 py-4 rounded-full text-lg transition-colors shadow-lg"
            >
              開始自評 →
            </button>
            <p className="text-white/40 text-xs mt-4">約 5 分鐘 · 不需留資即可看結果</p>
          </div>
        )}

        {/* ===== STEP 2: QUIZ ===== */}
        {step === "quiz" && currentStage && (
          <div className="max-w-2xl mx-auto">
            {/* Progress bar */}
            <div className="flex items-center gap-3 mb-8">
              <div
                className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden"
                role="progressbar"
                aria-label="作答進度"
                aria-valuemin={1}
                aria-valuemax={STAGES.length}
                aria-valuenow={currentStageIdx + 1}
              >
                <div
                  className="h-full bg-[#2EC4B6] rounded-full transition-all"
                  style={{ width: `${((currentStageIdx + 1) / STAGES.length) * 100}%` }}
                />
              </div>
              <span className="text-white/50 text-sm">
                {currentStageIdx + 1} / {STAGES.length}
              </span>
            </div>

            {/* Stage header */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{currentStage.icon}</span>
              <h2 className="text-2xl font-bold">{currentStage.label}階段</h2>
            </div>
            <p className="text-white/50 text-sm mb-8">{currentStage.description}</p>

            {/* Questions */}
            <div className="space-y-6">
              {currentStage.questions.map((q, qi) => (
                <fieldset key={q.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <legend className="text-white font-semibold mb-4">
                    <span className="text-[#2EC4B6] font-bold">{qi + 1}.</span> {q.text}
                  </legend>
                  <div className="space-y-2">
                    {q.options.map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          answers[q.id] === opt.value
                            ? "bg-[#1A6DB5]/30 border border-[#1A6DB5]/50"
                            : "bg-white/5 border border-white/5 hover:bg-white/10"
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={opt.value}
                          checked={answers[q.id] === opt.value}
                          onChange={() => setAnswer(q.id, opt.value)}
                          className="accent-[#E8912A]"
                        />
                        <span className="text-white/80 text-sm">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={goToPrevStage}
                disabled={currentStageIdx === 0}
                className="px-6 py-3 rounded-full font-semibold text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← 上一階段
              </button>
              {isLastStage ? (
                <button
                  onClick={showResult}
                  disabled={!allAnswered}
                  className="bg-[#E8912A] hover:bg-[#F5A623] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-full transition-colors shadow-lg"
                >
                  看結果 →
                </button>
              ) : (
                <button
                  onClick={goToNextStage}
                  disabled={!currentStageAnswered}
                  className="bg-[#1A6DB5] hover:bg-[#2680CC] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-full transition-colors"
                >
                  下一階段 →
                </button>
              )}
            </div>
          </div>
        )}

        {/* ===== STEP 3: RESULT ===== */}
        {step === "result" && result && (
          <div className="max-w-3xl mx-auto">
            {/* Headline */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-[#1A6DB5]/20 border border-[#2EC4B6]/30 rounded-full px-4 py-1.5 mb-6">
                <span className="text-sm text-[#2EC4B6] font-semibold">Agentic AI 員工管理學五階自評結果</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black mb-4">
                整體成熟度 <span className="text-[#2EC4B6]">{result.overallScore.toFixed(1)}</span> 分
              </h1>
              <div className="flex items-center justify-center gap-3">
                <LevelBadge level={result.overallLevel} />
                <span className="text-white/50 text-sm">
                  {result.redCount} 紅燈 · {result.yellowCount} 黃燈 · {result.greenCount} 綠燈
                </span>
              </div>
              <p className="text-white/70 max-w-2xl mx-auto mt-6 leading-relaxed">{result.summary}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center mb-10 bg-white/5 border border-white/10 rounded-2xl p-8">
              <RadarChart result={result} />
              <div className="space-y-3">
                {result.stages.map((s) => (
                  <div key={s.key} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg">{s.icon}</span>
                      <span className="text-white/80 font-medium whitespace-nowrap">{s.label}</span>
                    </div>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden ml-2">
                      <div
                        className={`h-full rounded-full ${
                          s.status === "紅燈" ? "bg-red-400" : s.status === "黃燈" ? "bg-yellow-400" : "bg-[#2EC4B6]"
                        }`}
                        style={{ width: `${s.pct}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-white font-bold">{s.score.toFixed(1)}</span>
                      <StatusBadge status={s.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk alert */}
            {result.hasRisk && result.risks.length > 0 && (
              <div className={`border rounded-2xl p-6 mb-10 ${
                result.risks.some((r) => r.status === "紅燈")
                  ? "bg-red-500/10 border-red-500/30"
                  : "bg-yellow-500/10 border-yellow-500/30"
              }`}>
                <h2 className={`text-lg font-bold mb-3 ${
                  result.risks.some((r) => r.status === "紅燈") ? "text-red-300" : "text-yellow-300"
                }`}>
                  {result.risks.some((r) => r.status === "紅燈") ? "🚨 風險警示" : "⚠️ 需關注階段"}
                </h2>
                <ul className="space-y-2">
                  {result.risks.map((r, idx) => (
                    <li key={r.stage} className="text-white/80 text-sm leading-relaxed">
                      <strong className="text-white">{r.stage}</strong>（{r.score.toFixed(1)} 分，{r.level}）
                      {idx === 0 && r.status === "紅燈"
                        ? "—— 是當前最需要補強的階段"
                        : idx === 0
                        ? "—— 最需要優先標準化"
                        : "—— 也需要關注"}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Strengths */}
            {result.strengths.length > 0 && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 mb-10">
                <h2 className="text-lg font-bold text-green-300 mb-3">✅ 管理強項</h2>
                <ul className="space-y-2">
                  {result.strengths.map((s) => (
                    <li key={s} className="text-white/80 text-sm leading-relaxed">{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
              <h2 className="text-lg font-bold mb-4">🎯 優先行動建議</h2>
              <div className="space-y-4">
                {result.recommendations.map((rec, i) => (
                  <div key={i} className="flex gap-3">
                    <span className={`shrink-0 text-xs font-bold px-2 py-1 rounded-full h-fit ${
                      rec.priority === "high" ? "bg-red-500/20 text-red-300" : rec.priority === "medium" ? "bg-yellow-500/20 text-yellow-300" : "bg-green-500/20 text-green-300"
                    }`}>
                      {rec.priority === "high" ? "高優先" : rec.priority === "medium" ? "中優先" : "持續優化"}
                    </span>
                    <div>
                      <p className="text-white/80 text-sm leading-relaxed">
                        <strong className="text-[#2EC4B6]">{rec.stage}：</strong>{rec.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-white/10">
                <button
                  onClick={copyReport}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-colors"
                  aria-pressed={copied}
                >
                  {copied ? "✓ 已複製" : "複製報告"}
                </button>
                <span className="text-white/40 text-xs">把結果貼給顧問，討論更聚焦</span>
              </div>
            </div>

            {/* Lead capture */}
            {leadStatus !== "success" ? (
              <div className="bg-gradient-to-br from-[#1A6DB5]/20 to-[#2EC4B6]/10 border border-[#2EC4B6]/30 rounded-2xl p-6 mb-8">
                <h2 className="text-lg font-bold mb-1">📬 訂閱榕賀觀點電子報</h2>
                <p className="text-white/60 text-sm mb-4 leading-relaxed">
                  每週兩封 AI 轉型觀察與實戰筆記。留下 Email 後，你會先收到一封確認信，點擊信中按鈕才算完成訂閱。
                </p>
                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="姓名（選填）"
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#2EC4B6]"
                    aria-label="姓名"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (leadError) setLeadError(null);
                    }}
                    placeholder="Email（必填）"
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#2EC4B6]"
                    aria-label="Email"
                    aria-invalid={email && !emailIsValid ? "true" : "false"}
                  />
                </div>
                {email && !emailIsValid && (
                  <p className="text-red-300 text-xs mb-3" role="alert">請輸入有效的 Email 格式</p>
                )}
                <button
                  onClick={submitLead}
                  disabled={!emailIsValid || leadStatus === "loading"}
                  className="bg-[#E8912A] hover:bg-[#F5A623] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-full transition-colors"
                >
                  {leadStatus === "loading" ? "送出中..." : "訂閱電子報 →"}
                </button>
                {leadStatus === "error" && leadError && (
                  <p className="text-red-300 text-sm mt-3" role="alert">{leadError}</p>
                )}
                <p className="text-white/30 text-xs mt-3">我們只寄有用的內容，隨時可退訂。不留 Email 也能看到完整結果。</p>
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8" role="status">
                <p className="text-white/60 text-sm leading-relaxed">
                  {successMessage || `確認信已寄到 ${email}，請點擊信中按鈕完成訂閱。沒收到請查看垃圾信件匣。`}
                </p>
                <p className="text-white/60 text-sm leading-relaxed mt-2">
                  若有問題，直接
                  <a href="/about/#contact" className="text-[#2EC4B6] hover:text-[#7FE3D8] font-semibold ml-1">
                    預約免費諮詢
                  </a>
                  比較快。
                </p>
              </div>
            )}

            {/* Funnel CTA */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <h2 className="text-xl font-bold mb-2">診斷完之後，下一步？</h2>
              <p className="text-white/60 text-sm mb-6 leading-relaxed">
                {result.nextStep}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="/ai-roadmap"
                  className="bg-[#1A6DB5] hover:bg-[#2680CC] text-white font-bold px-8 py-3 rounded-full transition-colors"
                >
                  生成 AI 轉型路線圖 →
                </a>
                <a
                  href="/course-fit"
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-full transition-colors"
                >
                  判斷該上哪堂課 →
                </a>
                <a
                  href="/about/#contact"
                  className="text-[#E8912A] hover:text-[#F5A623] font-semibold px-4 py-3 transition-colors"
                >
                  預約免費諮詢 →
                </a>
              </div>
              <p className="text-white/30 text-xs mt-5">
                本工具基於榕耀管顧「Agentic AI 員工管理學」框架，
                衡量的是企業對 AI 員工的管理成熟度，非單一工具或模型評估。
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
