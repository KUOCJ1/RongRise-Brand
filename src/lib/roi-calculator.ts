/* ============================================
   AI 轉型 ROI 估算器 — 計算引擎
   透明、保守、可辯護的估算模型
   2026-08-15 小賀開發

   模型設計原則：
   - 保守：實際節省率取 30%（低於業界宣稱）
   - 漸進採用：第一年 30% → 第二年 60% → 第三年 80%
   - 產業差異：依 McKinsey 研究調整 AI 可自動化工作比例
   ============================================ */

export interface RoiInput {
  industry: string;        // industry key
  employees: number;       // 員工人數
  scope: string[];         // 導入範圍 keys
  email?: string;          // 留資（選填）
  name?: string;
  company?: string;
}

export interface RoiResult {
  // 每年明細
  yearly: {
    year: number;
    benefit: number;   // 年度效益（節省金額）
    cost: number;      // 年度成本
    net: number;       // 淨效益
  }[];
  // 總計
  totalBenefit: number;  // 3 年總效益
  totalCost: number;     // 3 年總成本
  netBenefit: number;    // 3 年淨效益
  roi: number;           // 3 年 ROI（倍數，如 2.5 = 250%）
  paybackMonths: number; // 回收期（月）
  // 明細
  hoursSavedPerYear: number;   // 每年節省工時
  staffEquivalent: number;     // 相當於幾位全職人力
  monthlySubscriptionPerSeat: number;
  oneTimeCost: number;         // 一次性成本
  annualSubscription: number;  // 每年訂閱總額
}

/* ---- 產業參數：AI 可自動化工作的比例（參考 McKinsey 研究） ---- */
export const INDUSTRIES: Record<string, { label: string; autoRatio: number; salary: number }> = {
  manufacturing:  { label: "製造業",           autoRatio: 0.35, salary: 52000 },
  retail:        { label: "零售／批發",        autoRatio: 0.45, salary: 42000 },
  finance:       { label: "金融／保險",        autoRatio: 0.55, salary: 65000 },
  healthcare:    { label: "醫療／健康產業",    autoRatio: 0.35, salary: 60000 },
  professional:  { label: "專業服務（顧問／法律／會計）", autoRatio: 0.50, salary: 68000 },
  education:     { label: "教育／培訓",        autoRatio: 0.40, salary: 50000 },
  logistics:     { label: "物流／倉儲",        autoRatio: 0.40, salary: 42000 },
  general:       { label: "其他／綜合",        autoRatio: 0.40, salary: 48000 },
};

/* ---- 導入範圍：佔員工工時比例 ---- */
export const SCOPES: Record<string, { label: string; icon: string; workRatio: number; saveRatio: number }> = {
  customer_service: { label: "客服與客戶支援", icon: "🎧", workRatio: 0.15, saveRatio: 0.35 },
  document:         { label: "文件處理與行政", icon: "📄", workRatio: 0.12, saveRatio: 0.40 },
  marketing:        { label: "行銷與內容產製", icon: "📣", workRatio: 0.10, saveRatio: 0.30 },
  data_analysis:    { label: "數據分析與報表", icon: "📊", workRatio: 0.08, saveRatio: 0.35 },
  supply_chain:     { label: "供應鏈與庫存管理", icon: "📦", workRatio: 0.15, saveRatio: 0.25 },
  hr:               { label: "人資與招募",      icon: "👥", workRatio: 0.08, saveRatio: 0.30 },
  integrated:       { label: "多領域整合導入",  icon: "🧩", workRatio: 0.35, saveRatio: 0.30 },
};

/* ---- 成本參數 ---- */
export const COST_PARAMS = {
  monthlySubscriptionPerSeat: 1200, // 每人每月 AI 工具訂閱（企業級）
  trainingPerPerson: 3000,          // 每人培訓成本（一次性）
  implementationBase: 150000,       // 一次性導入顧問費（基礎）
  implementationPerEmployee: 300,   // 每員工增加導入費
};

/* ---- 漸進採用率 ---- */
const ADOPTION_RATES = [0.30, 0.60, 0.80]; // 第 1/2/3 年

export function calculateRoi(input: RoiInput): RoiResult {
  const ind = INDUSTRIES[input.industry] || INDUSTRIES.general;

  // 有效員工數（未填 email 視為匿名瀏覽，仍可算）
  const employees = Math.max(input.employees, 20);

  // 年薪（含勞健保等約 1.14 倍）
  const annualSalary = ind.salary * 13.5 * 1.14;

  // 加權工作比例：取所有勾選範圍的 workRatio 加總，封頂 0.5
  const totalWorkRatio = Math.min(
    input.scope.reduce((sum, s) => sum + (SCOPES[s]?.workRatio || 0), 0),
    0.5
  );

  // 平均節省率（依範圍加權）
  const weightedSaveRatio =
    input.scope.reduce((sum, s) => sum + (SCOPES[s]?.workRatio || 0) * (SCOPES[s]?.saveRatio || 0.3), 0) /
    Math.max(input.scope.reduce((sum, s) => sum + (SCOPES[s]?.workRatio || 0), 0), 0.01);

  // 保守實際節省率：產業自動化比例 × 範圍加權 × 基礎節省 0.3（低於業界宣稱）
  const effectiveSave = ind.autoRatio * totalWorkRatio * weightedSaveRatio;

  // 每年節省工時（全職 2080 小時/年）
  const hoursSavedPerYear = Math.round(employees * 2080 * effectiveSave);
  const staffEquivalent = hoursSavedPerYear / 2080;

  // 年度效益（只算 70% 節省為實際回收，其餘是再投資時間）
  const annualBenefitFull = hoursSavedPerYear * (annualSalary / 2080) * 0.7;

  // 訂閱成本：受影響人數（範圍內員工）
  const affectedEmployees = Math.round(employees * totalWorkRatio);
  const annualSubscription = affectedEmployees * COST_PARAMS.monthlySubscriptionPerSeat * 12;

  // 一次性成本：導入顧問費 + 培訓
  const oneTimeCost =
    COST_PARAMS.implementationBase +
    COST_PARAMS.implementationPerEmployee * employees +
    COST_PARAMS.trainingPerPerson * affectedEmployees;

  // 逐年計算（漸進採用）
  const yearly = ADOPTION_RATES.map((adopt, i) => {
    const year = i + 1;
    const benefit = annualBenefitFull * adopt;
    const cost = annualSubscription + (i === 0 ? oneTimeCost : 0);
    return { year, benefit: Math.round(benefit), cost: Math.round(cost), net: Math.round(benefit - cost) };
  });

  const totalBenefit = yearly.reduce((s, y) => s + y.benefit, 0);
  const totalCost = yearly.reduce((s, y) => s + y.cost, 0);
  const netBenefit = totalBenefit - totalCost;
  const roi = totalCost > 0 ? netBenefit / totalCost : 0;

  // 回收期（月）：累計淨現金流轉正的月份
  let paybackMonths = 0;
  let cum = 0;
  for (const y of yearly) {
    const monthlyNet = y.net / 12;
    if (cum + y.net >= 0) {
      paybackMonths = (y.year - 1) * 12 + Math.ceil(-cum / monthlyNet);
      break;
    }
    cum += y.net;
    paybackMonths = y.year * 12;
  }
  if (netBenefit < 0) paybackMonths = 0; // 沒回收

  return {
    yearly,
    totalBenefit,
    totalCost,
    netBenefit,
    roi,
    paybackMonths,
    hoursSavedPerYear,
    staffEquivalent,
    monthlySubscriptionPerSeat: COST_PARAMS.monthlySubscriptionPerSeat,
    oneTimeCost,
    annualSubscription,
  };
}

/* ---- 數字格式化 ---- */
export function formatNt(value: number): string {
  if (value >= 100000000) return (value / 100000000).toFixed(1) + " 億";
  if (value >= 10000) return (value / 10000).toFixed(0) + " 萬";
  return value.toLocaleString("zh-TW");
}

export function formatRoi(roi: number): string {
  return (roi * 100).toFixed(0) + "%";
}
