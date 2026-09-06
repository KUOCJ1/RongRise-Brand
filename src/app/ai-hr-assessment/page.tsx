"use client";

import { useState, useCallback } from "react";
import {
  getAllScenarios,
  evaluate,
  type ScenarioKey,
  type Scenario,
  type AssessmentResult,
} from "@/lib/hr-ai-maturity";

/* ============================================
   HR AI 化成熟度評估（HR AI Maturity Assessment）
   三步驟：介紹 → 作答 → 結果
   2026-09-05 小賀開發（B2-2 微型工具）
   方法論：CJ哥 20 年人資 × McKinsey Agent 績效管理
   × HR 五層 AI 轉型責任框架
   漏斗定位：ai-hr-assessment → ai-roadmap → 預約諮詢
   ============================================ */

type Step = "intro" | "quiz" | "result";

const SCENARIOS = getAllScenarios();
const SCENARIO_KEYS: ScenarioKey[] = ["recruit", "performance", "training", "service", "analytics"];

export default function HrAiMaturityPage() {
  const [step, setStep] = useState<Step>("intro");
  const [currentScenarioIdx, setCurrentScenarioIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [copied, setCopied] = useState(false);

  const currentScenario = SCENARIOS[currentScenarioIdx];
  const isLastScenario = currentScenarioIdx === SCENARIOS.length - 1;

  // Check if all questions in current scenario are answered
  const currentScenarioAnswered = currentScenario
    ? currentScenario.questions.every((q) => answers[q.id] !== undefined)
    : false;

  // Check if all questions in all scenarios are answered
  const allAnswered = SCENARIOS.every((s) => s.questions.every((q) => answers[q.id] !== undefined));

  const setAnswer = useCallback((qId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  }, []);

  const goToNextScenario = useCallback(() => {
    if (currentScenarioIdx < SCENARIOS.length - 1) {
      setCurrentScenarioIdx((i) => i + 1);
    }
  }, [currentScenarioIdx]);

  const goToPrevScenario = useCallback(() => {
    if (currentScenarioIdx > 0) {
      setCurrentScenarioIdx((i) => i - 1);
    }
  }, [currentScenarioIdx]);

  const handleSubmit = useCallback(async () => {
    if (!allAnswered) return;
    setSubmitting(true);

    // Build scores per scenario
    const scores: Record<ScenarioKey, number[]> = {
      recruit: [],
      performance: [],
      training: [],
      service: [],
      analytics: [],
    };
    for (const s of SCENARIOS) {
      for (const q of s.questions) {
        scores[s.key].push(answers[q.id]);
      }
    }

    const r = evaluate(scores);
    setResult(r);

    // Lead capture (optional)
    if (email) {
      try {
        await fetch("/api/newsletter/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(10000),
          body: JSON.stringify({
            name: name || "HR 量表訪客",
            email,
            company: company || "未填寫",
            industry: "其他／綜合",
            ai_stage: "not_started",
            challenges: ["HR 轉型"],
            source: "ai-hr-assessment",
            subscribed_at: new Date().toISOString(),
          }),
        });
      } catch {
        // silent
      }
    }

    setSubmitting(false);
    setStep("result");
  }, [allAnswered, answers, email, name, company]);

  /* ===== SVG Radar Chart ===== */
  const RadarChart = ({ result }: { result: AssessmentResult }) => {
    const cx = 150, cy = 150, r = 110;
    const angles = [0, 72, 144, 216, 288].map((d) => (d - 90) * Math.PI / 180);
    const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

    const scores = SCENARIO_KEYS.map((k) => {
      const s = result.scenarios.find((s) => s.key === k);
      return s ? s.score / 5 : 0;
    });

    const points = scores.map((s, i) => ({
      x: cx + r * s * Math.cos(angles[i]),
      y: cy + r * s * Math.sin(angles[i]),
    }));
    const polyPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

    const labelRadius = r + 20;
    const labels = ["招募甄選", "績效管理", "培訓發展", "員工服務", "數據決策"];

    return (
      <svg viewBox="0 0 300 300" className="w-full max-w-xs mx-auto" style={{ height: 300 }}>
        {/* Grid */}
        {levels.map((level) => {
          const pts = angles
            .map((a) => ({ x: cx + r * level * Math.cos(a), y: cy + r * level * Math.sin(a) }))
            .map((p) => `${p.x},${p.y}`)
            .join(" ");
          return <polygon key={level} points={pts} fill="none" stroke="#E2E8F0" strokeWidth="1" />;
        })}
        {/* Axes */}
        {angles.map((a, i) => (
          <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)} stroke="#E2E8F0" strokeWidth="1" />
        ))}
        {/* Data */}
        <polygon points={polyPoints} fill="rgba(26, 109, 181, 0.2)" stroke="#1A6DB5" strokeWidth="2" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#1A6DB5" />
        ))}
        {/* Labels */}
        {labels.map((label, i) => (
          <text
            key={i}
            x={cx + labelRadius * Math.cos(angles[i])}
            y={cy + labelRadius * Math.sin(angles[i])}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[10px] fill-gray-600 font-medium"
          >
            {label}
          </text>
        ))}
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-[#0D2B4E]">
          {result.overallScore.toFixed(1)}
        </text>
      </svg>
    );
  };

  /* ===== Result Level Badge ===== */
  const LevelBadge = ({ level }: { level: string }) => {
    const colors: Record<string, string> = {
      "起步期（1.0-1.4）": "bg-red-100 text-red-700",
      "發展期（1.5-2.4）": "bg-orange-100 text-orange-700",
      "穩定期（2.5-3.4）": "bg-yellow-100 text-yellow-700",
      "領先期（3.5-4.4）": "bg-green-100 text-green-700",
      "標竿期（4.5-5.0）": "bg-blue-100 text-blue-700",
    };
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${colors[level] || "bg-gray-100 text-gray-700"}`}>
        {level}
      </span>
    );
  };

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-[#0D2B4E] via-[#0D2B4E] to-[#0A1F3A] text-white">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">

        {/* ===== STEP 1: INTRO ===== */}
        {step === "intro" && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#1A6DB5]/20 border border-[#2EC4B6]/30 rounded-full px-4 py-1.5 mb-6">
              <span className="text-sm text-[#2EC4B6] font-semibold">C.J. Kuo × 20 年人資管理實戰</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6">
              你的 HR 部門<br />
              <span className="text-[#2EC4B6]">AI 化成熟度</span>在哪裡？
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              McKinsey 說 2026 年 HR 的角色正在從人事管家變成混合勞動力總監。
              你的 HR 部門準備好了嗎？五大場景 × 20+ 題，<strong className="text-white">5 分鐘</strong>找出你的 AI 化缺口與優先行動。
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-2xl mx-auto mb-10">
              {SCENARIOS.map((s) => (
                <div key={s.key} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-sm font-semibold text-white/80">{s.label}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep("quiz")}
              className="bg-[#E8912A] hover:bg-[#F5A623] text-white font-bold px-10 py-4 rounded-full text-lg transition-colors shadow-lg"
            >
              開始評估 →
            </button>
            <p className="text-white/40 text-xs mt-4">約 5 分鐘 · 不需留資即可看結果</p>
          </div>
        )}

        {/* ===== STEP 2: QUIZ ===== */}
        {step === "quiz" && currentScenario && (
          <div className="max-w-2xl mx-auto">
            {/* Progress bar */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2EC4B6] rounded-full transition-all"
                  style={{ width: `${((currentScenarioIdx + 1) / SCENARIOS.length) * 100}%` }}
                />
              </div>
              <span className="text-white/50 text-sm">
                {currentScenarioIdx + 1} / {SCENARIOS.length}
              </span>
            </div>

            {/* Scenario header */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{currentScenario.icon}</span>
              <h2 className="text-2xl font-bold">{currentScenario.label}</h2>
            </div>
            <p className="text-white/50 text-sm mb-8">{currentScenario.description}</p>

            {/* Questions */}
            <div className="space-y-6">
              {currentScenario.questions.map((q, qi) => (
                <div key={q.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <p className="text-white font-semibold mb-4">
                    <span className="text-[#2EC4B6] font-bold">{qi + 1}.</span> {q.text}
                  </p>
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
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={currentScenarioIdx > 0 ? goToPrevScenario : () => setStep("intro")}
                className="text-white/60 hover:text-white transition-colors"
              >
                ← {currentScenarioIdx > 0 ? "上一區" : "返回介紹"}
              </button>

              {isLastScenario ? (
                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered || submitting}
                  className="bg-[#E8912A] hover:bg-[#F5A623] disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-full transition-colors"
                >
                  {submitting ? "計算中..." : "看結果"}
                </button>
              ) : (
                <button
                  onClick={goToNextScenario}
                  disabled={!currentScenarioAnswered}
                  className="bg-[#1A6DB5] hover:bg-[#1A6DB5]/80 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-full transition-colors"
                >
                  下一區 →
                </button>
              )}
            </div>
          </div>
        )}

        {/* ===== STEP 3: RESULT ===== */}
        {step === "result" && result && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-[#1A6DB5]/20 border border-[#2EC4B6]/30 rounded-full px-4 py-1.5 mb-6">
                <span className="text-sm text-[#2EC4B6] font-semibold">評估完成</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black mb-4">你的 HR AI 化成熟度結果</h1>
              <div className="flex items-center justify-center gap-3">
                <span className="text-5xl font-black text-[#E8912A]">{result.overallScore.toFixed(1)}</span>
                <span className="text-white/50 text-lg">/ 5.0</span>
                <LevelBadge level={result.overallLevel} />
              </div>
            </div>

            {/* Radar Chart */}
            <div className="bg-white rounded-2xl p-6 mb-8">
              <RadarChart result={result} />
            </div>

            {/* Per-scenario scores */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-8">
              {result.scenarios.map((s) => (
                <div key={s.key} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div className="text-xs text-white/40 mb-1">{s.label}</div>
                  <div className="text-2xl font-bold text-white">{s.score.toFixed(1)}</div>
                  <div className="text-[10px] text-white/40 mt-1">{s.pct}%</div>
                </div>
              ))}
            </div>

            {/* Strengths & Gaps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-5">
                <h3 className="text-green-400 font-bold mb-3">✅ 強項</h3>
                {result.strengths.map((s, i) => (
                  <p key={i} className="text-white/80 text-sm mb-2">{s}</p>
                ))}
              </div>
              <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-5">
                <h3 className="text-red-400 font-bold mb-3">⚠️ 缺口</h3>
                {result.gaps.map((g, i) => (
                  <p key={i} className="text-white/80 text-sm mb-2">{g}</p>
                ))}
              </div>
            </div>

            {/* Priority Recommendations */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
              <h3 className="text-white font-bold text-lg mb-4">🎯 優先行動建議</h3>
              <div className="space-y-4">
                {result.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      rec.priority === "high" ? "bg-red-500 text-white" :
                      rec.priority === "medium" ? "bg-yellow-500 text-white" :
                      "bg-blue-500 text-white"
                    }`}>
                      {rec.priority === "high" ? "H" : rec.priority === "medium" ? "M" : "L"}
                    </span>
                    <div>
                      <div className="text-white/60 text-xs mb-0.5">{rec.scenario}</div>
                      <div className="text-white/90 text-sm">{rec.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lead capture */}
            <div className="bg-white/5 border border-[#E8912A]/30 rounded-xl p-6 mb-8">
              <h3 className="text-white font-bold text-lg mb-2">📩 收到完整報告</h3>
              <p className="text-white/50 text-sm mb-4">填寫 Email，我們將完整評估與建議寄給你（選填）</p>
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  placeholder="姓名"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm"
                />
                <input
                  type="text"
                  placeholder="公司（選填）"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm"
                />
              </div>
            </div>

            {/* CTA */}
            <div className="text-center space-y-4">
              <p className="text-white/60 text-sm">{result.nextStep}</p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/ai-roadmap" className="bg-[#1A6DB5] hover:bg-[#1A6DB5]/80 text-white font-bold px-8 py-3.5 rounded-full transition-colors">
                  🗺️ 規劃 AI 轉型路線圖
                </a>
                <a href="/about/#contact" className="bg-[#E8912A] hover:bg-[#F5A623] text-white font-bold px-8 py-3.5 rounded-full transition-colors">
                  📧 預約免費諮詢
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-white/20 text-xs">
            此評估基於 CJ 哥 20 年人資管理經驗與 McKinsey 2026 年 HR 研究，僅供參考。
            實際導入建議需結合企業具體情境與專業顧問診斷。
          </p>
        </div>
      </div>
    </div>
  );
}