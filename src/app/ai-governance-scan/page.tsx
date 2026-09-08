"use client";

import { useState, useCallback } from "react";
import {
  getAllDimensions,
  evaluate,
  getDimKeyList,
  type DimKey,
  type Dimension,
  type ScanResult,
} from "@/lib/ai-governance-scan";

/* ============================================
   AI 治理五檢查自評（AI Governance Five-Check Scan）
   三步驟：介紹 → 作答 → 結果
   2026-09-08 小賀開發（B2-3 微型工具）
   方法論：榕耀管顧原創「治理五檢查」框架
   （人、流程、資料、技術、文化）
   × CJ哥 31 agent 治理實戰 × McKinsey Agent 績效管理
   漏斗定位：ai-governance-scan → ai-roadmap → 預約諮詢
   與 pilot-trap-scan 互補：後者測點卡關，前者測治理體質
   ============================================ */

type Step = "intro" | "quiz" | "result";

const DIMENSIONS = getAllDimensions();
const DIM_KEYS: DimKey[] = getDimKeyList();

export default function AIGovernanceScanPage() {
  const [step, setStep] = useState<Step>("intro");
  const [currentDimIdx, setCurrentDimIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [copied, setCopied] = useState(false);

  const currentDim = DIMENSIONS[currentDimIdx];
  const isLastDim = currentDimIdx === DIMENSIONS.length - 1;

  // Check if all questions in current dimension are answered
  const currentDimAnswered = currentDim
    ? currentDim.questions.every((q) => answers[q.id] !== undefined)
    : false;

  // Check if all questions in all dimensions are answered
  const allAnswered = DIMENSIONS.every((d) => d.questions.every((q) => answers[q.id] !== undefined));

  const setAnswer = useCallback((qId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  }, []);

  const goToNextDim = useCallback(() => {
    if (currentDimIdx < DIMENSIONS.length - 1) {
      setCurrentDimIdx((i) => i + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentDimIdx]);

  const goToPrevDim = useCallback(() => {
    if (currentDimIdx > 0) {
      setCurrentDimIdx((i) => i - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentDimIdx]);

  const handleSubmit = useCallback(async () => {
    if (!allAnswered) return;
    setSubmitting(true);

    // Build scores per dimension
    const scores: Record<DimKey, number[]> = {
      people: [],
      process: [],
      data: [],
      tech: [],
      culture: [],
    };
    for (const d of DIMENSIONS) {
      for (const q of d.questions) {
        scores[d.key].push(answers[q.id]);
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
            name: name || "治理量表訪客",
            email,
            company: company || "未填寫",
            industry: "其他／綜合",
            ai_stage: "not_started",
            challenges: ["AI 治理"],
            source: "ai-governance-scan",
            subscribed_at: new Date().toISOString(),
          }),
        });
      } catch {
        // silent
      }
    }

    setSubmitting(false);
    setStep("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [allAnswered, answers, email, name, company]);

  /* ===== SVG Radar Chart ===== */
  const RadarChart = ({ result }: { result: ScanResult }) => {
    const cx = 150, cy = 150, r = 110;
    const angles = [0, 72, 144, 216, 288].map((d) => (d - 90) * Math.PI / 180);
    const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

    const scores = DIM_KEYS.map((k) => {
      const d = result.dimensions.find((d) => d.key === k);
      return d ? d.score / 5 : 0;
    });

    const points = scores.map((s, i) => ({
      x: cx + r * s * Math.cos(angles[i]),
      y: cy + r * s * Math.sin(angles[i]),
    }));
    const polyPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

    const labelRadius = r + 20;
    const labels = ["人", "流程", "資料", "技術", "文化"];

    return (
      <svg viewBox="0 0 300 300" className="w-full max-w-xs mx-auto" style={{ height: 300 }} role="img" aria-label="AI 治理五維度雷達圖">
        {/* Grid */}
        {levels.map((level) => {
          const pts = angles
            .map((a) => ({ x: cx + r * level * Math.cos(a), y: cy + r * level * Math.sin(a) }))
            .map((p) => `${p.x},${p.y}`)
            .join(" ");
          return <polygon key={level} points={pts} fill="none" stroke="#1E3A5F" strokeWidth="1" />;
        })}
        {/* Axes */}
        {angles.map((a, i) => (
          <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)} stroke="#1E3A5F" strokeWidth="1" />
        ))}
        {/* Data */}
        <polygon points={polyPoints} fill="rgba(46, 196, 182, 0.25)" stroke="#2EC4B6" strokeWidth="2" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#2EC4B6" />
        ))}
        {/* Labels */}
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
  };

  /* ===== Level Badge ===== */
  const LevelBadge = ({ level }: { level: string }) => {
    const colors: Record<string, string> = {
      起步期: "bg-red-500/20 text-red-300",
      形成期: "bg-orange-500/20 text-orange-300",
      發展期: "bg-yellow-500/20 text-yellow-300",
      成熟期: "bg-green-500/20 text-green-300",
      標竿期: "bg-blue-500/20 text-blue-300",
    };
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${colors[level] || "bg-white/10 text-white"}`}>
        {level}
      </span>
    );
  };

  const StatusBadge = ({ status }: { status: "紅燈" | "黃燈" | "綠燈" }) => {
    const colors: Record<string, string> = {
      紅燈: "bg-red-500/20 text-red-300 border-red-500/30",
      黃燈: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      綠燈: "bg-green-500/20 text-green-300 border-green-500/30",
    };
    return (
      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${colors[status] || ""}`}>
        {status}
      </span>
    );
  };

  const copyReport = async () => {
    if (!result) return;
    const lines: string[] = [];
    lines.push("【AI 治理五檢查自評結果】");
    lines.push(`整體治理成熟度：${result.overallScore.toFixed(1)} 分（${result.overallLevel}）`);
    lines.push("");
    lines.push("五大維度：");
    for (const d of result.dimensions) {
      lines.push(`• ${d.icon} ${d.label}：${d.score} 分（${d.level}／${d.status}）`);
    }
    lines.push("");
    lines.push(`風險維度：${result.risks.length > 0 ? result.risks.map((r) => r.dim).join("、") : "無，五維度全綠"}`);
    lines.push("");
    lines.push("優先行動：");
    for (const rec of result.recommendations) {
      lines.push(`• ${rec.dim}（${rec.priority === "high" ? "高優先" : "中優先"}）：${rec.text}`);
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
              <span className="text-sm text-[#2EC4B6] font-semibold">榕耀管顧原創 · 治理五檢查框架</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6">
              你的 AI 用得多，<br />
              但<span className="text-[#2EC4B6]">治理得好嗎？</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              Pilot Trap 量表測的是「點」——你的試點卡不卡關；
              治理五檢查測的是「體質」——<strong className="text-white">人、流程、資料、技術、文化</strong>，
              五大維度 × 20 題，<strong className="text-white">5 分鐘</strong>找出會拖垮 AI 轉型的治理缺口。
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-2xl mx-auto mb-10">
              {DIMENSIONS.map((d) => (
                <div key={d.key} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">{d.icon}</div>
                  <div className="text-sm font-semibold text-white/80">{d.label}</div>
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
        {step === "quiz" && currentDim && (
          <div className="max-w-2xl mx-auto">
            {/* Progress bar */}
            <div className="flex items-center gap-3 mb-8">
              <div
                className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden"
                role="progressbar"
                aria-label="作答進度"
                aria-valuemin={1}
                aria-valuemax={DIMENSIONS.length}
                aria-valuenow={currentDimIdx + 1}
              >
                <div
                  className="h-full bg-[#2EC4B6] rounded-full transition-all"
                  style={{ width: `${((currentDimIdx + 1) / DIMENSIONS.length) * 100}%` }}
                />
              </div>
              <span className="text-white/50 text-sm">
                {currentDimIdx + 1} / {DIMENSIONS.length}
              </span>
            </div>

            {/* Dimension header */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{currentDim.icon}</span>
              <h2 className="text-2xl font-bold">{currentDim.label} · {dimTitle(currentDim.key)}</h2>
            </div>
            <p className="text-white/50 text-sm mb-8">{currentDim.description}</p>

            {/* Questions */}
            <div className="space-y-6">
              {currentDim.questions.map((q, qi) => (
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
                onClick={goToPrevDim}
                disabled={currentDimIdx === 0}
                className="px-6 py-3 rounded-full font-semibold text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← 上一維度
              </button>
              {isLastDim ? (
                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered || submitting}
                  className="bg-[#E8912A] hover:bg-[#F5A623] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-full transition-colors shadow-lg"
                >
                  {submitting ? "計算中…" : "看結果 →"}
                </button>
              ) : (
                <button
                  onClick={goToNextDim}
                  disabled={!currentDimAnswered}
                  className="bg-[#1A6DB5] hover:bg-[#2680CC] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-full transition-colors"
                >
                  下一維度 →
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
                <span className="text-sm text-[#2EC4B6] font-semibold">AI 治理五檢查自評結果</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black mb-4">
                治理成熟度 <span className="text-[#2EC4B6]">{result.overallScore.toFixed(1)}</span> 分
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
                {result.dimensions.map((d) => (
                  <div key={d.key} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg">{d.icon}</span>
                      <span className="text-white/80 font-medium whitespace-nowrap">{d.label}</span>
                    </div>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden ml-2">
                      <div
                        className={`h-full rounded-full ${
                          d.status === "紅燈" ? "bg-red-400" : d.status === "黃燈" ? "bg-yellow-400" : "bg-[#2EC4B6]"
                        }`}
                        style={{ width: `${d.pct}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-white font-bold">{d.score.toFixed(1)}</span>
                      <StatusBadge status={d.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk alert */}
            {result.hasRisk && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-10">
                <h2 className="text-lg font-bold text-red-300 mb-3">🚨 風險警示</h2>
                <ul className="space-y-2">
                  {result.risks.map((r) => (
                    <li key={r.dim} className="text-white/80 text-sm leading-relaxed">
                      <strong className="text-white">{r.dim}</strong>（{r.score} 分，{r.level}）—— 治理缺口，需優先處置
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Strengths */}
            {result.strengths.length > 0 && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 mb-10">
                <h2 className="text-lg font-bold text-green-300 mb-3">✅ 治理強項</h2>
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
                      rec.priority === "high" ? "bg-red-500/20 text-red-300" : "bg-yellow-500/20 text-yellow-300"
                    }`}>
                      {rec.priority === "high" ? "高優先" : "中優先"}
                    </span>
                    <div>
                      <p className="text-white/80 text-sm leading-relaxed">
                        <strong className="text-[#2EC4B6]">{rec.dim}：</strong>{rec.text}
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
            {!email && (
              <div className="bg-gradient-to-br from-[#1A6DB5]/20 to-[#2EC4B6]/10 border border-[#2EC4B6]/30 rounded-2xl p-6 mb-8">
                <h2 className="text-lg font-bold mb-1">📬 想拿到完整治理行動清單？</h2>
                <p className="text-white/60 text-sm mb-4 leading-relaxed">
                  留下 Email，我們寄送《AI 治理五檢查完整行動指南》，並在 30 天後免費提醒你複測。
                </p>
                <div className="grid sm:grid-cols-2 gap-3 mb-3">
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
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email（必填）"
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#2EC4B6]"
                    aria-label="Email"
                  />
                </div>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="公司名稱（選填）"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#2EC4B6] mb-4"
                  aria-label="公司名稱"
                />
                <button
                  onClick={handleSubmit}
                  disabled={!email || submitting}
                  className="bg-[#E8912A] hover:bg-[#F5A623] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-full transition-colors"
                >
                  {submitting ? "送出中…" : "訂閱並取得指南 →"}
                </button>
                <p className="text-white/30 text-xs mt-3">我們只寄有用的內容，隨時可退訂。</p>
              </div>
            )}

            {/* Funnel CTA */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <h2 className="text-xl font-bold mb-2">測出缺口之後，下一步？</h2>
              <p className="text-white/60 text-sm mb-6 leading-relaxed">
                治理體質是骨架，落地路徑是肌肉。用 AI 轉型路線圖生成器，
                把治理缺口轉成 12 個月的行動計畫。
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="/ai-roadmap"
                  className="bg-[#1A6DB5] hover:bg-[#2680CC] text-white font-bold px-8 py-3 rounded-full transition-colors"
                >
                  生成 AI 轉型路線圖 →
                </a>
                <a
                  href="/pilot-trap-scan"
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-full transition-colors"
                >
                  再測 Pilot Trap 陷阱
                </a>
                <a
                  href="/about/#contact"
                  className="text-[#E8912A] hover:text-[#F5A623] font-semibold px-4 py-3 transition-colors"
                >
                  預約免費諮詢 →
                </a>
              </div>
              <p className="text-white/30 text-xs mt-5">
                本工具基於榕耀管顧「治理五檢查」框架，衡量的是整體治理體質，非單一專案診斷；建議與 Pilot Trap 量表搭配使用，點面互補。
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function dimTitle(key: DimKey): string {
  const titles: Record<DimKey, string> = {
    people: "治理人才",
    process: "治理機制",
    data: "資料治理",
    tech: "技術治理",
    culture: "治理文化",
  };
  return titles[key];
}