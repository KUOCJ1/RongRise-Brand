"use client";

import { useState, useMemo } from "react";
import {
  DIMENSIONS,
  type DimensionKey,
} from "@/lib/pilot-trap-scan";
import {
  parseScoreCodes,
  computeTeamResult,
  type TeamResult,
} from "@/lib/pilot-trap-workshop";

/* ============================================
   Pilot Trap 診斷量表 — 工作坊彙總頁（主持人端）
   P3-4 Agentic HR 診斷工作坊工具（2026-08-26）
   流程：參與者做個人量表 → 複製分數碼 → 主持人貼回
   → 團隊雷達圖 + 分佈 + 解讀 + 可列印 A4 報告
   ============================================ */

type Step = "intro" | "input" | "result";

const DIM_LIST = Object.keys(DIMENSIONS) as DimensionKey[];

const LEVEL_META = {
  stable: { label: "穩健", color: "#2EC4B6", desc: "團隊治理體質良好，重點是維持紀律並複製經驗。" },
  attention: { label: "注意", color: "#E8912A", desc: "有幾個維度在及格線邊緣，趁工作坊把補強計畫定下來。" },
  red: { label: "紅燈", color: "#E0503A", desc: "多數維度不及格，這支 AI 部隊正在無人治理地擴張。" },
} as const;

/* ---- SVG 雷達圖（零依賴，與個人量表同款） ---- */
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
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-md mx-auto radar-svg">
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
            className="radar-label"
          >
            {DIMENSIONS[d].label}
          </text>
        );
      })}
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize={13} className="radar-label radar-sub">
        團隊平均健康度
      </text>
    </svg>
  );
}

function ScoreBar({
  label,
  sub,
  score,
  min,
  max,
  color,
}: {
  label: string;
  sub: string;
  score: number;
  min: number;
  max: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="font-semibold">
          {label}
          <span className="opacity-70 text-sm font-normal ml-2">{sub}</span>
        </span>
        <span className="font-bold text-lg" style={{ color }}>
          {score}
          <span className="text-xs font-normal opacity-60 ml-1">({min}–{max})</span>
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-black/10 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <div className="text-[11px] opacity-60 mt-0.5">全員範圍 {min} – {max}</div>
    </div>
  );
}

export default function PilotTrapWorkshopPage() {
  const [step, setStep] = useState<Step>("intro");
  const [wsName, setWsName] = useState("");
  const [wsDate, setWsDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [rawCodes, setRawCodes] = useState("");

  const team: TeamResult | null = useMemo(() => {
    if (step !== "result") return null;
    return computeTeamResult(parseScoreCodes(rawCodes));
  }, [step, rawCodes]);

  const entries = useMemo(() => parseScoreCodes(rawCodes), [rawCodes]);
  const validCount = entries.length;

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-[#0D2B4E] via-[#0D2B4E] to-[#0A1F3A] text-white">
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        {/* ===== STEP 1: 介紹 ===== */}
        {step === "intro" && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#1A6DB5]/20 border border-[#2EC4B6]/30 rounded-full px-4 py-1.5 mb-6">
              <span className="text-sm text-[#2EC4B6] font-semibold">Agentic HR 診斷工作坊 · 主持人工具</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6">
              一張雷達圖，
              <br />
              看穿整支團隊的
              <span className="text-[#E8912A]"> AI 治理體質</span>
            </h1>
            <p className="text-lg text-[#A0C4E8] max-w-2xl mx-auto mb-8 leading-relaxed">
              工作坊現場，每位成員先完成 25 題個人量表，把結果頁的「分數碼」複製給你。
              你貼進這個頁面，三分鐘得到團隊平均雷達圖、健康分佈與高分歧維度，
              還能直接列印成 A4 診斷報告。
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mb-10">
              {[
                { icon: "✍️", label: "成員各自作答" },
                { icon: "🔢", label: "貼回分數碼" },
                { icon: "📊", label: "自動彙總報告" },
              ].map((f) => (
                <div key={f.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="text-2xl mb-1">{f.icon}</div>
                  <div className="text-sm text-[#A0C4E8]">{f.label}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep("input")}
              className="bg-[#E8912A] hover:bg-[#F0A040] text-[#0D2B4E] font-bold text-lg px-10 py-4 rounded-full transition-colors shadow-lg shadow-[#E8912A]/20"
            >
              開始彙總 →
            </button>
            <p className="text-xs text-[#5A7A9E] mt-6">
              成員請先完成個人診斷：
              <a href="/pilot-trap-scan/" className="text-[#2EC4B6] hover:underline mx-1">
                前往 Pilot Trap 診斷量表 →
              </a>
            </p>
          </div>
        )}

        {/* ===== STEP 2: 貼分數碼 ===== */}
        {step === "input" && (
          <div>
            <h1 className="text-2xl md:text-3xl font-black mb-6">貼上成員的分數碼</h1>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  value={wsName}
                  onChange={(e) => setWsName(e.target.value)}
                  placeholder="工作坊名稱（例：XX 公司 AI 治理工作坊）"
                  className="bg-[#0A1F3A] border border-white/15 rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#5A7A9E] focus:outline-none focus:border-[#2EC4B6]"
                />
                <input
                  value={wsDate}
                  onChange={(e) => setWsDate(e.target.value)}
                  type="date"
                  className="bg-[#0A1F3A] border border-white/15 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#2EC4B6]"
                />
              </div>
              <div>
                <p className="text-sm text-[#A0C4E8] mb-2">
                  貼入成員分數碼（每行一位，格式：<code className="text-[#2EC4B6]">姓名|45,62,38,70,55</code>，姓名可省略）：
                </p>
                <textarea
                  value={rawCodes}
                  onChange={(e) => setRawCodes(e.target.value)}
                  rows={8}
                  placeholder={"張經理|45,62,38,70,55\n李主任|52,58,44,66,61\n王專員|38,70,52,48,57"}
                  className="w-full bg-[#0A1F3A] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-[#5A7A9E] focus:outline-none focus:border-[#2EC4B6] font-mono"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#A0C4E8]">
                  {validCount > 0 ? `✅ 已解析 ${validCount} 位成員` : "尚未解析到有效分數碼"}
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("intro")}
                    className="px-6 py-3 rounded-full border border-white/15 text-[#A0C4E8] hover:bg-white/5 transition-colors"
                  >
                    ← 返回
                  </button>
                  <button
                    onClick={() => validCount > 0 && setStep("result")}
                    disabled={validCount === 0}
                    className="bg-[#E8912A] hover:bg-[#F0A040] text-[#0D2B4E] font-bold px-8 py-3 rounded-full transition-colors shadow-lg shadow-[#E8912A]/20 disabled:opacity-40"
                  >
                    產生團隊報告 →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== STEP 3: 結果（含列印報告區） ===== */}
        {step === "result" && team && (
          <div>
            {/* 螢幕操作列（不列印） */}
            <div className="no-print flex flex-wrap items-center justify-between gap-3 mb-6">
              <button
                onClick={() => setStep("input")}
                className="px-5 py-2.5 rounded-full border border-white/15 text-[#A0C4E8] hover:bg-white/5 transition-colors text-sm"
              >
                ← 回上一步
              </button>
              <button
                onClick={() => window.print()}
                className="bg-[#E8912A] hover:bg-[#F0A040] text-[#0D2B4E] font-bold px-6 py-2.5 rounded-full transition-colors shadow-lg shadow-[#E8912A]/20 text-sm"
              >
                🖨️ 列印 / 存成 PDF 報告
              </button>
            </div>

            {/* ===== 報告區（列印用，A4） ===== */}
            <div className="print-area bg-white text-[#0D2B4E] rounded-2xl p-6 md:p-10">
              {/* 報告 Header */}
              <div className="border-b-2 border-[#1A6DB5] pb-4 mb-6 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#1A6DB5] tracking-widest mb-1">榕耀管顧 RONG RISE CONSULTING</div>
                  <h1 className="text-2xl font-black">Agentic HR 診斷報告</h1>
                </div>
                <div className="text-right text-sm text-[#4A6A8E]">
                  <div className="font-bold text-[#0D2B4E]">{wsName || "AI 治理工作坊"}</div>
                  <div>{wsDate} ｜ 參與 {team.count} 人</div>
                </div>
              </div>

              {/* 總結 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                <div className="border border-[#1A6DB5]/20 rounded-xl p-3 text-center">
                  <div className="text-2xl font-black" style={{ color: LEVEL_META[team.level].color }}>{team.overall}</div>
                  <div className="text-xs text-[#4A6A8E]">整體健康度 / 100</div>
                </div>
                <div className="border border-[#1A6DB5]/20 rounded-xl p-3 text-center">
                  <div className="text-2xl font-black" style={{ color: LEVEL_META[team.level].color }}>{LEVEL_META[team.level].label}</div>
                  <div className="text-xs text-[#4A6A8E]">團隊等級</div>
                </div>
                <div className="border border-[#1A6DB5]/20 rounded-xl p-3 text-center">
                  <div className="text-2xl font-black text-[#E0503A]">{team.pilotRisk}%</div>
                  <div className="text-xs text-[#4A6A8E]">平均陷阱深度</div>
                </div>
                <div className="border border-[#1A6DB5]/20 rounded-xl p-3 text-center">
                  <div className="text-2xl font-black">{team.count}</div>
                  <div className="text-xs text-[#4A6A8E]">參與人數</div>
                </div>
              </div>

              <p className="text-sm text-[#4A6A8E] mb-6 leading-relaxed">
                {LEVEL_META[team.level].desc}
                {team.distribution.red > 0 && ` 其中 ${team.distribution.red} 位成員落在紅燈區，${team.distribution.attention} 位需要注意，${team.distribution.stable} 位體質穩健。`}
              </p>

              {/* 雷達圖 + 維度條 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
                <RadarChart scores={team.avg} />
                <div className="space-y-4">
                  {DIM_LIST.map((d) => (
                    <ScoreBar
                      key={d}
                      label={DIMENSIONS[d].label}
                      sub={DIMENSIONS[d].sub}
                      score={team.avg[d]}
                      min={team.spread[d].min}
                      max={team.spread[d].max}
                      color={DIMENSIONS[d].color}
                    />
                  ))}
                </div>
              </div>

              {/* 分佈 */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {(
                  [
                    { key: "stable" as const, label: "穩健", color: "#2EC4B6" },
                    { key: "attention" as const, label: "注意", color: "#E8912A" },
                    { key: "red" as const, label: "紅燈", color: "#E0503A" },
                  ]
                ).map((s) => (
                  <div key={s.key} className="border border-[#1A6DB5]/20 rounded-xl p-4 text-center">
                    <div className="text-3xl font-black" style={{ color: s.color }}>{team.distribution[s.key]}</div>
                    <div className="text-xs text-[#4A6A8E]">{s.label}人數</div>
                  </div>
                ))}
              </div>

              {/* 解讀與建議 */}
              <div className="mb-8">
                <h2 className="text-lg font-black mb-3 text-[#1A6DB5]">團隊解讀</h2>
                <ul className="space-y-2 text-sm text-[#2A4A6E] leading-relaxed">
                  <li>
                    <span className="font-bold">最弱環節：</span>
                    {DIMENSIONS[team.weakest].label}（平均 {team.avg[team.weakest]}）——團隊的第一優先補強點。
                  </li>
                  {team.lowDimensions.length > 0 && (
                    <li>
                      <span className="font-bold">健康線以下：</span>
                      {team.lowDimensions.map((d) => DIMENSIONS[d].label).join("、")}。
                    </li>
                  )}
                  {team.strongest.length > 0 && (
                    <li>
                      <span className="font-bold">共同強項：</span>
                      {team.strongest.map((d) => DIMENSIONS[d].label).join("、")}——可以當作轉型起點。
                    </li>
                  )}
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-black mb-3 text-[#1A6DB5]">行動建議</h2>
                <ol className="space-y-2.5">
                  {team.advice.map((a, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-[#2A4A6E] leading-relaxed">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-[#1A6DB5]/10 text-[#1A6DB5] font-bold text-xs flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="border-t border-[#1A6DB5]/20 mt-8 pt-4 text-center text-xs text-[#4A6A8E]">
                本報告由榕耀管顧 Pilot Trap 診斷量表（25 題／五維度）工作坊模式自動產生 ·
                方法論對齊 McKinsey《逃離 Pilot 陷阱》（2026）與榕耀治理五檢查實務
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @media print {
          body { background: #fff !important; }
          .no-print { display: none !important; }
          .print-area {
            box-shadow: none !important;
            border-radius: 0 !important;
            padding: 24px !important;
          }
          .radar-label { fill: #0D2B4E !important; }
          .radar-sub { fill: #4A6A8E !important; }
        }
      `}</style>
    </div>
  );
}
