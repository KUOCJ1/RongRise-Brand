"use client";

import { useState, useMemo } from "react";
import {
  generatePath,
  getDeptList,
  getLevelList,
  type DeptKey,
  type LevelKey,
  type SkillPathResult,
} from "@/lib/ai-skill-path";

/* ============================================
   員工 AI 技能路徑圖（Employee AI Skill Path）
   兩步驟：選擇 → 路徑圖
   2026-09-05 小賀開發（B2-6 微型工具）
   方法論：10-20-70 的「人」落地 × 部門角色 × 三級熟度
   漏斗定位：ai-hr-assessment → ai-skill-path → 預約諮詢
   ============================================ */

type Step = "select" | "result";

const DEPTS = getDeptList();
const LEVELS = getLevelList();

export default function AiSkillPathPage() {
  const [step, setStep] = useState<Step>("select");
  const [dept, setDept] = useState<DeptKey | null>(null);
  const [level, setLevel] = useState<LevelKey | null>(null);
  const [copied, setCopied] = useState(false);

  const result: SkillPathResult | null = useMemo(() => {
    if (!dept || !level) return null;
    return generatePath(dept, level);
  }, [dept, level]);

  const handleGenerate = () => {
    if (!dept || !level) return;
    setStep("result");
  };

  const copyPlan = async () => {
    if (!result) return;
    let text = `${result.deptIcon} ${result.dept} — ${result.levelLabel}\n${result.summary}\n\n`;
    for (const phase of result.phases) {
      text += `【${phase.days}】${phase.theme}\n目標：${phase.goal}\n\n`;
      for (const skill of phase.skills) {
        text += `• ${skill.name}：${skill.desc}\n`;
      }
      text += `\n工具：${phase.tools.join("、")}\n`;
      text += `練習：${phase.exercises.join("、")}\n\n`;
    }
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

        {/* ===== STEP 1: SELECT ===== */}
        {step === "select" && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#1A6DB5]/20 border border-[#2EC4B6]/30 rounded-full px-4 py-1.5 mb-6">
              <span className="text-sm text-[#2EC4B6] font-semibold">10-20-70 × 角色化技能養成</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6">
              你的部門<br />
              <span className="text-[#2EC4B6]">90 天 AI 技能路徑</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              AI 轉型的勝負手是「人」。選你的部門和目前 AI 熟度，
              立即獲得專屬的 90 天技能養成計畫——<strong className="text-white">具體到每週做什麼、用什麼工具、練什麼能力</strong>。
            </p>

            {/* Department selection */}
            <div className="max-w-xl mx-auto mb-8">
              <h2 className="text-left text-white/60 text-sm font-semibold mb-3">選擇你的部門</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {DEPTS.map((d) => (
                  <button
                    key={d.key}
                    onClick={() => setDept(d.key)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      dept === d.key
                        ? "bg-[#1A6DB5]/30 border-[#1A6DB5]"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="text-2xl mb-1">{d.info.icon}</div>
                    <div className="text-sm font-semibold text-white/80">{d.info.label.split(" ")[0]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Level selection */}
            <div className="max-w-xl mx-auto mb-10">
              <h2 className="text-left text-white/60 text-sm font-semibold mb-3">選擇你的 AI 熟度</h2>
              <div className="space-y-2">
                {LEVELS.map((l) => (
                  <button
                    key={l.key}
                    onClick={() => setLevel(l.key)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      level === l.key
                        ? "bg-[#1A6DB5]/30 border-[#1A6DB5]"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="text-sm font-bold text-white">{l.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!dept || !level}
              className="bg-[#E8912A] hover:bg-[#F5A623] disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold px-10 py-4 rounded-full text-lg transition-colors shadow-lg"
            >
              生成我的 90 天路徑 →
            </button>
          </div>
        )}

        {/* ===== STEP 2: RESULT ===== */}
        {step === "result" && result && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-[#1A6DB5]/20 border border-[#2EC4B6]/30 rounded-full px-4 py-1.5 mb-6">
                <span className="text-sm text-[#2EC4B6] font-semibold">你的 90 天 AI 技能路徑</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black mb-2">
                {result.deptIcon} {result.dept}
              </h1>
              <p className="text-white/60 text-sm mb-2">{result.levelLabel.split("—")[0].trim()}</p>
              <p className="text-white/70 max-w-xl mx-auto">{result.summary}</p>
            </div>

            {/* Phases */}
            <div className="space-y-6 mb-8">
              {result.phases.map((phase, pi) => (
                <div key={phase.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                  <div className="bg-[#1A6DB5]/20 px-6 py-4 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-[#2EC4B6] font-bold text-sm">{phase.days}</span>
                      <span className="text-white/40 text-xs">Phase {pi + 1}</span>
                    </div>
                    <h2 className="text-xl font-bold text-white mt-1">{phase.theme}</h2>
                    <p className="text-white/60 text-sm mt-1">{phase.goal}</p>
                  </div>
                  <div className="p-6">
                    <h3 className="text-white/60 text-xs font-bold uppercase tracking-wider mb-3">技能項目</h3>
                    <div className="space-y-3 mb-5">
                      {phase.skills.map((skill, si) => (
                        <div key={si} className="flex items-start gap-2">
                          <span className="text-[#2EC4B6] mt-0.5 flex-shrink-0">▸</span>
                          <div>
                            <span className="text-white font-semibold text-sm">{skill.name}</span>
                            <span className="text-white/60 text-sm"> — {skill.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-white/40 text-xs font-semibold">工具：</span>
                      {phase.tools.map((tool, ti) => (
                        <span key={ti} className="text-xs px-2 py-0.5 rounded-full bg-[#1A6DB5]/20 text-[#2EC4B6]">
                          {tool}
                        </span>
                      ))}
                    </div>
                    <div>
                      <span className="text-white/40 text-xs font-semibold">練習：</span>
                      <ul className="list-disc list-inside text-white/60 text-sm mt-1 space-y-1">
                        {phase.exercises.map((ex, ei) => (
                          <li key={ei}>{ex}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Copy button */}
            <div className="text-center mb-6">
              <button
                onClick={copyPlan}
                className="bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm"
              >
                {copied ? "✅ 已複製" : "📋 複製完整計畫"}
              </button>
            </div>

            {/* Lead capture */}
            <div className="bg-white/5 border border-[#E8912A]/30 rounded-xl p-6 mb-8">
              <h3 className="text-white font-bold text-lg mb-2">📩 需要更深入的培訓規劃？</h3>
              <p className="text-white/50 text-sm mb-4">
                這個路徑圖是標準版。我們可以為你的團隊設計客製化 AI 培訓方案，歡迎預約免費諮詢。
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/about/#contact" className="bg-[#E8912A] hover:bg-[#F5A623] text-white font-bold px-8 py-3.5 rounded-full transition-colors">
                  📧 預約免費諮詢
                </a>
                <a href="/ai-hr-assessment" className="bg-[#1A6DB5] hover:bg-[#1A6DB5]/80 text-white font-bold px-8 py-3.5 rounded-full transition-colors">
                  📊 先做 HR AI 化評估
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-white/20 text-xs">
            此路徑基於 10-20-70 投資原則與榕耀管顧 AI 轉型實務經驗設計，僅供參考。
            實際培訓計畫需結合企業具體需求與專業顧問診斷。
          </p>
        </div>
      </div>
    </div>
  );
}