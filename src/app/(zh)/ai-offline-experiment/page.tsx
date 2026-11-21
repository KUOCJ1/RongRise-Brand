"use client";

import { useState, useCallback, useId } from "react";
import Link from "next/link";
import {
  evaluateOfflineExperiment,
  clamp,
  type OfflineExperimentInputs,
  type OfflineExperimentResult,
  type RiskLevel,
} from "@/lib/ai-offline-experiment";
import { withUtmPayload } from "@/lib/utm";

/* ============================================
   AI 轉型離線實驗計算器（B5-3 微型工具）
   方法論：榕耀管顧「人不在的一個月」公開實驗
   實測基線：13 天／169 次服務檢查／7 件錯／每天 37.1 分鐘

   留資規則（與 human-ai-alignment 一致）：
   1. 顯示條件用獨立的 leadEmail 狀態
   2. 先交結果畫面，背景送 fetch，不 await 在切換之前
   3. fetch 包 AbortSignal.timeout(10000)，失敗靜默
   4. company 空著要送「未填寫」
   ============================================ */

type Step = "intro" | "result";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RiskBadge({ level }: { level: RiskLevel }) {
  const colors: Record<RiskLevel, string> = {
    low: "bg-green-500/20 text-green-300 border-green-500/30",
    medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    high: "bg-red-500/20 text-red-300 border-red-500/30",
  };
  const labels: Record<RiskLevel, string> = { low: "低", medium: "中", high: "高" };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${colors[level]}`}>
      {labels[level]}
    </span>
  );
}

function NumberField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  unit,
  hint,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  unit?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-white font-semibold mb-2">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          id={id}
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(clamp(parseInt(e.target.value || "0", 10), min, max))}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:border-accent"
        />
        {unit && <span className="text-white/60 text-sm whitespace-nowrap">{unit}</span>}
      </div>
      {hint && <p className="text-white/50 text-xs mt-1.5 leading-relaxed">{hint}</p>}
    </div>
  );
}


export default function AIOfflineExperimentPage() {
  const [step, setStep] = useState<Step>("intro");

  const [inputs, setInputs] = useState<OfflineExperimentInputs>({
    teamSize: 5,
    aiAgents: 3,
    offlineDays: 7,
    criticalFunctions: 4,
    plannedChecksPerDay: 10,
  });

  const [result, setResult] = useState<OfflineExperimentResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [announcement, setAnnouncement] = useState<string>("AI 轉型離線實驗計算器介紹");

  // 留資
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [leadEmail, setLeadEmail] = useState<string | null>(null);
  const [leadError, setLeadError] = useState<string | null>(null);
  const [leadSubmitting, setLeadSubmitting] = useState(false);

  const baseId = useId();

  const updateInput = useCallback(<K extends keyof OfflineExperimentInputs>(key: K, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }, []);

  const calculate = useCallback(() => {
    const res = evaluateOfflineExperiment(inputs);
    setResult(res);
    setAnnouncement(
      `${res.readinessLabel}，綜合風險${res.overallRiskScore}分，建議每天檢查${res.recommendedChecksPerDay}次，約${res.dailyMinutesNeeded}分鐘，粗估${res.expectedErrors}件錯。`
    );
    setStep("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [inputs]);

  const restart = useCallback(() => {
    setResult(null);
    setLeadEmail(null);
    setLeadError(null);
    setName("");
    setEmail("");
    setCompany("");
    setLeadSubmitting(false);
    setCopied(false);
    setAnnouncement("AI 轉型離線實驗計算器介紹");
    setStep("intro");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const emailIsValid = EMAIL_RE.test(email.trim());

  const submitLead = useCallback(() => {
    if (!result || !emailIsValid || leadSubmitting) return;
    setLeadSubmitting(true);
    try {
      const pending = fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(10000),
        body: JSON.stringify(
          withUtmPayload({
            name: name.trim() || "離線實驗計算器訪客",
            email: email.trim(),
            company: company.trim() || "未填寫",
            industry: "其他／綜合",
            ai_stage:
              result.inputs.aiAgents === 0
                ? "not_started"
                : result.inputs.aiAgents <= 2
                ? "exploring"
                : "piloting",
            challenges: ["離線實驗設計", result.readiness === "ready" ? "ready_to_try" : result.readiness === "conditional" ? "conditional" : "not_ready"],
            message: `團隊 ${result.inputs.teamSize} 人／AI ${result.inputs.aiAgents} 位／離線 ${result.inputs.offlineDays} 天／關鍵業務 ${result.inputs.criticalFunctions} 項；判斷：${result.readinessLabel}（風險 ${result.overallRiskScore}/100）`,
            source: "ai-offline-experiment",
          })
        ),
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
  }, [result, emailIsValid, leadSubmitting, name, email, company]);

  const copyReport = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.reportText);
      setCopied(true);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = result.reportText;
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
    <div className="min-h-[70vh] bg-gradient-to-b from-primary via-primary to-[#0A1F3A] text-white">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <p className="sr-only" aria-live="polite">
          {announcement}
        </p>

        {/* ===== STEP 1：介紹 + 輸入 ===== */}
        {step === "intro" && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-secondary/20 border border-accent/30 rounded-full px-4 py-1.5 mb-6">
                <span className="text-sm text-accent font-semibold">榕耀管顧原創 · 公開實驗方法論</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6">
                離開 13 天，
                <br />
                <span className="text-accent">公司還能跑嗎？</span>
              </h1>
              <p className="text-white/70 text-lg max-w-2xl mx-auto mb-6 leading-relaxed">
                這不是「AI 取代人」的展示，是「人不在時，管理邊界怎麼畫」的計算器。
                以榕耀 13 天公開實驗為基線：
                <strong className="text-white">169 次服務檢查、7 件錯、每天中位數 37.1 分鐘</strong>
                ——輸入你的條件，算出你需要預留多少檢查窗口與風險熱區。
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 text-white/55 text-sm">
                <span className="bg-white/5 border border-white/10 rounded-full px-3 py-1">13 天實測</span>
                <span className="bg-white/5 border border-white/10 rounded-full px-3 py-1">5 個條件</span>
                <span className="bg-white/5 border border-white/10 rounded-full px-3 py-1">即時風險熱區</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-8">
              <h2 className="text-xl font-bold mb-6">輸入你的實驗條件</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <NumberField
                  id={`${baseId}-team`}
                  label="真人團隊人數"
                  value={inputs.teamSize}
                  onChange={(v) => updateInput("teamSize", v)}
                  min={1}
                  max={1000}
                  unit="人"
                  hint="會留守、能幫忙盯 AI 的真人數量。"
                />
                <NumberField
                  id={`${baseId}-ai`}
                  label="AI 員工數"
                  value={inputs.aiAgents}
                  onChange={(v) => updateInput("aiAgents", v)}
                  min={0}
                  max={500}
                  unit="位"
                  hint="離線期間會持續執行的 agent 數量。"
                />
                <NumberField
                  id={`${baseId}-days`}
                  label="預計離線天數"
                  value={inputs.offlineDays}
                  onChange={(v) => updateInput("offlineDays", v)}
                  min={1}
                  max={90}
                  unit="天"
                  hint="你完全不介入或只保留固定檢查窗口的天數。"
                />
                <NumberField
                  id={`${baseId}-functions`}
                  label="關鍵業務數"
                  value={inputs.criticalFunctions}
                  onChange={(v) => updateInput("criticalFunctions", v)}
                  min={1}
                  max={50}
                  unit="項"
                  hint="離線期間不能停的業務流程數量。"
                />
                <NumberField
                  id={`${baseId}-checks`}
                  label="計畫每天檢查幾次"
                  value={inputs.plannedChecksPerDay}
                  onChange={(v) => updateInput("plannedChecksPerDay", v)}
                  min={0}
                  max={1000}
                  unit="次"
                  hint="你或代理人每天願意花的檢查次數。"
                />
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
                <p className="text-white/50 text-xs leading-relaxed">
                  計算只在你的瀏覽器進行；除非你主動留下 Email，否則不會把數據送到伺服器。
                </p>
                <button
                  onClick={calculate}
                  className="bg-tertiary hover:bg-[#F5A623] text-white font-bold px-10 py-4 rounded-full text-lg transition-colors shadow-lg"
                >
                  計算風險與檢查清單 →
                </button>
              </div>
            </div>

            <p className="text-center text-white/55 text-sm leading-relaxed">
              背景閱讀：
              <Link href="/knowledge/human-absent-13-days" className="text-accent hover:text-[#7FE3D8] font-semibold mx-1">
                我不在公司的 13 天
              </Link>
              、
              <Link href="/knowledge/ai-operation-experiment" className="text-accent hover:text-[#7FE3D8] font-semibold mx-1">
                公開實驗起點
              </Link>
            </p>
          </div>
        )}

        {/* ===== STEP 2：結果 ===== */}
        {step === "result" && result && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-secondary/20 border border-accent/30 rounded-full px-4 py-1.5 mb-6">
                <span className="text-sm text-accent font-semibold">離線實驗計算結果</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black mb-4">
                <span
                  className={
                    result.readiness === "ready"
                      ? "text-green-400"
                      : result.readiness === "conditional"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }
                >
                  {result.readinessLabel}
                </span>
              </h1>
              <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">{result.summary}</p>
            </div>

            {/* 關鍵數字 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { n: `${result.recommendedChecksPerDay} 次`, t: "建議每天檢查" },
                { n: `${result.dailyMinutesNeeded} 分`, t: "建議每天預留時間" },
                { n: `${result.totalHoursNeeded < 0.1 ? "<0.1" : result.totalHoursNeeded} 小時`, t: "整趟約需投入" },
                { n: `${result.expectedErrors} 件`, t: "粗估會遇到的錯" },
              ].map((x) => (
                <div key={x.t} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-accent">{x.n}</div>
                  <div className="text-xs text-white/60 mt-1">{x.t}</div>
                </div>
              ))}
            </div>

            {/* 風險熱區 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">風險熱區</h2>
                <span className="text-white/60 text-sm">綜合風險分數 {result.overallRiskScore}/100</span>
              </div>
              <div className="space-y-3">
                {result.riskZones.map((z) => (
                  <div key={z.key} className="flex items-start gap-3 rounded-xl bg-white/5 border border-white/10 p-4">
                    <RiskBadge level={z.level} />
                    <div>
                      <div className="font-semibold text-white/90">{z.label}</div>
                      <p className="text-white/65 text-sm leading-relaxed mt-0.5">{z.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-white/50 text-xs mt-4 leading-relaxed">
                檢查次數、時間、錯誤件數都是以 13 天實測推導的估算，不是承諾。實際數字取決於檢查點設在哪裡。
              </p>
            </div>

            {/* 檢查清單 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
              <h2 className="text-lg font-bold mb-4">離線實驗檢查清單</h2>
              <div className="space-y-6">
                {[
                  { key: "before", label: "出發前" },
                  { key: "during", label: "離線中" },
                  { key: "after", label: "回來後" },
                ].map((phase) => {
                  const items = result.checklist.filter((c) => c.phase === phase.key);
                  if (items.length === 0) return null;
                  return (
                    <div key={phase.key}>
                      <h3 className="text-sm font-bold text-accent mb-2">{phase.label}</h3>
                      <ul className="space-y-2">
                        {items.map((c, i) => (
                          <li key={i} className="flex gap-3 text-white/80 text-sm leading-relaxed">
                            <span className="shrink-0 text-white/40">{i + 1}.</span>
                            {c.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-6 pt-5 border-t border-white/10">
                <button
                  onClick={copyReport}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-colors"
                >
                  {copied ? "✓ 已複製" : "複製完整報告"}
                </button>
                <span className="text-white/55 text-xs">把結果貼給團隊，討論從清單開始</span>
              </div>
            </div>

            {/* 留資 */}
            {leadEmail === null ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitLead();
                }}
                className="bg-gradient-to-br from-secondary/20 to-accent/10 border border-accent/30 rounded-2xl p-6 mb-8"
              >
                <h2 className="text-lg font-bold mb-1">📬 想把公開實驗的做法帶回公司？</h2>
                <p className="text-white/60 text-sm mb-4 leading-relaxed">
                  留下 Email，我會把離線實驗的檢查表、常見錯誤與下一輪改進做法寫進《榕賀觀點》。不留 Email 也看得到完整結果。
                </p>
                <div className="grid sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label htmlFor="aoe-name" className="block text-white/50 text-xs mb-1">
                      姓名（選填）
                    </label>
                    <input
                      id="aoe-name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="怎麼稱呼你"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label htmlFor="aoe-email" className="block text-white/50 text-xs mb-1">
                      Email（必填）
                    </label>
                    <input
                      id="aoe-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      aria-invalid={email.length > 0 && !emailIsValid}
                      aria-describedby={email.length > 0 && !emailIsValid ? "aoe-email-error" : undefined}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>
                {email.length > 0 && !emailIsValid && (
                  <p id="aoe-email-error" role="alert" className="text-red-300 text-xs mb-3">請輸入有效的 Email 格式</p>
                )}
                <div className="mb-3">
                  <label htmlFor="aoe-company" className="block text-white/50 text-xs mb-1">
                    公司名稱（選填）
                  </label>
                  <input
                    id="aoe-company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="公司或單位"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-accent"
                  />
                </div>
                {leadError && <p className="text-red-300 text-sm mb-3">{leadError}</p>}
                <button
                  type="submit"
                  disabled={!emailIsValid || leadSubmitting}
                  className="bg-tertiary hover:bg-[#F5A623] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-full transition-colors"
                >
                  {leadSubmitting ? "送出中..." : "訂閱電子報 →"}
                </button>
                <p className="text-white/60 text-xs mt-3">只寄電子報，隨時可退訂。</p>
              </form>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8" role="status">
                <p className="text-white/60 text-sm leading-relaxed">
                  已收到 {leadEmail}，之後會把離線實驗心得寫進《榕賀觀點》寄到這個信箱（若沒收到，請看垃圾信件匣）。想更快討論你們的實驗設計，直接
                  <Link href="/about/#contact" className="text-accent hover:text-[#7FE3D8] font-semibold ml-1">
                    預約免費諮詢
                  </Link>
                  。
                </p>
              </div>
            )}

            {/* 下一步 CTA */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <h2 className="text-xl font-bold mb-2">下一步</h2>
              <p className="text-white/70 text-sm mb-6 leading-relaxed max-w-xl mx-auto">{result.nextStep}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/human-ai-alignment"
                  className="bg-secondary hover:bg-[#2680CC] text-white font-bold px-8 py-3 rounded-full transition-colors"
                >
                  人機策略對齊度自評 →
                </Link>
                <Link
                  href="/ai-authorization-level"
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-full transition-colors"
                >
                  AI 授權等級測驗 →
                </Link>
                <Link
                  href="/about/#contact"
                  className="text-tertiary hover:text-[#F5A623] font-semibold px-4 py-3 transition-colors"
                >
                  預約免費諮詢 →
                </Link>
              </div>
              <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-white/55 text-xs text-left leading-relaxed">
                  本工具以榕耀管顧 2026-10 公開實驗為基線估算，數字僅供風險討論，不是承諾。
                </p>
                <button
                  onClick={restart}
                  className="text-white/65 hover:text-white text-xs underline underline-offset-4 shrink-0"
                >
                  重新計算
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
