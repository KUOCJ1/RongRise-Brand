"use client";

import { useState, useCallback } from "react";
import {
  getAllLayers,
  evaluate,
  getLayerKeyList,
  alignmentReportText,
  type LayerKey,
  type AlignmentResult,
  type LayerResult,
} from "@/lib/human-ai-alignment";
import { withUtmPayload } from "@/lib/utm";

/* ============================================
   人機策略對齊度自評（B5-1 微型工具）
   三步驟：介紹 → 分層作答 → 結果
   方法論：榕耀管顧「人機策略四層」框架（2026-10-31）
   四層：人機策略 → 人機流程 → 管理機制 → 系統實作
   漏斗定位：human-ai-alignment → ai-employee-diagnosis / course-fit → 預約諮詢

   留資規則（與 ai-investment-split 一致，勿改）：
   1. 顯示條件用獨立的 leadEmail 狀態，不用輸入框自己的值
   2. 先交結果畫面，再背景送 fetch，不 await 在切換之前
   3. fetch 包 try/catch + AbortSignal.timeout(10000)，失敗靜默
   4. company 空著要送「未填寫」，否則 route.ts 會回 400
   ============================================ */

type Step = "intro" | "quiz" | "result";

const LAYERS = getAllLayers();
const LAYER_KEYS: LayerKey[] = getLayerKeyList();
const TOTAL_QUESTIONS = LAYERS.reduce((n, l) => n + l.questions.length, 0);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ===== SVG 四軸雷達圖（比照 ai-employee-diagnosis 的五軸版） ===== */

function RadarChart({ result }: { result: AlignmentResult }) {
  const cx = 150;
  const cy = 150;
  const r = 108;
  const angles = [0, 90, 180, 270].map((d) => ((d - 90) * Math.PI) / 180);
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const scores = LAYER_KEYS.map((k) => {
    const layer = result.layers.find((l) => l.key === k);
    return layer ? layer.score / 5 : 0;
  });

  const points = scores.map((s, i) => ({
    x: cx + r * s * Math.cos(angles[i]),
    y: cy + r * s * Math.sin(angles[i]),
  }));
  const polyPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  const labelRadius = r + 14;
  const labels = LAYER_KEYS.map((k) => LAYERS.find((l) => l.key === k)?.label ?? "");

  const ariaLabel = `人機策略四層對齊度雷達圖：${result.layers
    .map((l) => `${l.label} ${l.score.toFixed(1)} 分`)
    .join("、")}，整體 ${result.overallScore.toFixed(1)} 分`;

  return (
    <svg
      viewBox="-14 0 328 300"
      className="w-full max-w-xs mx-auto"
      style={{ height: 300 }}
      role="img"
      aria-label={ariaLabel}
    >
      {levels.map((level) => {
        const pts = angles
          .map((a) => ({ x: cx + r * level * Math.cos(a), y: cy + r * level * Math.sin(a) }))
          .map((p) => `${p.x},${p.y}`)
          .join(" ");
        return <polygon key={level} points={pts} fill="none" stroke="#1E3A5F" strokeWidth="1" />;
      })}
      {angles.map((a, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={cx + r * Math.cos(a)}
          y2={cy + r * Math.sin(a)}
          stroke="#1E3A5F"
          strokeWidth="1"
        />
      ))}
      <polygon points={polyPoints} fill="rgba(46, 196, 182, 0.25)" stroke="#2EC4B6" strokeWidth="2" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#2EC4B6" />
      ))}
      {labels.map((label, i) => (
        <text
          key={label}
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
    起步: "bg-red-500/20 text-red-300",
    形成: "bg-orange-500/20 text-orange-300",
    發展: "bg-yellow-500/20 text-yellow-300",
    成熟: "bg-green-500/20 text-green-300",
    標竿: "bg-blue-500/20 text-blue-300",
  };
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${colors[level] || "bg-white/10 text-white"}`}>
      {level}
    </span>
  );
}

function StatusBadge({ status }: { status: LayerResult["status"] }) {
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
}

export default function HumanAIAlignmentPage() {
  const [step, setStep] = useState<Step>("intro");
  const [layerIdx, setLayerIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<AlignmentResult | null>(null);
  const [copied, setCopied] = useState(false);

  // 留資（選填）
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [leadEmail, setLeadEmail] = useState<string | null>(null);
  const [leadError, setLeadError] = useState<string | null>(null);

  const currentLayer = LAYERS[layerIdx];
  const isLastLayer = layerIdx === LAYERS.length - 1;

  const currentLayerAnswered = currentLayer
    ? currentLayer.questions.every((q) => answers[q.id] !== undefined)
    : false;
  const allAnswered = LAYERS.every((l) => l.questions.every((q) => answers[q.id] !== undefined));

  const setAnswer = useCallback((qId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  }, []);

  const goNext = useCallback(() => {
    if (layerIdx < LAYERS.length - 1) {
      setLayerIdx((i) => i + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [layerIdx]);

  const goPrev = useCallback(() => {
    if (layerIdx > 0) {
      setLayerIdx((i) => i - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [layerIdx]);

  // 先把結果與畫面交出去，再談其他事
  const showResult = useCallback(() => {
    if (!allAnswered) return;
    setResult(evaluate(answers));
    setStep("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [allAnswered, answers]);

  const restart = useCallback(() => {
    setAnswers({});
    setLayerIdx(0);
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

  const submitLead = useCallback(() => {
    if (!result || !emailIsValid) return;

    const line = result.layers
      .map((l) => `${l.label} ${l.score.toFixed(1)}`)
      .join(" / ");

    const aiStage =
      result.overallScore >= 4 ? "scaling" : result.overallScore >= 3 ? "piloting" : "not_started";

    try {
      // 不 await：留資是附加動作，不能擋住結果；但成功訊息只在回應 ok 時才顯示
      const pending = fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(10000),
        body: JSON.stringify(withUtmPayload({
          name: name.trim() || "人機對齊自評訪客",
          email: email.trim(),
          // route.ts 要求 company 必填，空字串會 400
          company: company.trim() || "未填寫",
          industry: "其他／綜合",
          ai_stage: aiStage,
          challenges: Array.from(
            new Set(["人機策略", result.weakestLayer.label].filter(Boolean))
          ),
          message: `人機策略對齊度：${line}（整體 ${result.overallScore.toFixed(1)} 分，錯位：${
            result.misalignments[0]?.title ?? "無"
          }）`,
          source: "human-ai-alignment",
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
        });
    } catch {
      setLeadError("這個瀏覽器無法送出表單，請直接預約免費諮詢。");
    }
  }, [result, emailIsValid, name, email, company]);

  const copyReport = async () => {
    if (!result) return;
    const text = alignmentReportText(result);
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
        // 兩條路都不行就維持原狀，讓使用者自行選取
      }
      document.body.removeChild(ta);
    }
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-[#0D2B4E] via-[#0D2B4E] to-[#0A1F3A] text-white">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        {/* 步驟播報：切換畫面時讓讀屏使用者知道自己在哪裡 */}
        <p className="sr-only" aria-live="polite">
          {step === "intro"
            ? "人機策略對齊度自評介紹"
            : step === "quiz"
            ? `作答第 ${layerIdx + 1} 層，共 ${LAYERS.length} 層`
            : "自評結果"}
        </p>
        {/* ===== STEP 1：介紹 ===== */}
        {step === "intro" && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#1A6DB5]/20 border border-[#2EC4B6]/30 rounded-full px-4 py-1.5 mb-6">
              <span className="text-sm text-[#2EC4B6] font-semibold">榕耀管顧原創 · 人機策略四層框架</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6">
              你的 AI 策略，
              <br />
              <span className="text-[#2EC4B6]">有四層支撐嗎？</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              AI 預算編在 IT、錯誤落法務、人資只拿一半責任——
              問題不在工具，在<strong className="text-white">人機策略沒有對齊</strong>。
              四層 × 12 題，找出哪一層在空談、哪一層白做。
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-6">
              {LAYERS.map((l, i) => (
                <div key={l.key} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div className="text-[10px] text-[#2EC4B6] font-bold tracking-widest mb-1">L{i + 1}</div>
                  <div className="text-2xl mb-1">{l.icon}</div>
                  <div className="text-sm font-semibold text-white/80">{l.label}</div>
                </div>
              ))}
            </div>
            <p className="text-white/55 text-sm max-w-2xl mx-auto mb-8 leading-relaxed">
              四層是疊起來的：上層沒有下層支撐＝空談，下層沒有上層授權＝白做。
            </p>

            <button
              onClick={() => {
                setStep("quiz");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="bg-[#E8912A] hover:bg-[#F5A623] text-white font-bold px-10 py-4 rounded-full text-lg transition-colors shadow-lg"
            >
              開始自評 →
            </button>
            <p className="text-white/60 text-xs mt-4">
              12 題 · 約 4 分鐘 · 不需留資即可看完整結果
            </p>
          </div>
        )}

        {/* ===== STEP 2：分層作答（一層一頁 3 題） ===== */}
        {step === "quiz" && currentLayer && (
          <div className="max-w-2xl mx-auto">
            {/* 進度 */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden"
                role="progressbar"
                aria-label={`作答進度：第 ${layerIdx + 1} 層，共 ${LAYERS.length} 層`}
                aria-valuemin={1}
                aria-valuemax={LAYERS.length}
                aria-valuenow={layerIdx + 1}
              >
                <div
                  className="h-full bg-[#2EC4B6] rounded-full transition-all"
                  style={{ width: `${((layerIdx + 1) / LAYERS.length) * 100}%` }}
                />
              </div>
              <span className="text-white/50 text-sm tabular-nums">
                {layerIdx + 1} / {LAYERS.length}
              </span>
            </div>

            {/* 四層位置 */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
              {LAYERS.map((l, i) => (
                <span
                  key={l.key}
                  className={`text-[11px] px-2.5 py-1 rounded-full border ${
                    i === layerIdx
                      ? "bg-[#1A6DB5]/40 border-[#2EC4B6]/50 text-white font-semibold"
                      : i < layerIdx
                      ? "bg-white/5 border-white/10 text-[#2EC4B6]"
                      : "bg-transparent border-white/10 text-white/35"
                  }`}
                >
                  L{i + 1} {l.label}
                  {i < layerIdx ? " ✓" : ""}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl" aria-hidden="true">
                {currentLayer.icon}
              </span>
              <h2 className="text-2xl font-bold">
                L{layerIdx + 1} · {currentLayer.label}
              </h2>
            </div>
            <p className="text-white/50 text-sm mb-8">{currentLayer.description}</p>

            <div className="space-y-6">
              {currentLayer.questions.map((q, qi) => (
                <fieldset key={q.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <legend className="text-white font-semibold mb-4">
                    <span className="text-[#2EC4B6] font-bold">{qi + 1}.</span> {q.text}
                  </legend>
                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const selected = answers[q.id] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setAnswer(q.id, opt.value)}
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
                onClick={goPrev}
                disabled={layerIdx === 0}
                className="px-6 py-3 rounded-full font-semibold text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← 上一層
              </button>
              {isLastLayer ? (
                <button
                  onClick={showResult}
                  disabled={!allAnswered}
                  className="bg-[#E8912A] hover:bg-[#F5A623] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-full transition-colors shadow-lg"
                >
                  看結果 →
                </button>
              ) : (
                <button
                  onClick={goNext}
                  disabled={!currentLayerAnswered}
                  className="bg-[#1A6DB5] hover:bg-[#2680CC] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-full transition-colors"
                >
                  下一層 →
                </button>
              )}
            </div>
            <p className="text-white/60 text-xs mt-4 text-center">
              已回答 {Object.keys(answers).length} / {TOTAL_QUESTIONS} 題
            </p>
          </div>
        )}

        {/* ===== STEP 3：結果 ===== */}
        {step === "result" && result && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-[#1A6DB5]/20 border border-[#2EC4B6]/30 rounded-full px-4 py-1.5 mb-6">
                <span className="text-sm text-[#2EC4B6] font-semibold">人機策略對齊度自評結果</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black mb-4">
                整體對齊度 <span className="text-[#2EC4B6]">{result.overallScore.toFixed(1)}</span> 分
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <LevelBadge level={result.overallLevel} />
                <span className="text-white/50 text-sm">
                  {result.redCount} 紅燈 · {result.yellowCount} 黃燈 · {result.greenCount} 綠燈
                </span>
              </div>
              <p className="text-white/70 max-w-2xl mx-auto mt-6 leading-relaxed">{result.summary}</p>
            </div>

            {/* 雷達圖 + 四層分數條 */}
            <div className="grid md:grid-cols-2 gap-8 items-center mb-10 bg-white/5 border border-white/10 rounded-2xl p-8">
              <RadarChart result={result} />
              <div className="space-y-4">
                {result.layers.map((l) => (
                  <div key={l.key}>
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg" aria-hidden="true">
                          {l.icon}
                        </span>
                        <span className="text-white/80 font-medium whitespace-nowrap">{l.label}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-white font-bold tabular-nums">{l.score.toFixed(1)}</span>
                        <StatusBadge status={l.status} />
                      </div>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          l.status === "紅燈" ? "bg-red-400" : l.status === "黃燈" ? "bg-yellow-400" : "bg-[#2EC4B6]"
                        }`}
                        style={{ width: `${l.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
                <p className="text-white/60 text-xs pt-2">
                  分數換算：（平均分 − 1）÷ 4 × 100%。低於 45% 紅燈，45–70% 黃燈，高於 70% 綠燈。
                </p>
              </div>
            </div>

            {/* 跨層錯位診斷 */}
            <div className="mb-10">
              <h2 className="text-lg font-bold mb-4">🧩 跨層錯位診斷</h2>
              <div className="space-y-3">
                {result.misalignments.map((m) => (
                  <div
                    key={m.title}
                    className={`rounded-2xl p-6 border ${
                      m.severity === "high"
                        ? "bg-[#E8912A]/10 border-[#E8912A]/40"
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          m.severity === "high"
                            ? "bg-[#E8912A]/20 text-[#E8912A]"
                            : "bg-white/10 text-white/50"
                        }`}
                      >
                        {m.severity === "high" ? "高優先" : "留意"}
                      </span>
                      <h3 className={`font-bold ${m.severity === "high" ? "text-[#E8912A]" : "text-white"}`}>
                        {m.title}
                      </h3>
                    </div>
                    <p className="text-white/75 text-sm leading-relaxed">{m.detail}</p>
                  </div>
                ))}
              </div>

              {result.gaps.length > 0 && (
                <div className="mt-4 bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-white/60 mb-3">低於 3 分的層（缺口）</h3>
                  <ul className="space-y-3">
                    {result.gaps.map((g) => (
                      <li key={g.key} className="text-white/70 text-sm leading-relaxed">
                        <strong className="text-white">
                          {g.label}（{g.score.toFixed(1)} 分）
                        </strong>
                        ：{g.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 優先行動建議 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10">
              <h2 className="text-lg font-bold mb-4">🎯 優先行動建議</h2>
              <div className="space-y-4">
                {result.recommendations.map((rec, i) => (
                  <div key={`${rec.layer}-${i}`} className="flex gap-3">
                    <span
                      className={`shrink-0 text-xs font-bold px-2 py-1 rounded-full h-fit ${
                        rec.priority === "high"
                          ? "bg-[#E8912A]/20 text-[#E8912A]"
                          : rec.priority === "medium"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-white/10 text-white/45"
                      }`}
                    >
                      {rec.priority === "high" ? "高優先" : rec.priority === "medium" ? "中優先" : "持續優化"}
                    </span>
                    <p className="text-white/80 text-sm leading-relaxed">
                      <strong className="text-[#2EC4B6]">{rec.layer}：</strong>
                      {rec.text}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-6 pt-5 border-t border-white/10">
                <button
                  onClick={copyReport}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-colors"
                >
                  {copied ? "✓ 已複製" : "複製完整報告"}
                </button>
                <span role="status" aria-live="polite" className="sr-only">
                  {copied ? "報告已複製到剪貼簿" : ""}
                </span>
                <span className="text-white/55 text-xs">把結果貼給顧問，討論會從錯位開始，不用從頭講一遍</span>
              </div>
            </div>

            {/* 強項 */}
            {result.strengths.length > 0 && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 mb-10">
                <h2 className="text-lg font-bold text-green-300 mb-3">✅ 已經站穩的層</h2>
                <ul className="space-y-2">
                  {result.strengths.map((s) => (
                    <li key={s} className="text-white/80 text-sm leading-relaxed">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 留資（選填）：顯示條件只看 leadEmail */}
            {leadEmail === null ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitLead();
                }}
                className="bg-gradient-to-br from-[#1A6DB5]/20 to-[#2EC4B6]/10 border border-[#2EC4B6]/30 rounded-2xl p-6 mb-8"
              >
                <h2 className="text-lg font-bold mb-1">📬 想繼續追蹤人機策略的實作？</h2>
                <p className="text-white/60 text-sm mb-4 leading-relaxed">
                  留下 Email 訂閱《榕賀觀點》。我會把人機策略的檢查表、企業案例與實際踩坑寫進電子報，大約每個月一至兩封。不留 Email 也看得到完整結果。
                </p>
                <div className="grid sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label htmlFor="hma-name" className="block text-white/50 text-xs mb-1">
                      姓名（選填）
                    </label>
                    <input
                      id="hma-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="怎麼稱呼你"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#2EC4B6]"
                    />
                  </div>
                  <div>
                    <label htmlFor="hma-email" className="block text-white/50 text-xs mb-1">
                      Email（必填）
                    </label>
                    <input
                      id="hma-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      aria-invalid={email.length > 0 && !emailIsValid}
                      aria-describedby={email.length > 0 && !emailIsValid ? "hma-email-error" : undefined}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#2EC4B6]"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="hma-company" className="block text-white/50 text-xs mb-1">
                    公司名稱（選填）
                  </label>
                  <input
                    id="hma-company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="公司或單位"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#2EC4B6]"
                  />
                </div>
                {email.length > 0 && !emailIsValid && (
                  <p id="hma-email-error" role="alert" className="text-red-300 text-xs mb-3">
                    請輸入有效的 Email 格式
                  </p>
                )}
                {leadError && (
                  <p role="alert" className="text-red-300 text-sm mb-3">
                    {leadError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={!emailIsValid}
                  className="bg-[#E8912A] hover:bg-[#F5A623] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-full transition-colors"
                >
                  訂閱電子報 →
                </button>
                <p className="text-white/60 text-xs mt-3">
                  只寄電子報，隨時可退訂。
                </p>
              </form>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8" role="status">
                <p className="text-white/60 text-sm leading-relaxed">
                  已收到 {leadEmail}，之後的電子報會寄到這個信箱（若沒收到，請看垃圾信件匣）。要更快討論你們的錯位，直接
                  <a href="/about/#contact" className="text-[#2EC4B6] hover:text-[#7FE3D8] font-semibold ml-1">
                    預約免費諮詢
                  </a>
                  。
                </p>
              </div>
            )}

            {/* 總結 + 下一步 CTA */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <h2 className="text-xl font-bold mb-2">下一步</h2>
              <p className="text-white/70 text-sm mb-6 leading-relaxed max-w-xl mx-auto">{result.nextStep}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="/ai-employee-diagnosis"
                  className="bg-[#1A6DB5] hover:bg-[#2680CC] text-white font-bold px-8 py-3 rounded-full transition-colors"
                >
                  測 AI 員工管理五階 →
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
              <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-white/55 text-xs text-left leading-relaxed">
                  本工具依榕耀管顧「人機策略四層」框架計分，衡量的是策略與機制的對齊程度，不是工具或模型的好壞。
                </p>
                <button
                  onClick={restart}
                  className="text-white/65 hover:text-white text-xs underline underline-offset-4 shrink-0"
                >
                  重新自評
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
