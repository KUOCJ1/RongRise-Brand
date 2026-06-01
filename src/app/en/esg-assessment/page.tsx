"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { trackEsgAssessmentStart, trackEsgAssessmentComplete } from "@/lib/ga4-events";

/* ============================================
   ESG + AI Transformation Self-Assessment
   5 Dimensions × 5 Questions = 25 Questions
   Personalized recommendations based on score
   ============================================ */

interface Question {
  id: string;
  dimension: string;
  dimensionIcon: string;
  text: string;
}

const QUESTIONS: Question[] = [
  // E - Environmental Protection
  { id: "e1", dimension: "Environmental", dimensionIcon: "🌿", text: "We have inventoried our company's carbon emissions sources (Scope 1, 2, and 3)" },
  { id: "e2", dimension: "Environmental", dimensionIcon: "🌿", text: "We have established specific energy-saving and carbon-reduction targets with action plans" },
  { id: "e3", dimension: "Environmental", dimensionIcon: "🌿", text: "We consider environmental impact in product/service design (life cycle assessment)" },
  { id: "e4", dimension: "Environmental", dimensionIcon: "🌿", text: "We have systematic waste management and resource recycling processes" },
  { id: "e5", dimension: "Environmental", dimensionIcon: "🌿", text: "We regularly track and disclose environmental performance data to stakeholders" },

  // S - Social Responsibility
  { id: "s1", dimension: "Social", dimensionIcon: "👥", text: "We have comprehensive talent development and training programs (including AI literacy)" },
  { id: "s2", dimension: "Social", dimensionIcon: "👥", text: "We value employee welfare, workplace safety, and mental health" },
  { id: "s3", dimension: "Social", dimensionIcon: "👥", text: "We actively participate in community activities or social impact projects" },
  { id: "s4", dimension: "Social", dimensionIcon: "👥", text: "We have fair compensation systems and transparent performance evaluation mechanisms" },
  { id: "s5", dimension: "Social", dimensionIcon: "👥", text: "Our supply chain partners also meet basic social responsibility standards" },

  // G - Corporate Governance
  { id: "g1", dimension: "Governance", dimensionIcon: "🏛️", text: "Our board/management has a clear commitment to ESG sustainability" },
  { id: "g2", dimension: "Governance", dimensionIcon: "🏛️", text: "We have a clear AI governance policy (including usage guidelines and risk management)" },
  { id: "g3", dimension: "Governance", dimensionIcon: "🏛️", text: "We have robust data governance and information security management systems" },
  { id: "g4", dimension: "Governance", dimensionIcon: "🏛️", text: "Our financial and operational information is transparent, with regular reporting to stakeholders" },
  { id: "g5", dimension: "Governance", dimensionIcon: "🏛️", text: "We have a whistleblower mechanism and compliance management system" },

  // AI Transformation Integration
  { id: "a1", dimension: "AI Transformation", dimensionIcon: "🤖", text: "Our management understands AI's impact on the industry and has begun planning implementation" },
  { id: "a2", dimension: "AI Transformation", dimensionIcon: "🤖", text: "Our employees have received basic AI tool usage training" },
  { id: "a3", dimension: "AI Transformation", dimensionIcon: "🤖", text: "We have implemented AI tools in at least one business process (e.g., customer service, document processing)" },
  { id: "a4", dimension: "AI Transformation", dimensionIcon: "🤖", text: "We have standard operating procedures (SOPs) for human-AI collaboration" },
  { id: "a5", dimension: "AI Transformation", dimensionIcon: "🤖", text: "We have AI application effectiveness evaluation and continuous optimization mechanisms" },

  // Sustainability Strategy
  { id: "p1", dimension: "Sustainability Strategy", dimensionIcon: "🎯", text: "We have integrated ESG into our overall corporate strategy (not just for compliance)" },
  { id: "p2", dimension: "Sustainability Strategy", dimensionIcon: "🎯", text: "We have set measurable sustainability goals (including KPIs and timelines)" },
  { id: "p3", dimension: "Sustainability Strategy", dimensionIcon: "🎯", text: "We understand regulatory trends (e.g., carbon fees, sustainability reporting requirements)" },
  { id: "p4", dimension: "Sustainability Strategy", dimensionIcon: "🎯", text: "We have allocated budget and resources for sustainability transformation" },
  { id: "p5", dimension: "Sustainability Strategy", dimensionIcon: "🎯", text: "We actively seek external resources (consultants, incentives, partners) to accelerate transformation" },
];

const ANSWER_OPTIONS = [
  { value: 1, label: "Not at all", emoji: "😕" },
  { value: 2, label: "Just starting", emoji: "🤔" },
  { value: 3, label: "In progress", emoji: "📈" },
  { value: 4, label: "Achieving results", emoji: "✨" },
  { value: 5, label: "Fully mature", emoji: "🏆" },
];

const DIMENSION_ORDER = ["Environmental", "Social", "Governance", "AI Transformation", "Sustainability Strategy"];
const DIMENSION_ICONS: Record<string, string> = {
  "Environmental": "🌿",
  "Social": "👥",
  "Governance": "🏛️",
  "AI Transformation": "🤖",
  "Sustainability Strategy": "🎯",
};

type Answers = Record<string, number>;

export default function EnEsgAssessment() {
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
    if (currentStep < totalQuestions) {
      setTimeout(() => setCurrentStep((s) => s + 1), 300);
    } else {
      setTimeout(() => {
        setCurrentStep(totalQuestions + 1);
        const totalScore = Object.values({ ...answers, [questionId]: value }).reduce((a, b) => a + b, 0);
        const maxScore = totalQuestions * 5;
        const pct = Math.round((totalScore / maxScore) * 100);
        let level = "Beginner";
        if (pct >= 80) level = "Leader";
        else if (pct >= 60) level = "Growth";
        else if (pct >= 40) level = "Developing";
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
    let level = "🚀 Beginner";
    let levelDesc = "You are at the starting point of your sustainability transformation journey. We recommend building awareness and assessing your current status first.";
    if (pct >= 80) { level = "🏆 Leader"; levelDesc = "Your organization has reached an advanced level in ESG sustainability and AI transformation! Continue innovating and become an industry benchmark."; }
    else if (pct >= 60) { level = "📈 Growth"; levelDesc = "You have a solid foundation. We recommend scaling successful experiences and establishing standardized management processes."; }
    else if (pct >= 40) { level = "🌱 Developing"; levelDesc = "You are making progress. We recommend prioritizing talent development and data infrastructure."; }

    return { dimensionScores, totalScore, maxScore, pct, level, levelDesc };
  }, [answers]);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-hero text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <span className="tag bg-white/15 text-white mb-4">Interactive Tool</span>
          <h1 className="heading-hero mt-4 mb-4">ESG + AI Transformation Self-Assessment</h1>
          <p className="text-body-lg text-white/85 max-w-2xl">
            25 quick questions to assess your organization&apos;s maturity in ESG sustainability and AI transformation, with personalized recommendations.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="max-w-[700px] mx-auto">
          {/* Intro */}
          {currentStep === 0 && (
            <div className="text-center py-8">
              <div className="text-6xl mb-6">🌿🤖📊</div>
              <h2 className="heading-section text-dark mb-4">5 Dimensions · 25 Questions · 3 Minutes</h2>
              <div className="grid grid-cols-5 gap-3 mb-8">
                {DIMENSION_ORDER.map((dim) => (
                  <div key={dim} className="text-center p-3 bg-bg-alt rounded-xl">
                    <div className="text-2xl mb-1">{DIMENSION_ICONS[dim]}</div>
                    <div className="text-xs font-medium text-dark">{dim}</div>
                  </div>
                ))}
              </div>
              <div className="bg-bg-alt rounded-xl p-6 mb-8 text-left">
                <h3 className="font-semibold text-dark mb-3">📋 Assessment Instructions</h3>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>• 5 questions per dimension, 25 questions total</li>
                  <li>• Select the option that best matches your organization&apos;s actual situation</li>
                  <li>• Upon completion, you will receive a personalized maturity report and improvement recommendations</li>
                  <li>• Data is used only for this assessment and will not be stored or transmitted</li>
                </ul>
              </div>
              <button onClick={handleStart} className="btn-primary text-lg px-10 py-3">
                Start Assessment →
              </button>
            </div>
          )}

          {/* Questions */}
          {currentQuestion && (
            <div className="py-8">
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-secondary">
                    Question {currentStep} / {totalQuestions}
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

              {/* Question */}
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

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="btn-secondary disabled:opacity-30"
                >
                  ← Previous
                </button>
              </div>
            </div>
          )}

          {/* Results */}
          {currentStep === totalQuestions + 1 && (() => {
            const { dimensionScores, totalScore, maxScore, pct, level, levelDesc } = getResults();
            return (
              <div className="py-8">
                <div className="text-center mb-8">
                  <div className="text-5xl mb-4">{pct >= 60 ? "🎉" : "💪"}</div>
                  <h2 className="heading-section text-dark mb-2">Assessment Complete!</h2>
                  <p className="text-text-secondary">{levelDesc}</p>
                </div>

                {/* Total Score */}
                <div className="bg-gradient-hero rounded-2xl p-6 md:p-8 text-white text-center mb-6">
                  <div className="text-5xl font-bold mb-2">{totalScore}<span className="text-2xl text-white/60">/{maxScore}</span></div>
                  <div className="text-xl font-semibold mb-1">{level}</div>
                  <div className="text-white/70">Overall Maturity {pct}%</div>
                </div>

                {/* Dimension Scores */}
                <div className="bg-white rounded-2xl border border-border p-6 md:p-8 mb-6">
                  <h3 className="heading-subsection text-dark mb-4">Dimension Scores</h3>
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
                  <h3 className="heading-subsection text-dark mb-3">Want to Develop a Customized Transformation Strategy?</h3>
                  <p className="text-text-secondary text-body mb-4">
                    C.J. Kuo offers one-on-one ESG + AI transformation advisory services, providing specific recommendations tailored to your organization.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Link href="/en/about#contact" className="btn-primary">
                      Book a Free Consultation
                    </Link>
                    <Link href="/en/knowledge/sme-esg-guide" className="btn-secondary">
                      ESG Getting Started Guide
                    </Link>
                  </div>
                </div>

                {/* Restart */}
                <div className="text-center">
                  <button onClick={handleRestart} className="btn-ghost text-primary">
                    🔄 Retake Assessment
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
