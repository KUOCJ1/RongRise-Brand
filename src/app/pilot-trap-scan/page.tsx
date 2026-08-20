"use client";

import { useState, useCallback, useMemo } from "react";
import {
  QUESTIONS,
  DIMENSIONS,
  computeResult,
  type DimensionKey,
  type PilotTrapResult,
} from "@/lib/pilot-trap-scan";

/* ============================================
   Pilot Trap 診斷量表（Pilot Trap Scanner）
   三步驟：介紹 → 25 題 → 結果（雷達圖 + 建議）
   2026-08-20 小賀開發（W3-B1 微型工具）
   方法論對齊《逃離 Pilot 陷阱》（McKinsey 2026）
   + 榕耀管顧「治理五檢查」實務
   ============================================ */

type Step = "intro" | "form" | "result";

const DIM_LIST = Object.keys(DIMENSIONS) as DimensionKey[];

const LEVEL_META = {
  stable: { label: "穩健", color: "#2EC4B6", desc: "你的 AI 部隊治理體質良好，繼續維持月檢紀律。" },
  attention: { label: "注意", color: "#E8912A", desc: "有幾個維度在及格線邊緣，需要立刻補強。" },
  red: { label: "紅燈", color: "#E0503A", desc: "多數維度不及格，你正在養一堆沒人管的 pilot。" },
} as const;

/* ---- SVG 雷達圖（零依賴） ---- */
function RadarChart({ scores }: { scores: Record<DimensionKey, number> }) {
  const size = 440;
  const cx = size / 2;
  const cy = size / 2;
  const r = 150;

  const point = (i: number, val: number): [number, number] => {
    const ang = (Math.PI * 2 * i) / DIM_LIST.length - Math.PI / 2;
    const rr = (Math.max(val, 0) / 100) * r;
    return [cx + rr * Math.cos(ang), cy + rr * Math.sin(ang)];
  };

  const ringPoints = (v: number) =>
    DIM_LIST.map((_, i) => point(i, v).map((n) => n.toFixed(1)).join(",")).join(" ");

  const dataPoints = DIM_LIST.map((d, i) => point(i, scores[d]).map((n) => n.toFixed(1)).join(",")).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-md mx-auto">
      {[100, 75, 50, 25].map((v) => (
        <polygon
          key={v}
          points={ringPoints(v)}
          fill="none"
          stroke="#1A6DB5"
          strokeOpacity={v === 100 ? 0.5 : 0.25}
          strokeWidth={1}
        />
      ))}
      {DIM_LIST.map((d, i) => {
        const [x, y] = point(i, 118);
        return (
          <line
            key={d}
            x1={cx}
            y1={cy}
            x2={point(i, 100)[0]}
            y2={point(i, 100)[1]}
            stroke="#1A6DB5"
            strokeOpacity={0.3}
            strokeWidth={1}
          />
        );
      })}
      <polygon points={dataPoints} fill="#2EC4B6" fillOpacity={0.25} stroke="#2EC4B6" strokeWidth={2.5} strokeLinejoin="round" />
      {DIM_LIST.map((d, i) => {
        const [x, y] = point(i, scores[d]);
        return <circle key={d} cx={x} cy={y} r={5} fill="#E8912A" />;
      })}
      {DIM_LIST.map((d, i) => {
        const [x, y] = point(i, 118);
        const anchor = x < cx - 10 ? "end" : x > cx + 10 ? "start" : "middle";
        return (
          <text
            key={d}
            x={x}
            y={y}
            textAnchor={anchor}
            fontSize={15}
            fontWeight={700}
            fill="#E6F0FA"
          >
            {DIMENSIONS[d].label}
          </text>
        );
      })}
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize={13} fill="#A0C4E8">
        健康度
      </text>
    </svg>
  );
}

function ScoreBar({ label, sub, score, color }: { label: string; sub: string; score: number; color: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-white font-semibold">
          {label}
          <span className="text-[#A0C4E8] text-sm font-normal ml-2">{sub}</span>
        </span>
        <span className="font-bold text-lg" style={{ color }}>{score}</span>
      </div>
      <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export default function PilotTrapScanPage() {
  const [step, setStep] = useState<Step>("intro");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const progress = Math.round((answeredCount / QUESTIONS.length) * 100);
  const isLast = qIndex === QUESTIONS.length - 1;
  const q = QUESTIONS[qIndex];
  const qAnswered = answers[q.id] !== undefined;

  const result: PilotTrapResult | null = useMemo(() => {
    if (step !== "result") return null;
    return computeResult(answers);
  }, [step, answers]);

  const selectOption = useCallback(
    (score: number) => {
      setAnswers((a) => ({ ...a, [q.id]: score }));
      if (!isLast) {
        setTimeout(() => setQIndex((i) => Math.min(i + 1, QUESTIONS.length - 1)), 180);
      }
    },
    [q.id, isLast]
  );

  const goBack = useCallback(() => setQIndex((i) => Math.max(i - 1, 0)), []);

  const handleFinish = useCallback(async () => {
    setSubmitting(true);
    // 留資（選填 email；填了才寫入 Newsletter API）
    if (email) {
      try {
        await fetch("/api/newsletter/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name || "Pilot Trap 訪客",
            email,
            company: company || "",
            industry: "其他／綜合",
            ai_stage: "exploring",
            challenges: ["agent 治理"],
            message: `來自 Pilot Trap 診斷量表（25 題完成，健康度 ${Math.round(
              (Object.values(answers).reduce((s, v) => s + v, 0) / (QUESTIONS.length * 3)) * 100
            )}%）`,
            source: "pilot-trap-scan",
            subscribed_at: new Date().toISOString(),
          }),
        });
      } catch {
        // 留資失敗不阻擋結果
      }
    }
    setSubmitting(false);
    setStep("result");
  }, [email, name, company, answers]);

  const restart = useCallback(() => {
    setAnswers({});
    setQIndex(0);
    setEmail("");
    setStep("intro");
  }, []);

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-[#0D2B4E] via-[#0D2B4E] to-[#0A1F3A] text-white">
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        {/* ===== STEP 1: 介紹 ===== */}
        {step === "intro" && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#1A6DB5]/20 border border-[#2EC4B6]/30 rounded-full px-4 py-1.5 mb-6">
              <span className="text-sm text-[#2EC4B6] font-semibold">Agent 治理 × 企業 AI 實用工具</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6">
              你的 AI 部隊，
              <br />
              是在<span className="text-[#E8912A]">鋪路</span>還是卡進
              <br className="hidden md:block" />
              <span className="text-[#E8912A]">Pilot 陷阱？</span>
            </h1>
            <p className="text-lg md:text-xl text-[#A0C4E8] max-w-2xl mx-auto mb-8 leading-relaxed">
              25 題，五分鐘，測出你的 AI 應用是在為未來營運鋪路，
              還是在把舊流程<span className="text-white font-semibold">硬化成無人治理的 code</span>。
              立即得到五維度健康雷達圖與具體行動建議。
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mb-10">
              {[
                { icon: "🧭", label: "Pilot Trap 方法論" },
                { icon: "📡", label: "五維度雷達圖" },
                { icon: "⏱️", label: "五分鐘完成" },
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
              開始診斷 →
            </button>
            <p className="text-xs text-[#5A7A9E] mt-6">
              方法論源自 McKinsey《逃離 Pilot 陷阱》與榕耀管顧
              <a href="/knowledge/managing-31-ai-agents/" className="text-[#2EC4B6] hover:underline mx-1">
                「我們怎麼管自己的 31 個 AI 員工」
              </a>
              實戰經驗
            </p>
          </div>
        )}

        {/* ===== STEP 2: 25 題 ===== */}
        {step === "form" && (
          <div>
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-[#A0C4E8] mb-2">
                <span>
                  第 {qIndex + 1} / {QUESTIONS.length} 題
                </span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-[#2EC4B6] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
              <div className="inline-block text-xs font-bold text-[#2EC4B6] bg-[#2EC4B6]/10 rounded-full px-3 py-1 mb-4">
                {DIMENSIONS[q.dimension].label} · {DIMENSIONS[q.dimension].sub}
              </div>
              <h2 className="text-xl md:text-2xl font-bold leading-snug mb-6">{q.text}</h2>
              <div className="space-y-3">
                {q.options.map((opt) => {
                  const selected = answers[q.id] === opt.score;
                  return (
                    <button
                      key={opt.text}
                      onClick={() => selectOption(opt.score)}
                      className={`w-full text-left px-5 py-4 rounded-xl border transition-all text-base md:text-lg ${
                        selected
                          ? "bg-[#2EC4B6]/15 border-[#2EC4B6] text-white"
                          : "bg-white/5 border-white/10 text-[#D6E6F5] hover:border-[#1A6DB5] hover:bg-white/10"
                      }`}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <button
                onClick={goBack}
                disabled={qIndex === 0}
                className="px-6 py-3 rounded-full border border-white/15 text-[#A0C4E8] disabled:opacity-30 hover:bg-white/5 transition-colors"
              >
                ← 上一題
              </button>

              {isLast && answeredCount === QUESTIONS.length ? (
                <div className="flex-1 ml-4">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-3">
                    <p className="text-sm text-[#A0C4E8] mb-2">
                      （選填）留下 Email，我們把診斷結果與後續建議寄給你：
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="姓名"
                        className="bg-[#0A1F3A] border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder-[#5A7A9E] focus:outline-none focus:border-[#2EC4B6]"
                      />
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        type="email"
                        className="bg-[#0A1F3A] border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder-[#5A7A9E] focus:outline-none focus:border-[#2EC4B6]"
                      />
                      <input
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="公司"
                        className="bg-[#0A1F3A] border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder-[#5A7A9E] focus:outline-none focus:border-[#2EC4B6]"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleFinish}
                    disabled={submitting}
                    className="w-full bg-[#E8912A] hover:bg-[#F0A040] text-[#0D2B4E] font-bold text-lg px-8 py-4 rounded-full transition-colors shadow-lg shadow-[#E8912A]/20 disabled:opacity-50"
                  >
                    {submitting ? "計算中…" : "看我的診斷結果 →"}
                  </button>
                </div>
              ) : (
                <span className="text-sm text-[#5A7A9E]">
                  {qAnswered ? "已作答，將自動進入下一題" : "請選擇最符合的答案"}
                </span>
              )}
            </div>
          </div>
        )}

        {/* ===== STEP 3: 結果 ===== */}
        {step === "result" && result && (
          <div>
            <div className="text-center mb-8">
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 text-sm font-bold"
                style={{ backgroundColor: `${LEVEL_META[result.level].color}20`, color: LEVEL_META[result.level].color }}
              >
                {LEVEL_META[result.level].label}等級 · 整體健康度 {result.overall}/100
              </div>
              <h1 className="text-3xl md:text-4xl font-black mb-3">
                {result.level === "stable" && "治理體質良好，別停下"}
                {result.level === "attention" && "有些地方在漏，趁早補"}
                {result.level === "red" && "你正在養一堆沒人管的 pilot"}
              </h1>
              <p className="text-[#A0C4E8] max-w-xl mx-auto leading-relaxed">{LEVEL_META[result.level].desc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-10">
              <RadarChart scores={result.scores} />
              <div className="space-y-4">
                {DIM_LIST.map((d) => (
                  <ScoreBar
                    key={d}
                    label={DIMENSIONS[d].label}
                    sub={DIMENSIONS[d].sub}
                    score={result.scores[d]}
                    color={DIMENSIONS[d].color}
                  />
                ))}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-white font-semibold">
                      Pilot Trap 陷阱深度
                      <span className="text-[#A0C4E8] text-sm font-normal ml-2">（越高越危險）</span>
                    </span>
                    <span className="font-bold text-lg text-[#E0503A]">{result.pilotRisk}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#E8912A] to-[#E0503A]" style={{ width: `${result.pilotRisk}%` }} />
                  </div>
                  <p className="text-xs text-[#A0C4E8] mt-2">
                    {result.pilotRisk >= 60
                      ? "你的 pilot 正在把舊流程硬化成 code。先定義未來藍圖，再決定每個 pilot 的去留。"
                      : result.pilotRisk >= 35
                        ? "方向有雛形，但還沒變成紀律。把「對齊藍圖才擴大」寫進決策流程。"
                        : "你們的 pilot 有方向感，繼續用未來藍圖校準每個新實驗。"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-10">
              <h2 className="text-xl font-bold mb-4 text-[#E8912A]">給你的行動建議</h2>
              <ol className="space-y-3">
                {result.advice.map((a, i) => (
                  <li key={i} className="flex gap-3 text-[#D6E6F5] leading-relaxed">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-[#2EC4B6]/20 text-[#2EC4B6] font-bold text-sm flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span>{a}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="text-center bg-gradient-to-br from-[#1A6DB5]/20 to-[#2EC4B6]/10 border border-[#2EC4B6]/30 rounded-2xl p-8 mb-8">
              <h2 className="text-xl md:text-2xl font-bold mb-2">想把診斷變成行動方案？</h2>
              <p className="text-[#A0C4E8] mb-5 max-w-lg mx-auto">
                榕耀管顧的 Agentic HR 診斷工作坊，幫你在三小時內把這份雷達圖變成
                「AI 轉型 North Star 一頁圖」與 30/60/90 天行動計畫。
              </p>
              <a
                href="/contact"
                className="inline-block bg-[#E8912A] hover:bg-[#F0A040] text-[#0D2B4E] font-bold text-lg px-10 py-4 rounded-full transition-colors shadow-lg shadow-[#E8912A]/20"
              >
                預約免費諮詢 →
              </a>
            </div>

            <div className="text-center">
              <button
                onClick={restart}
                className="px-8 py-3 rounded-full border border-white/15 text-[#A0C4E8] hover:bg-white/5 transition-colors"
              >
                ↺ 重新測一次
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
