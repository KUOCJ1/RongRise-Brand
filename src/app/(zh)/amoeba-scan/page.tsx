"use client";

import { useState, useCallback, useMemo } from "react";
import {
  TASKS,
  CATEGORY_META,
  scanTasks,
  type ScanResult,
  type CustomTaskInput,
} from "@/lib/amoeba-scan";

/* ============================================
   任務變形蟲盤點器（Task Amoeba Scanner）
   三步驟：介紹 → 盤點 → 結果
   2026-08-18 小賀開發（P0-2 微型工具）
   方法論對齊《任務變形蟲》白皮書：
   任務 = 分析單位；任務小隊 = 人機組合 + 邊界 + 完成即解散
   ============================================ */

type Step = "intro" | "form" | "result";

export default function AmoebaScanPage() {
  const [step, setStep] = useState<Step>("intro");
  const [selected, setSelected] = useState<string[]>([]);
  const [customName, setCustomName] = useState("");
  const [customHours, setCustomHours] = useState(4);
  const [customs, setCustoms] = useState<CustomTaskInput[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const result: ScanResult | null = useMemo(() => {
    if (step !== "result") return null;
    return scanTasks(selected, customs);
  }, [step, selected, customs]);

  const toggleTask = useCallback((id: string) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }, []);

  const addCustom = useCallback(() => {
    const text = customName.trim();
    if (!text) return;
    setCustoms((c) => [...c, { name: text, weeklyHours: customHours }]);
    setCustomName("");
    setCustomHours(4);
  }, [customName, customHours]);

  const handleSubmit = useCallback(async () => {
    if (selected.length === 0 && customs.length === 0) {
      setSubmitError("請至少勾選或輸入一個任務");
      return;
    }
    setSubmitting(true);
    setSubmitError("");

    // 留資（選填 email；填了才寫入 Newsletter API）
    if (email) {
      try {
        const res = await fetch("/api/newsletter/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name || "任務盤點訪客",
            email,
            company: company || "",
            industry: "其他／綜合",
            ai_stage: "exploring",
            challenges: ["不知道從哪裡開始"],
            message: `來自任務變形蟲盤點器（勾選 ${selected.length} 個常見任務 + ${customs.length} 個自訂任務）`,
            source: "amoeba-scan",
            subscribed_at: new Date().toISOString(),
          }),
        });
        if (!res.ok) throw new Error("subscribe failed");
      } catch {
        // 留資失敗不阻擋結果 — 靜默
      }
    }

    setSubmitting(false);
    setStep("result");
  }, [selected, customs, email, name, company]);

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-[#0D2B4E] via-[#0D2B4E] to-[#0A1F3A] text-white">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        {/* ===== STEP 1: 介紹 ===== */}
        {step === "intro" && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#1A6DB5]/20 border border-[#2EC4B6]/30 rounded-full px-4 py-1.5 mb-6">
              <span className="text-sm text-[#2EC4B6] font-semibold">任務變形蟲 × 企業 AI 實用工具</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6">
              你的工作，
              <br />
              有多少可以<span className="text-[#E8912A]">交給 AI？</span>
            </h1>
            <p className="text-lg md:text-xl text-[#A0C4E8] max-w-2xl mx-auto mb-8 leading-relaxed">
              勾選你的日常工作任務，立即盤點
              <strong className="text-white"> 哪些適合 AI 自動化、哪些該人機協作、哪些必須留給人</strong>。
              三分鐘，算出你的團隊每週能省下多少小時。
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mb-10">
              {[
                { icon: "🧬", label: "任務變形蟲方法論" },
                { icon: "⚖️", label: "透明分類模型" },
                { icon: "⏱️", label: "三分鐘完成盤點" },
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
              開始盤點 →
            </button>
            <p className="text-xs text-[#5A7A9E] mt-6">
              方法論來自榕耀管顧研究專刊
              <a href="https://rong-rise.com/research/task-amoeba/" className="text-[#2EC4B6] hover:underline mx-1">
                《任務變形蟲 Task Amoeba Model》
              </a>
              ——任務跟著問題走，不讓任務跟著組織走。
            </p>
          </div>
        )}

        {/* ===== STEP 2: 盤點 ===== */}
        {step === "form" && (
          <div>
            <button
              onClick={() => setStep("intro")}
              className="text-sm text-[#A0C4E8] hover:text-white mb-6 transition-colors"
            >
              ← 返回
            </button>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">盤點你的任務</h2>
            <p className="text-[#A0C4E8] mb-8">
              勾選團隊常做的任務（可複選），或輸入你自己的工作流程。時數採產業平均，可依實際調整。
            </p>

            {/* 常見任務 */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-[#2EC4B6] mb-3">
                1. 勾選常見任務（可複選）
                <span className="ml-2 text-xs text-[#5A7A9E] font-normal">已選 {selected.length} 項</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {TASKS.map((t) => {
                  const active = selected.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => toggleTask(t.id)}
                      className={`flex items-center gap-3 text-sm px-4 py-3 rounded-lg border transition-all text-left ${
                        active
                          ? "bg-[#1A6DB5]/30 border-[#2EC4B6] text-white font-semibold"
                          : "bg-white/5 border-white/10 text-[#A0C4E8] hover:border-[#1A6DB5]"
                      }`}
                    >
                      <span className="text-xl">{t.icon}</span>
                      <span className="flex-1">
                        <span className="block">{t.label}</span>
                        <span className="block text-xs text-[#5A7A9E] font-normal">
                          {t.dept} · 約 {t.weeklyHours} 小時／週
                        </span>
                      </span>
                      <span
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs ${
                          active ? "bg-[#2EC4B6] border-[#2EC4B6] text-[#0D2B4E]" : "border-[#5A7A9E]"
                        }`}
                      >
                        {active ? "✓" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 自訂任務 */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-[#2EC4B6] mb-3">
                2. 輸入你的其他工作流程（選填）
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="例如：整理客戶回饋並生成月報"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustom();
                    }
                  }}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm placeholder-[#5A7A9E] focus:border-[#2EC4B6] focus:outline-none"
                />
                <input
                  type="number"
                  min={1}
                  max={80}
                  value={customHours}
                  onChange={(e) => setCustomHours(Math.max(1, Number(e.target.value) || 1))}
                  className="w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-sm text-center focus:border-[#2EC4B6] focus:outline-none"
                  title="每週耗時（小時）"
                />
                <span className="text-xs text-[#5A7A9E] self-center whitespace-nowrap">小時／週</span>
                <button
                  onClick={addCustom}
                  disabled={!customName.trim()}
                  className="bg-[#1A6DB5]/30 border border-[#2EC4B6]/50 text-[#2EC4B6] disabled:opacity-40 font-semibold text-sm px-4 py-3 rounded-lg transition-colors hover:bg-[#1A6DB5]/50 whitespace-nowrap"
                >
                  ＋ 加入
                </button>
              </div>
              {customs.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {customs.map((c, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-2 bg-[#1A6DB5]/20 border border-[#1A6DB5]/40 rounded-full px-3 py-1.5 text-sm"
                    >
                      <span>✨ {c.name}</span>
                      <span className="text-xs text-[#5A7A9E]">{c.weeklyHours}h/週</span>
                      <button
                        onClick={() => setCustoms((list) => list.filter((_, j) => j !== i))}
                        className="text-[#5A7A9E] hover:text-red-300 transition-colors"
                        aria-label="移除"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 留資（選填） */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
              <label className="block text-sm font-semibold text-[#2EC4B6] mb-1">
                3. 留下 Email 取得盤點報告（選填）
              </label>
              <p className="text-xs text-[#5A7A9E] mb-4">填寫後可收到完整盤點結果與 AI 轉型週報。</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="姓名"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm placeholder-[#5A7A9E] focus:border-[#2EC4B6] focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm placeholder-[#5A7A9E] focus:border-[#2EC4B6] focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="公司名稱"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm placeholder-[#5A7A9E] focus:border-[#2EC4B6] focus:outline-none"
                />
              </div>
            </div>

            {submitError && (
              <div className="bg-red-500/10 border border-red-400/30 text-red-300 text-sm rounded-lg px-4 py-3 mb-6">
                {submitError}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-[#E8912A] hover:bg-[#F0A040] disabled:opacity-50 text-[#0D2B4E] font-bold text-lg px-8 py-4 rounded-full transition-colors shadow-lg shadow-[#E8912A]/20"
            >
              {submitting ? "盤點中…" : "看看我的任務怎麼分類 →"}
            </button>
          </div>
        )}

        {/* ===== STEP 3: 結果 ===== */}
        {step === "result" && result && (
          <div>
            <button
              onClick={() => setStep("form")}
              className="text-sm text-[#A0C4E8] hover:text-white mb-6 transition-colors"
            >
              ← 重新盤點
            </button>

            {/* 主數字 */}
            <div className="text-center mb-8">
              <p className="text-[#2EC4B6] font-semibold mb-2">
                盤點 {result.tasks.length} 個任務 · 每週 {result.totalWeeklyHours} 小時
              </p>
              <div className="text-5xl md:text-6xl font-black text-[#E8912A] mb-2">
                {result.totalWeeklySaved} 小時
              </div>
              <p className="text-[#A0C4E8] text-lg">每週可節省工時（保守估計）</p>
              <div className="inline-flex items-center gap-2 mt-4 bg-[#2EC4B6]/10 border border-[#2EC4B6]/30 rounded-full px-5 py-2">
                <span className="text-sm text-[#2EC4B6] font-bold">每月約省 {result.totalMonthlySaved} 小時</span>
                <span className="text-[#5A7A9E]">·</span>
                <span className="text-sm text-[#A0C4E8]">相當於 {Math.max(1, Math.round(result.totalWeeklySaved / 40))} 位全職人力</span>
              </div>
            </div>

            {/* 三卡統計 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {(["automate", "collaborate", "keep"] as const).map((cat) => (
                <div key={cat} className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                  <div className="text-2xl mb-2">{CATEGORY_META[cat].badge}</div>
                  <div className="text-xl font-bold text-white mb-1">
                    {result.byCategory[cat].count} 個任務
                  </div>
                  <div className="text-sm text-[#A0C4E8] mb-2">{CATEGORY_META[cat].label}</div>
                  <div className="text-xs text-[#2EC4B6] font-semibold">
                    每週省 {Math.round(result.byCategory[cat].weeklySaved * 10) / 10} 小時
                  </div>
                </div>
              ))}
            </div>

            {/* 任務列表 */}
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-8">
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-bold">任務分類明細（依優先級排序）</h3>
                <span className="text-xs text-[#5A7A9E]">優先級 = 每週可節省時數</span>
              </div>
              <div className="divide-y divide-white/10">
                {result.tasks.map((t) => {
                  const meta = CATEGORY_META[t.category];
                  const catColor =
                    t.category === "automate"
                      ? "bg-[#2EC4B6]/15 border-[#2EC4B6]/40 text-[#2EC4B6]"
                      : t.category === "collaborate"
                        ? "bg-[#1A6DB5]/20 border-[#1A6DB5]/50 text-[#7CB8E8]"
                        : "bg-white/5 border-white/15 text-[#A0C4E8]";
                  return (
                    <div key={t.id} className="px-5 py-4 flex items-center gap-4">
                      <span className="text-2xl w-8 text-center">{t.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">
                          {t.label}
                          {t.isCustom && <span className="text-xs text-[#E8912A] ml-2">自訂</span>}
                        </div>
                        <div className="text-xs text-[#5A7A9E]">
                          {t.dept} · {t.weeklyHours} 小時/週 · AI 適用分 {t.aiScore.toFixed(2)} · 變形蟲契合 {t.amoebaFit.toFixed(2)}
                        </div>
                      </div>
                      <span className={`hidden sm:inline-block text-xs px-3 py-1.5 rounded-full border font-semibold whitespace-nowrap ${catColor}`}>
                        {meta.badge} {meta.label}
                      </span>
                      <div className="text-right shrink-0">
                        <div className="text-[#E8912A] font-bold">−{t.weeklySaved} h</div>
                        <div className="text-xs text-[#5A7A9E]">每週</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 變形蟲契合度 */}
            <div className="bg-[#1A6DB5]/10 border border-[#1A6DB5]/30 rounded-xl p-5 mb-8">
              <h3 className="font-bold mb-3">
                🧬 組織任務型態分析
                <span className="ml-2 text-sm font-normal text-[#A0C4E8]">變形蟲契合度 {result.amoebaAvg.toFixed(2)}</span>
              </h3>
              {result.amoebaLevel === "high" && (
                <p className="text-sm text-[#A0C4E8] leading-relaxed">
                  你的任務高度跨部門且多變——正是《任務變形蟲》白皮書中的
                  <strong className="text-white">高適用區</strong>。建議以「任務小隊」重組分工：明確問題 ＋ 跨部門人機組合 ＋ 三條授權邊界，完成即解散。
                </p>
              )}
              {result.amoebaLevel === "medium" && (
                <p className="text-sm text-[#A0C4E8] leading-relaxed">
                  你的任務混合了固定流程與跨部門問題。可以先從
                  <strong className="text-white">一條跨部門任務鏈</strong>試點任務小隊（例如退貨流程），證明它比部門分工更有效，再逐步擴散。
                </p>
              )}
              {result.amoebaLevel === "low" && (
                <p className="text-sm text-[#A0C4E8] leading-relaxed">
                  你的任務以固定流程為主，科層分工仍然有效——先別急著重組組織。建議先從
                  <strong className="text-white">高重複性任務的 AI 自動化</strong>開始，把省下的人力再投資到更需要判斷的工作。
                </p>
              )}
              <a
                href="https://rong-rise.com/research/task-amoeba/"
                className="inline-block mt-3 text-sm text-[#2EC4B6] hover:underline"
              >
                深入了解任務變形蟲模型 →
              </a>
            </div>

            {/* 免責與 CTA */}
            <div className="bg-[#1A6DB5]/10 border border-[#1A6DB5]/30 rounded-xl p-5 mb-8">
              <p className="text-xs text-[#A0C4E8] leading-relaxed">
                <strong className="text-white">模型說明：</strong>本盤點採透明規則引擎——分類依據結構化程度、判斷需求與資料可取得性；省時估算取
                保守節省率（自動化 60%／協作 30%／人工 5%）並再打 8 折（修錯、監督與維護成本）。
                實際成效會因流程成熟度、資料品質與執行力而異，本結果僅供決策參考。
              </p>
            </div>

            <div className="text-center mb-10">
              <h3 className="text-xl md:text-2xl font-bold mb-3">盤點完了，下一步？</h3>
              <p className="text-[#A0C4E8] mb-6 max-w-xl mx-auto">
                把節省的工時換算成具體投資回報，或預約免費 30 分鐘諮詢，把盤點變成導入藍圖。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/roi-calculator"
                  className="inline-block bg-[#1A6DB5]/20 border border-[#2EC4B6]/50 text-[#2EC4B6] hover:bg-[#1A6DB5]/40 font-bold text-lg px-8 py-4 rounded-full transition-colors"
                >
                  計算 AI 轉型 ROI →
                </a>
                <a
                  href="/about/#contact"
                  className="inline-block bg-[#E8912A] hover:bg-[#F0A040] text-[#0D2B4E] font-bold text-lg px-8 py-4 rounded-full transition-colors shadow-lg shadow-[#E8912A]/20"
                >
                  預約免費諮詢 →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
