"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { trackEsgAssessmentStart, trackEsgAssessmentComplete } from "@/lib/ga4-events";

/* ============================================
   ESG 互動式自評量表
   五個維度 × 5 題 = 25 題
   根據得分提供個人化建議
   ============================================ */

interface Question {
  id: string;
  dimension: string;
  dimensionIcon: string;
  text: string;
}

const QUESTIONS: Question[] = [
  // E - 環境保護
  { id: "e1", dimension: "環境保護", dimensionIcon: "🌿", text: "我們盤點過公司的碳排放來源（範疇一、二、三）" },
  { id: "e2", dimension: "環境保護", dimensionIcon: "🌿", text: "我們制定了具體的節能減碳目標與行動計畫" },
  { id: "e3", dimension: "環境保護", dimensionIcon: "🌿", text: "我們在產品/服務設計中考慮了環境影響（生命週期評估）" },
  { id: "e4", dimension: "環境保護", dimensionIcon: "🌿", text: "我們有廢棄物管理與資源回收的制度化流程" },
  { id: "e5", dimension: "環境保護", dimensionIcon: "🌿", text: "我們定期追蹤並向利害關係人揭露環境績效數據" },

  // S - 社會責任
  { id: "s1", dimension: "社會責任", dimensionIcon: "👥", text: "我們有完善的人才發展與培訓制度（含 AI 素養）" },
  { id: "s2", dimension: "社會責任", dimensionIcon: "👥", text: "我們重視員工福利、職場安全與心理健康" },
  { id: "s3", dimension: "社會責任", dimensionIcon: "👥", text: "我們積極參與社區活動或社會公益專案" },
  { id: "s4", dimension: "社會責任", dimensionIcon: "👥", text: "我們有公平的薪酬制度與透明的績效評估機制" },
  { id: "s5", dimension: "社會責任", dimensionIcon: "👥", text: "我們的供應鏈廠商也符合基本的社會責任標準" },

  // G - 公司治理
  { id: "g1", dimension: "公司治理", dimensionIcon: "🏛️", text: "我們的董事會/管理層對 ESG 永續有明確的承諾" },
  { id: "g2", dimension: "公司治理", dimensionIcon: "🏛️", text: "我們有清晰的 AI 治理政策（含使用規範、風險管理）" },
  { id: "g3", dimension: "公司治理", dimensionIcon: "🏛️", text: "我們有完善的数据治理與資安管理制度" },
  { id: "g4", dimension: "公司治理", dimensionIcon: "🏛️", text: "我們的財務與營運資訊透明，定期向股東/利害關係人報告" },
  { id: "g5", dimension: "公司治理", dimensionIcon: "🏛️", text: "我們有舉報機制（吹哨者保護）與合規管理制度" },

  // AI 轉型整合
  { id: "a1", dimension: "AI 轉型", dimensionIcon: "🤖", text: "我們的主管層了解 AI 對產業的影響並開始規劃導入" },
  { id: "a2", dimension: "AI 轉型", dimensionIcon: "🤖", text: "我們的員工受過基本的 AI 工具使用培訓" },
  { id: "a3", dimension: "AI 轉型", dimensionIcon: "🤖", text: "我們已將 AI 工具導入至少一個業務流程（如客服、文件處理）" },
  { id: "a4", dimension: "AI 轉型", dimensionIcon: "🤖", text: "我們有人機協作的標準作業程序（SOP）" },
  { id: "a5", dimension: "AI 轉型", dimensionIcon: "🤖", text: "我們有 AI 應用的成效評估與持續優化機制" },

  // 永續策略
  { id: "p1", dimension: "永續策略", dimensionIcon: "🎯", text: "我們將 ESG 納入公司整體策略規劃（不只是合規）" },
  { id: "p2", dimension: "永續策略", dimensionIcon: "🎯", text: "我們有設定可衡量的永續目標（含 KPI 與時程）" },
  { id: "p3", dimension: "永續策略", dimensionIcon: "🎯", text: "我們了解台灣永續法規趨勢（如碳費、永續報告書要求）" },
  { id: "p4", dimension: "永續策略", dimensionIcon: "🎯", text: "我們有編列永續轉型的預算與資源" },
  { id: "p5", dimension: "永續策略", dimensionIcon: "🎯", text: "我們主動尋求外部資源（顧問、補助、合作夥伴）加速轉型" },
];

const ANSWER_OPTIONS = [
  { value: 1, label: "完全沒有", emoji: "😕" },
  { value: 2, label: "剛開始", emoji: "🤔" },
  { value: 3, label: "進行中", emoji: "📈" },
  { value: 4, label: "已有成果", emoji: "✨" },
  { value: 5, label: "成熟落實", emoji: "🏆" },
];

const DIMENSION_ORDER = ["環境保護", "社會責任", "公司治理", "AI 轉型", "永續策略"];
const DIMENSION_ICONS: Record<string, string> = {
  "環境保護": "🌿",
  "社會責任": "👥",
  "公司治理": "🏛️",
  "AI 轉型": "🤖",
  "永續策略": "🎯",
};

type Answers = Record<string, number>;

export default function EsgAssessment() {
  const [currentStep, setCurrentStep] = useState(0); // 0=intro, 1-25=questions, 26=result
  const [answers, setAnswers] = useState<Answers>({});
  const [started, setStarted] = useState(false);

  const totalQuestions = QUESTIONS.length;
  const currentQuestion = currentStep >= 1 && currentStep <= totalQuestions ? QUESTIONS[currentStep - 1] : null;

  const handleStart = useCallback(() => {
    setCurrentStep(1);
    setStarted(true);
    trackEsgAssessmentStart();
  }, []);

  const handleAnswer = useCallback((questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    // 自動前往下一題
    if (currentStep < totalQuestions) {
      setTimeout(() => setCurrentStep((s) => s + 1), 300);
    } else {
      // 最後一題 → 顯示結果
      setTimeout(() => {
        setCurrentStep(totalQuestions + 1);
        const totalScore = Object.values({ ...answers, [questionId]: value }).reduce((a, b) => a + b, 0);
        const maxScore = totalQuestions * 5;
        const pct = Math.round((totalScore / maxScore) * 100);
        let level = "起步期";
        if (pct >= 80) level = "領導期";
        else if (pct >= 60) level = "成長期";
        else if (pct >= 40) level = "發展期";
        trackEsgAssessmentComplete(totalScore, level);
      }, 300);
    }
  }, [currentStep, totalQuestions, answers]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  const handleRestart = useCallback(() => {
    setCurrentStep(0);
    setAnswers({});
    setStarted(false);
  }, []);

  // 計算結果
  const getResults = useCallback(() => {
    const dimensionScores: Record<string, { total: number; count: number; max: number }> = {};
    for (const dim of DIMENSION_ORDER) {
      dimensionScores[dim] = { total: 0, count: 0, max: 0 };
    }
    for (const q of QUESTIONS) {
      const a = answers[q.id] || 0;
      dimensionScores[q.dimension].total += a;
      dimensionScores[q.dimension].count += 1;
      dimensionScores[q.dimension].max += 5;
    }
    const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
    const maxScore = totalQuestions * 5;
    const pct = Math.round((totalScore / maxScore) * 100);
    let level = "起步期";
    let levelDesc = "您正處於永續轉型的起點，建議從建立認知和盤點現況開始。";
    if (pct >= 80) { level = "🏆 領導期"; levelDesc = "您的企業在 ESG 永續和 AI 轉型方面已達領先水準！持續創新，成為產業標竿。"; }
    else if (pct >= 60) { level = "📈 成長期"; levelDesc = "已有良好基礎，建議擴大成功經驗，建立標準化管理流程。"; }
    else if (pct >= 40) { level = "🌱 發展期"; levelDesc = "正在發展中，建議優先強化人才培訓和數據基礎建設。"; }
    else { level = "🚀 起步期"; levelDesc = "正處於起步階段，建議從 PI-Xun最關鍵的一兩個面向開始突破。"; }

    return { dimensionScores, totalScore, maxScore, pct, level, levelDesc };
  }, [answers]);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-hero text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <span className="tag bg-white/15 text-white mb-4">互動工具</span>
          <h1 className="heading-hero mt-4 mb-4">ESG + AI 轉型自評</h1>
          <p className="text-body-lg text-white/85 max-w-2xl">
            25 題快速評估，了解您的企業在 ESG 永續和 AI 轉型上的成熟度，獲得個人化建議。
          </p>
        </div>
      </section>

      <section className="section">
        <div className="max-w-[700px] mx-auto">
          {/* 介紹頁 */}
          {currentStep === 0 && (
            <div className="text-center py-8">
              <div className="text-6xl mb-6">🌿🤖📊</div>
              <h2 className="heading-section text-dark mb-4">5 大維度 · 25 題 · 3 分鐘</h2>
              <div className="grid grid-cols-5 gap-3 mb-8">
                {DIMENSION_ORDER.map((dim) => (
                  <div key={dim} className="text-center p-3 bg-bg-alt rounded-xl">
                    <div className="text-2xl mb-1">{DIMENSION_ICONS[dim]}</div>
                    <div className="text-xs font-medium text-dark">{dim}</div>
                  </div>
                ))}
              </div>
              <div className="bg-bg-alt rounded-xl p-6 mb-8 text-left">
                <h3 className="font-semibold text-dark mb-3">📋 評估說明</h3>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>• 每個維度 5 題，共 25 題</li>
                  <li>• 根據您企业的實際狀況勾選最符合的選項</li>
                  <li>• 完成後將獲得個人化成熟度報告和改善建議</li>
                  <li>• 數據僅用於本次評估，不會被儲存或傳輸</li>
                </ul>
              </div>
              <button onClick={handleStart} className="btn-primary text-lg px-10 py-3">
                開始評估 →
              </button>
            </div>
          )}

          {/* 題目 */}
          {currentQuestion && (
            <div className="py-8">
              {/* 進度條 */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-secondary">
                    第 {currentStep} / {totalQuestions} 題
                  </span>
                  <span className="text-sm font-medium text-primary">
                    {currentQuestion.dimensionIcon} {currentQuestion.dimension}
                  </span>
                </div>
                <div className="w-full h-2 bg-bg-alt rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              {/* 題目 */}
              <div className="bg-white rounded-2xl border border-border p-6 md:p-8 mb-6">
                <h3 className="heading-subsection text-dark mb-6 leading-relaxed">
                  {currentQuestion.text}
                </h3>
                <div className="space-y-3">
                  {ANSWER_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleAnswer(currentQuestion.id, opt.value)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all hover:border-primary hover:bg-primary/5 ${
                        answers[currentQuestion.id] === opt.value
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                    >
                      <span className="text-2xl w-10 text-center">{opt.emoji}</span>
                      <span className="text-left font-medium text-dark">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 導航 */}
              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="btn-secondary disabled:opacity-30"
                >
                  ← 上一題
                </button>
              </div>
            </div>
          )}

          {/* 結果 */}
          {currentStep === totalQuestions + 1 && (() => {
            const { dimensionScores, totalScore, maxScore, pct, level, levelDesc } = getResults();
            return (
              <div className="py-8">
                <div className="text-center mb-8">
                  <div className="text-5xl mb-4">{pct >= 60 ? "🎉" : "💪"}</div>
                  <h2 className="heading-section text-dark mb-2">評估完成！</h2>
                  <p className="text-text-secondary">{levelDesc}</p>
                </div>

                {/* 總分 */}
                <div className="bg-gradient-hero rounded-2xl p-6 md:p-8 text-white text-center mb-6">
                  <div className="text-5xl font-bold mb-2">{totalScore}<span className="text-2xl text-white/60">/{maxScore}</span></div>
                  <div className="text-xl font-semibold mb-1">{level}</div>
                  <div className="text-white/70">綜合成熟度 {pct}%</div>
                </div>

                {/* 各維度得分 */}
                <div className="bg-white rounded-2xl border border-border p-6 md:p-8 mb-6">
                  <h3 className="heading-subsection text-dark mb-4">各維度得分</h3>
                  <div className="space-y-4">
                    {DIMENSION_ORDER.map((dim) => {
                      const ds = dimensionScores[dim];
                      const pct = ds.max > 0 ? Math.round((ds.total / ds.max) * 100) : 0;
                      return (
                        <div key={dim}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-dark">
                              {DIMENSION_ICONS[dim]} {dim}
                            </span>
                            <span className="text-sm text-text-secondary">{ds.total}/{ds.max} ({pct}%)</span>
                          </div>
                          <div className="w-full h-2 bg-bg-alt rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: pct >= 60 ? "#2EC4B6" : pct >= 40 ? "#E8912A" : "#0D2B4E",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-bg-alt rounded-2xl p-6 md:p-8 text-center mb-6">
                  <h3 className="heading-subsection text-dark mb-3">想要制定專屬的轉型策略？</h3>
                  <p className="text-text-secondary text-body mb-4">
                    C.J. Kuo 老師提供一對一 ESG + AI 轉型顧問服務，針對您的企業現況提供具體建議。
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Link href="/about#contact" className="btn-primary">
                      預約免費諮詢
                    </Link>
                    <Link href="/knowledge/sme-esg-guide" className="btn-secondary">
                      ESG 入門攻略
                    </Link>
                  </div>
                </div>

                {/* 重新評估 */}
                <div className="text-center">
                  <button onClick={handleRestart} className="btn-ghost text-primary">
                    🔄 重新評估
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </section>
    </>
  );
}
