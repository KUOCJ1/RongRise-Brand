/* ============================================
   AI 轉型離線實驗計算器 — 規則引擎（B5-3 微型工具）
   方法論：榕耀管顧「人不在的一個月」公開實驗（2026-10）
   實測基線：13 天／169 次服務檢查／7 件錯／每天在場時間中位數 37.1 分鐘
   連結資產：/knowledge/ai-operation-experiment、/knowledge/human-absent-13-days

   設計原則：
   - 純函式、零依賴、離線可跑
   - 參數與公式全寫在這裡，不藏
   - 分數保守：寧可預警過度，也不要讓人以為沒風險
   - 檢查清單要明天就能做，不是願景陳述
   ============================================ */

export type RiskLevel = "low" | "medium" | "high";

export interface OfflineExperimentInputs {
  teamSize: number; // 真人團隊人數，至少 1
  aiAgents: number; // AI 員工數，可為 0
  offlineDays: number; // 預計離線天數
  criticalFunctions: number; // 關鍵業務數
  plannedChecksPerDay: number; // 管理者（或代理人）每天打算檢查幾次
}

export interface RiskZone {
  key: string;
  label: string;
  level: RiskLevel;
  detail: string;
}

export interface ChecklistItem {
  phase: "before" | "during" | "after";
  text: string;
}

export interface OfflineExperimentResult {
  // 輸入
  inputs: OfflineExperimentInputs;

  // 檢查需求估算
  recommendedChecksPerDay: number;
  totalRecommendedChecks: number;
  minutesPerCheck: number;
  dailyMinutesNeeded: number;
  totalHoursNeeded: number;

  // 覆蓋率
  plannedCoverageRatio: number; // 0–1+

  // 風險熱區
  riskZones: RiskZone[];
  overallRiskScore: number; // 0–100
  readiness: "ready" | "conditional" | "not_ready";
  readinessLabel: string;

  // 錯誤預估
  expectedErrors: number;

  // 檢查清單
  checklist: ChecklistItem[];

  // 總結與下一步
  summary: string;
  nextStep: string;
  reportText: string;
}

/* ============ 實測基線（來自榕耀公開實驗） ============ */

const BASELINE = {
  days: 13,
  checks: 169,
  errors: 7,
  dailyMinutesMedian: 37.1,
  aiAgents: 6,
  teamSize: 1,
  criticalFunctions: 4,
};

const BASELINE_DAILY_ERRORS = BASELINE.errors / BASELINE.days; // 約 0.54 件/天
const BASELINE_DAILY_CHECKS = Math.round(BASELINE.checks / BASELINE.days); // 13 次/天
const BASELINE_MINUTES_PER_CHECK = BASELINE.dailyMinutesMedian / BASELINE_DAILY_CHECKS; // 約 2.85 分/次
const MAX_DAILY_MINUTES = 180; // 超過 3 小時/天視為規模過大，需分批

/* ============ 評等門檻 ============ */

const RISK_WEIGHTS = {
  check: 35,
  staffing: 25,
  fatigue: 20,
  complexity: 20,
};

const RISK_SCORE: Record<RiskLevel, number> = {
  low: 0,
  medium: 0.55, // 乘以權重後約佔一半
  high: 1,
};

const STAFFING_HIGH_RATIO = 6;

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function clamp(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function classifyCheckRisk(planned: number, recommended: number): RiskLevel {
  const ratio = planned / recommended;
  if (ratio >= 1) return "low";
  if (ratio >= 0.6) return "medium";
  return "high";
}

function classifyStaffingRisk(aiAgents: number, teamSize: number): RiskLevel {
  if (teamSize <= 0) return "high";
  const ratio = aiAgents / teamSize;
  if (ratio <= 1) return "low";
  if (ratio <= STAFFING_HIGH_RATIO) return "medium";
  return "high";
}

function classifyFatigueRisk(days: number): RiskLevel {
  if (days <= 5) return "low";
  if (days <= 13) return "medium";
  return "high";
}

function classifyComplexityRisk(criticalFunctions: number): RiskLevel {
  if (criticalFunctions <= 4) return "low";
  if (criticalFunctions <= 7) return "medium";
  return "high";
}

function riskLabel(level: RiskLevel): string {
  return level === "low" ? "低" : level === "medium" ? "中" : "高";
}

function readinessFromScore(score: number): { readiness: OfflineExperimentResult["readiness"]; label: string } {
  if (score <= 25) return { readiness: "ready", label: "可以試：條件相對可控" };
  if (score <= 55) return { readiness: "conditional", label: "有條件可行：先補完高優先項目" };
  return { readiness: "not_ready", label: "不建議：風險太高，先縮小範圍" };
}

/* ============ 檢查清單模板 ============ */

const BASE_CHECKLIST: ChecklistItem[] = [
  { phase: "before", text: "列出離線期間會繼續運轉的關鍵業務，每條標明負責人與備援人。" },
  { phase: "before", text: "為每個 AI 員工指定一個真人監管人，並把聯絡方式同步給對方。" },
  { phase: "before", text: "把核准權、失敗定義、責任歸屬寫成一頁，註明「誰有權在離線期間改規則」。" },
  { phase: "before", text: "跑一次 24 小時迷你離線：人不回訊息，只保留固定時間檢查，記下哪裡會卡住。" },
  { phase: "during", text: "每天只在固定窗口看檢查通知，不要隨時回應，否則 37 分鐘會被切成碎片。" },
  { phase: "during", text: "每筆錯誤都要記：現象、根因、是誰設錯檢查點、修正後如何驗證。" },
  { phase: "during", text: "如果同一天出現兩筆以上同類型錯誤，暫停該流程並升級給備援人，不要繼續跑。" },
  { phase: "after", text: "回來後第一件事：對照檢查紀錄與錯誤紀錄，更新失敗定義與核准權。" },
  { phase: "after", text: "把這次實驗寫成一頁學習紀錄：哪些檢查是多餘的、哪些檢查放錯位置、下一輪要減少什麼。" },
];

function buildChecklist(riskZones: RiskZone[]): ChecklistItem[] {
  const extra: ChecklistItem[] = [];

  const checkLevel = riskZones.find((z) => z.key === "check")?.level;
  const staffingLevel = riskZones.find((z) => z.key === "staffing")?.level;
  const fatigueLevel = riskZones.find((z) => z.key === "fatigue")?.level;
  const complexityLevel = riskZones.find((z) => z.key === "complexity")?.level;

  if (checkLevel === "high") {
    extra.push({
      phase: "before",
      text: "檢查次數不足：把非關鍵業務的檢查砍掉或合併，直到每日檢查量至少達到建議值的 60%。",
    });
  }

  if (staffingLevel === "high") {
    extra.push({
      phase: "before",
      text: `AI 員工數遠超真人監管：若一人要盯超過 ${STAFFING_HIGH_RATIO} 個 AI 員工，必須補上第二個備援監管人與明確檢查點。`,
    });
  } else if (staffingLevel === "medium") {
    extra.push({
      phase: "before",
      text: `人機比例接近榕耀實驗的 ${BASELINE.teamSize}:${BASELINE.aiAgents} 邊界案例：即使可以跑，也要為每個 AI 員工設定備援人與固定檢查點。`,
    });
  }

  if (fatigueLevel === "high" || fatigueLevel === "medium") {
    extra.push({
      phase: "during",
      text: "離線時間較長：中段安排一次「線上巡檢日」，讓系統與人都有一次校準機會。",
    });
  }

  if (complexityLevel === "high") {
    extra.push({
      phase: "before",
      text: "關鍵業務太多：把這次實驗範圍縮到 3–4 個關鍵業務，其餘改為人工暫停或半自動。",
    });
  }

  const phaseOrder: Record<ChecklistItem["phase"], number> = { before: 0, during: 1, after: 2 };
  return [...BASE_CHECKLIST, ...extra].sort((a, b) => phaseOrder[a.phase] - phaseOrder[b.phase]);
}

/* ============ 主評估函式 ============ */

export function evaluateOfflineExperiment(raw: Partial<OfflineExperimentInputs>): OfflineExperimentResult {
  const inputs: OfflineExperimentInputs = {
    teamSize: clamp(Math.round(raw.teamSize ?? 1), 1, 1000),
    aiAgents: clamp(Math.round(raw.aiAgents ?? 0), 0, 500),
    offlineDays: clamp(Math.round(raw.offlineDays ?? 3), 1, 90),
    criticalFunctions: clamp(Math.round(raw.criticalFunctions ?? 3), 1, 50),
    plannedChecksPerDay: clamp(Math.round(raw.plannedChecksPerDay ?? 0), 0, 1000),
  };

  // 建議檢查次數：每個關鍵業務每天至少 1 次，每多 1 個 AI 員工，每項關鍵業務的建議巡檢量增加 40%
  const aiFactor = 1 + inputs.aiAgents * 0.4;
  const recommendedChecksPerDay = Math.max(1, Math.round(inputs.criticalFunctions * aiFactor));
  const totalRecommendedChecks = recommendedChecksPerDay * inputs.offlineDays;

  const minutesPerCheck = round1(BASELINE_MINUTES_PER_CHECK);
  const dailyMinutesNeeded = Math.round(recommendedChecksPerDay * minutesPerCheck);
  const totalHoursNeeded = round1((dailyMinutesNeeded * inputs.offlineDays) / 60);

  const plannedCoverageRatio = recommendedChecksPerDay > 0 ? inputs.plannedChecksPerDay / recommendedChecksPerDay : 0;

  // 風險熱區
  const checkRisk = classifyCheckRisk(inputs.plannedChecksPerDay, recommendedChecksPerDay);
  const staffingRisk = classifyStaffingRisk(inputs.aiAgents, inputs.teamSize);
  const fatigueRisk = classifyFatigueRisk(inputs.offlineDays);
  const complexityRisk = classifyComplexityRisk(inputs.criticalFunctions);

  const riskZones: RiskZone[] = [
    {
      key: "check",
      label: "檢查覆蓋率",
      level: checkRisk,
      detail:
        checkRisk === "low"
          ? `計畫每天檢查 ${inputs.plannedChecksPerDay} 次，達到/超過建議的 ${recommendedChecksPerDay} 次。`
          : checkRisk === "medium"
          ? `計畫每天檢查 ${inputs.plannedChecksPerDay} 次，約為建議 ${recommendedChecksPerDay} 次的 ${Math.round(
              plannedCoverageRatio * 100
            )}%，能攔大問題但可能漏細節。`
          : `計畫每天只檢查 ${inputs.plannedChecksPerDay} 次，遠低於建議的 ${recommendedChecksPerDay} 次，出錯時難以及時發現。`,
    },
    {
      key: "staffing",
      label: "人機監管比例",
      level: staffingRisk,
      detail:
        staffingRisk === "low"
          ? `每位真人監管的 AI 員工比例可控（${inputs.aiAgents}:${inputs.teamSize}）。`
          : staffingRisk === "medium"
          ? `AI 員工與真人比例為 ${inputs.aiAgents}:${inputs.teamSize}，已超過 2:1，建議補備援監管人或明確檢查點。`
          : `AI 員工與真人比例為 ${inputs.aiAgents}:${inputs.teamSize}，超過 ${STAFFING_HIGH_RATIO}:1 邊界，一個人很難穩定監管。`,
    },
    {
      key: "fatigue",
      label: "離線疲勞",
      level: fatigueRisk,
      detail:
        fatigueRisk === "low"
          ? `離線 ${inputs.offlineDays} 天，時間短，系統與人都還沒進入疲勞區。`
          : fatigueRisk === "medium"
          ? `離線 ${inputs.offlineDays} 天，中段的風險會累積，建議安排一次線上巡檢日。`
          : `離線 ${inputs.offlineDays} 天，時間長到流程與人都可能漂移，需要分段驗證與更頻繁的線上校準。`,
    },
    {
      key: "complexity",
      label: "關鍵業務複雜度",
      level: complexityRisk,
      detail:
        complexityRisk === "low"
          ? `關鍵業務 ${inputs.criticalFunctions} 項，範圍集中，容易追蹤。`
          : complexityRisk === "medium"
          ? `關鍵業務 ${inputs.criticalFunctions} 項，需要把檢查清單按業務分責任到人。`
          : `關鍵業務 ${inputs.criticalFunctions} 項，範圍過廣，建議把這次實驗縮小到 3–4 項。`,
    },
  ];

  // 綜合風險分數
  const overallRiskScore = Math.round(
    RISK_SCORE[checkRisk] * RISK_WEIGHTS.check +
      RISK_SCORE[staffingRisk] * RISK_WEIGHTS.staffing +
      RISK_SCORE[fatigueRisk] * RISK_WEIGHTS.fatigue +
      RISK_SCORE[complexityRisk] * RISK_WEIGHTS.complexity
  );

  let { readiness, label: readinessLabel } = readinessFromScore(overallRiskScore);

  // 任何一個熱區紅燈，至少要降到「有條件可行」；寧可預警過度
  const hasAnyHigh = [checkRisk, staffingRisk, fatigueRisk, complexityRisk].some((l) => l === "high");
  if (readiness === "ready" && hasAnyHigh) {
    readiness = "conditional";
    readinessLabel = "有條件可行：先處理紅燈熱區";
  }

  // 錯誤預估：以實測「每天約發生幾件錯」為基礎，再按風險分數調整；不是「檢查越多錯越多」
  const errorFactor = 1 + overallRiskScore / 200;
  const expectedErrors = Math.max(0, Math.round(BASELINE_DAILY_ERRORS * inputs.offlineDays * errorFactor));

  // 檢查清單
  const checklist = buildChecklist(riskZones);

  // 硬規則：完全不檢查 = 不建議
  const zeroChecks = inputs.plannedChecksPerDay === 0;
  if (zeroChecks) {
    readiness = "not_ready";
    readinessLabel = "不建議：每天至少需要一次檢查";
  }

  // 規模過大護欄：建議檢查量需要花超過 3 小時/天，不適合一次離線
  const tooLarge = dailyMinutesNeeded > MAX_DAILY_MINUTES;
  if (tooLarge) {
    readiness = "not_ready";
    readinessLabel = "不建議：規模過大，需要分批";
  }

  // 總結
  const highZones = riskZones.filter((z) => z.level === "high");
  const mediumZones = riskZones.filter((z) => z.level === "medium");

  let summary: string;
  if (zeroChecks) {
    summary = `計畫每天檢查 0 次，這不是離線實驗，是直接關閉監控。即使其他條件再好，也必須至少安排每天一次固定檢查，否則出錯時沒有人能及時拉回來。`;
  } else if (tooLarge) {
    summary = `按建議檢查量，每天需要花 ${dailyMinutesNeeded} 分鐘做檢查，超過一個人能穩定負擔的上限。這代表一次離線要監管的東西太多，建議先拆分實驗，或削減這次的 AI 員工/關鍵業務範圍。`;
  } else if (readiness === "ready") {
    summary = `以榕耀 13 天公開實驗為基線，這次離線實驗的條件相對可控。建議每天檢查 ${recommendedChecksPerDay} 次、預留約 ${dailyMinutesNeeded} 分鐘的檢查窗口，整趟預計投入 ${totalHoursNeeded} 小時。風險熱區都落在低或中，可以試。`;
  } else if (readiness === "conditional") {
    summary = `這次實驗可以做，但${
      highZones.length > 0
        ? `有 ${highZones.map((z) => z.label).join("、")} 是高風險`
        : `有 ${mediumZones.map((z) => z.label).join("、")} 需要留意`
    }。建議每天檢查 ${recommendedChecksPerDay} 次、預留約 ${dailyMinutesNeeded} 分鐘，整趟約 ${totalHoursNeeded} 小時。先把檢查清單裡的高優先項目做完再出發。`;
  } else {
    const highLabels = highZones.map((z) => z.label);
    const highText = highLabels.length > 1 ? `${highLabels.join("、")}都亮紅燈` : `${highLabels[0]}亮紅燈`;
    summary = `目前條件不建議直接離線。${highText}，貿然執行很可能重演「人不在，但系統每小時都在叫人回來」的狀態。先縮小範圍或補強機制，把風險降到「有條件可行」再試。`;
  }

  // 下一步
  let nextStep: string;
  if (zeroChecks) {
    nextStep = "先從最小可行開始：每天安排 1–2 次固定檢查窗口，並指定誰在什麼時間看。檢查次數不是 0 就是 1，沒有中間狀態。";
  } else if (tooLarge) {
    nextStep = "把這次實驗拆成兩輪，每輪只守 3–4 項關鍵業務，或先減少 AI 員工數量，直到每日檢查時間降到 2 小時內。";
  } else if (readiness === "not_ready") {
    const firstHigh = highZones[0];
    if (firstHigh?.key === "check") {
      nextStep = "先從『把檢查次數拉到建議值的 60% 以上』開始：砍掉非關鍵檢查、合併重複檢查，或縮小這次實驗的範圍。跑一次 24 小時迷你離線驗證是否看得過來。";
    } else if (firstHigh?.key === "staffing") {
      nextStep = `先從「補上第二個備援監管人，或把 AI 員工與真人比例降到 ${STAFFING_HIGH_RATIO}:1 以下」開始，並明確每個 agent 的檢查點。`;
    } else if (firstHigh?.key === "fatigue") {
      nextStep = "先從『縮短這次離線天數，或中段安插一次線上巡檢日』開始，讓系統與人有校準機會。";
    } else if (firstHigh?.key === "complexity") {
      nextStep = "先從『把關鍵業務減到 3–4 項』開始，其餘流程改為人工暫停或半自動，再跑一次計算。";
    } else {
      nextStep = `先從「把關鍵業務減到 3–4 項、AI 員工與真人比例降到 ${STAFFING_HIGH_RATIO}:1 以下」開始，並跑一次 24 小時迷你離線。`;
    }
  } else if (highZones.length > 0 || mediumZones.length > 0) {
    const topZone = highZones[0] || mediumZones[0];
    nextStep = `優先處理「${topZone.label}」：${
      topZone.key === "check"
        ? "調整檢查頻率或縮小範圍"
        : topZone.key === "staffing"
        ? "增加監管人或減少 AI 員工"
        : topZone.key === "fatigue"
        ? "安排中段線上巡檢日"
        : "縮小這次實驗的關鍵業務範圍"
    }，然後再跑一次計算確認分數下降。`;
  } else {
    nextStep = "條件已經夠穩，先跑一次 24 小時迷你離線，記錄檢查時間與錯誤類型，再決定要不要拉長到完整天數。";
  }

  const result: OfflineExperimentResult = {
    inputs,
    recommendedChecksPerDay,
    totalRecommendedChecks,
    minutesPerCheck,
    dailyMinutesNeeded,
    totalHoursNeeded,
    plannedCoverageRatio,
    riskZones,
    overallRiskScore,
    readiness,
    readinessLabel,
    expectedErrors,
    checklist,
    summary,
    nextStep,
    reportText: "",
  };

  result.reportText = buildReportText(result);
  return result;
}

/* ============ 純文字報告（複製用） ============ */

function buildReportText(result: OfflineExperimentResult): string {
  const lines: string[] = [];
  const i = result.inputs;

  lines.push("【AI 轉型離線實驗計算結果】");
  lines.push(`判斷：${result.readinessLabel}（風險分數 ${result.overallRiskScore}/100）`);
  lines.push("");
  lines.push("輸入條件：");
  lines.push(`• 真人團隊：${i.teamSize} 人`);
  lines.push(`• AI 員工：${i.aiAgents} 位`);
  lines.push(`• 預計離線：${i.offlineDays} 天`);
  lines.push(`• 關鍵業務：${i.criticalFunctions} 項`);
  lines.push(`• 計畫每天檢查：${i.plannedChecksPerDay} 次`);
  lines.push("");
  lines.push("檢查需求估算：");
  lines.push(`• 建議每天檢查：${result.recommendedChecksPerDay} 次`);
  lines.push(`• 預計總檢查次數：${result.totalRecommendedChecks} 次`);
  lines.push(`• 每次檢查約：${result.minutesPerCheck} 分鐘（由 37.1 分鐘/13 次推導，非單次實測）`);
  lines.push(`• 每天需預留：${result.dailyMinutesNeeded} 分鐘`);
  lines.push(`• 整趟約需：${result.totalHoursNeeded} 小時`);
  lines.push("");
  lines.push("風險熱區：");
  for (const z of result.riskZones) {
    lines.push(`• ${z.label}：${riskLabel(z.level)} — ${z.detail}`);
  }
  lines.push("");
  lines.push(`錯誤預估（粗估）：以榕耀 13 天實測 ${BASELINE.errors} 件錯、每天約 ${BASELINE_DAILY_ERRORS.toFixed(
    1
  )} 件為基礎，考量這次的天數與風險分數，約會遇到 ${result.expectedErrors} 件錯。實際數字取決於檢查點設在哪裡。`);
  lines.push("");
  lines.push("檢查清單：");
  for (const c of result.checklist) {
    const phase = c.phase === "before" ? "出發前" : c.phase === "during" ? "離線中" : "回來後";
    lines.push(`• [${phase}] ${c.text}`);
  }
  lines.push("");
  lines.push(`總結：${result.summary}`);
  lines.push(`下一步：${result.nextStep}`);
  lines.push("");
  lines.push("—— 榕耀管顧 · 人不在的一個月公開實驗　https://rong-rise.com/ai-offline-experiment/");

  return lines.join("\n");
}
