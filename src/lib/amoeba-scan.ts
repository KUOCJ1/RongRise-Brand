/* ============================================
   任務變形蟲盤點器 — 分類引擎
   2026-08-18 小賀開發（P0-2 微型工具）

   設計原則（對齊《任務變形蟲》白皮書）：
   - 透明：所有參數與公式公開，不黑箱
   - 保守：省時估算打 8 折（修錯、監督、維護成本）
   - 零依賴：純規則引擎，不需 LLM API，離線可跑
   - 方法論：任務 = 分析單位（Task Amoeba Model 核心主張）

   分類維度（0-1）：
   - structure  結構化程度（規則明確、流程固定）
   - judgment   專業判斷需求（越高越該留人）
   - dataAccess 資料可取得性（AI 需要餵資料）
   - crossDept  跨部門程度（越高越適合任務小隊）
   - variety    任務多變性（問題跟著變，越高越適合變形蟲）
   ============================================ */

export type Category = "automate" | "collaborate" | "keep";

export interface TaskDef {
  id: string;
  label: string;
  icon: string;
  dept: string;          // 部門
  weeklyHours: number;   // 每週平均耗時（小時）
  structure: number;
  judgment: number;
  dataAccess: number;
  crossDept: number;
  variety: number;
}

export interface CustomTaskInput {
  name: string;
  weeklyHours: number;
}

export interface ScannedTask {
  id: string;              // task id 或 `custom-N`
  label: string;
  icon: string;
  dept: string;
  weeklyHours: number;
  category: Category;
  aiScore: number;         // 0-1 AI 適用分數
  saveRate: number;        // 保守節省率
  weeklySaved: number;     // 每週可節省小時
  monthlySaved: number;    // 每月可節省小時
  amoebaFit: number;       // 變形蟲契合度 0-1
  isCustom: boolean;
}

export interface ScanResult {
  tasks: ScannedTask[];
  totalWeeklyHours: number;   // 盤點總工時
  totalWeeklySaved: number;   // 每週可節省
  totalMonthlySaved: number;  // 每月可節省
  byCategory: Record<Category, { count: number; weeklySaved: number }>;
  amoebaAvg: number;          // 組織變形蟲契合度（跨部門×多變性）
  amoebaLevel: "high" | "medium" | "low";
}

/* ---- 20 個常見任務庫（跨 8 個部門） ---- */
export const TASKS: TaskDef[] = [
  // 行政
  { id: "data_entry",      label: "資料輸入與建檔",       icon: "⌨️", dept: "行政", weeklyHours: 5, structure: 0.95, judgment: 0.15, dataAccess: 0.9,  crossDept: 0.2, variety: 0.1 },
  { id: "email_triage",    label: "電子郵件分類與回覆",     icon: "📧", dept: "行政", weeklyHours: 6, structure: 0.75, judgment: 0.50, dataAccess: 0.85, crossDept: 0.3, variety: 0.4 },
  { id: "meeting_minutes", label: "會議紀錄整理",           icon: "📝", dept: "行政", weeklyHours: 3, structure: 0.80, judgment: 0.35, dataAccess: 0.80, crossDept: 0.5, variety: 0.5 },
  // 業務
  { id: "doc_drafting",    label: "報價單／合約草擬",       icon: "📄", dept: "業務", weeklyHours: 4, structure: 0.70, judgment: 0.45, dataAccess: 0.75, crossDept: 0.3, variety: 0.4 },
  { id: "customer_interview", label: "客戶需求訪談",        icon: "🤝", dept: "業務", weeklyHours: 3, structure: 0.20, judgment: 0.90, dataAccess: 0.40, crossDept: 0.3, variety: 0.7 },
  // 行銷
  { id: "competitive_intel", label: "競品情報蒐集",         icon: "🔍", dept: "行銷", weeklyHours: 3, structure: 0.85, judgment: 0.30, dataAccess: 0.80, crossDept: 0.3, variety: 0.6 },
  { id: "social_scheduling", label: "社群貼文排程",         icon: "📣", dept: "行銷", weeklyHours: 3, structure: 0.85, judgment: 0.40, dataAccess: 0.80, crossDept: 0.2, variety: 0.5 },
  { id: "content_draft",   label: "行銷文案初稿",           icon: "✍️", dept: "行銷", weeklyHours: 4, structure: 0.55, judgment: 0.50, dataAccess: 0.60, crossDept: 0.2, variety: 0.7 },
  // 財務
  { id: "invoice_reconcile", label: "財務對帳",             icon: "🧾", dept: "財務", weeklyHours: 5, structure: 0.90, judgment: 0.30, dataAccess: 0.85, crossDept: 0.2, variety: 0.2 },
  // 人資
  { id: "resume_screen",   label: "履歷初步篩選",           icon: "👥", dept: "人資", weeklyHours: 4, structure: 0.75, judgment: 0.55, dataAccess: 0.70, crossDept: 0.2, variety: 0.4 },
  { id: "training_material", label: "教材／簡報製作",        icon: "📚", dept: "人資", weeklyHours: 3, structure: 0.60, judgment: 0.50, dataAccess: 0.60, crossDept: 0.3, variety: 0.6 },
  // 客服
  { id: "faq_reply",       label: "客服回覆常見問題",       icon: "🎧", dept: "客服", weeklyHours: 8, structure: 0.90, judgment: 0.30, dataAccess: 0.90, crossDept: 0.2, variety: 0.3 },
  // 營運
  { id: "order_processing", label: "訂單處理與退貨",        icon: "🔄", dept: "營運", weeklyHours: 5, structure: 0.85, judgment: 0.35, dataAccess: 0.85, crossDept: 0.5, variety: 0.4 },
  { id: "data_analysis",   label: "數據分析與報表",         icon: "📈", dept: "營運", weeklyHours: 6, structure: 0.70, judgment: 0.55, dataAccess: 0.70, crossDept: 0.4, variety: 0.5 },
  { id: "report_writing",  label: "週報／月報產製",         icon: "📊", dept: "管理", weeklyHours: 4, structure: 0.70, judgment: 0.50, dataAccess: 0.80, crossDept: 0.4, variety: 0.5 },
  // 採購
  { id: "supplier_negotiation", label: "供應商議價",        icon: "🏷️", dept: "採購", weeklyHours: 2, structure: 0.15, judgment: 0.95, dataAccess: 0.40, crossDept: 0.4, variety: 0.5 },
  // 資訊
  { id: "code_dev",        label: "程式撰寫與除錯",         icon: "💻", dept: "資訊", weeklyHours: 10, structure: 0.60, judgment: 0.60, dataAccess: 0.70, crossDept: 0.3, variety: 0.7 },
  // 倉儲
  { id: "inventory_recount", label: "庫存盤點",             icon: "📦", dept: "倉儲", weeklyHours: 3, structure: 0.90, judgment: 0.20, dataAccess: 0.85, crossDept: 0.2, variety: 0.15 },
  // 製造
  { id: "field_maintenance", label: "現場設備巡檢",         icon: "🔧", dept: "製造", weeklyHours: 4, structure: 0.60, judgment: 0.50, dataAccess: 0.50, crossDept: 0.2, variety: 0.3 },
  // 法務
  { id: "compliance_check", label: "法規合規檢查",          icon: "⚖️", dept: "法務", weeklyHours: 3, structure: 0.65, judgment: 0.65, dataAccess: 0.60, crossDept: 0.4, variety: 0.5 },
];

/* ---- 自訂任務關鍵字分類（透明規則，不需 LLM） ---- */
const STRUCTURE_KEYWORDS = [
  "回覆", "輸入", "整理", "轉錄", "分類", "排程", "對帳", "盤點", "建檔", "更新",
  "彙整", "翻譯", "摘要", "寄送", "產生", "生成", "初稿", "檢查", "比對", "貼文",
  "報表", "記錄", "通知", "登錄", "發票", "訂單", "建置", "套版",
];
const JUDGMENT_KEYWORDS = [
  "談判", "協商", "決策", "判斷", "評估", "審核", "簽約", "客訴", "糾紛", "安撫",
  "策略", "創意", "訪談", "開發", "關係", "說服", "提案", "定價", "任用", "裁量",
  "保密", "敏感", "危機", "異議", "客製", "構想",
];
const DATA_KEYWORDS = ["資料", "數據", "表格", "系統", "CRM", "ERP", "Excel", "試算表", "資料庫", "檔案", "文件"];
const CROSS_KEYWORDS = ["跨部門", "協調", "串接", "整合", "流程", "專案", "對接", "窗口", "彙報"];

export function classifyCustomTask(name: string): { structure: number; judgment: number; dataAccess: number; crossDept: number; variety: number } {
  const hit = (words: string[]) => words.some((w) => name.includes(w));
  const count = (words: string[]) => words.filter((w) => name.includes(w)).length;

  const structure = hit(STRUCTURE_KEYWORDS) ? Math.min(0.55 + count(STRUCTURE_KEYWORDS) * 0.1, 0.9) : 0.45;
  const judgment = hit(JUDGMENT_KEYWORDS) ? Math.min(0.55 + count(JUDGMENT_KEYWORDS) * 0.1, 0.9) : 0.5;
  const dataAccess = hit(DATA_KEYWORDS) ? 0.8 : 0.5;
  const crossDept = hit(CROSS_KEYWORDS) ? 0.75 : 0.35;
  const variety = 0.5; // 未知任務採中性預設

  return { structure, judgment, dataAccess, crossDept, variety };
}

/* ---- 分類模型 ---- */
const WEIGHTS = { structure: 0.35, dataAccess: 0.20, judgment: 0.30, repeat: 0.15 };

export function aiScoreOf(t: { structure: number; judgment: number; dataAccess: number; weeklyHours: number }): number {
  const repeatFactor = Math.min(t.weeklyHours / 8, 1); // 每週 >8 小時視為高重複
  return (
    t.structure * WEIGHTS.structure +
    t.dataAccess * WEIGHTS.dataAccess +
    (1 - t.judgment) * WEIGHTS.judgment +
    repeatFactor * WEIGHTS.repeat
  );
}

export function categoryOf(score: number): Category {
  if (score >= 0.68) return "automate";
  if (score >= 0.45) return "collaborate";
  return "keep";
}

/* 保守節省率：automate 60% / collaborate 30% / keep 5%（僅輔助） */
export const SAVE_RATES: Record<Category, number> = { automate: 0.6, collaborate: 0.3, keep: 0.05 };
/* 修正係數 0.8：修錯、監督、維護成本（對齊「效率隱藏」研究：約 4 成省時被修錯吃掉，取更保守） */
const CORRECTION = 0.8;

export function amoebaFitOf(t: { crossDept: number; variety: number }): number {
  return t.crossDept * 0.6 + t.variety * 0.4;
}

export function scanTasks(selectedIds: string[], customs: CustomTaskInput[]): ScanResult {
  const tasks: ScannedTask[] = [];

  for (const id of selectedIds) {
    const def = TASKS.find((t) => t.id === id);
    if (!def) continue;
    tasks.push(scanOne(def.label, def.icon, def.dept, def.weeklyHours, def, false));
  }

  customs.forEach((c, i) => {
    const text = c.name.trim();
    if (!text) return;
    const traits = classifyCustomTask(text);
    const def = { ...traits, weeklyHours: c.weeklyHours };
    tasks.push(scanOne(text, "✨", "自訂", c.weeklyHours, def, true, `custom-${i}`));
  });

  // 依優先級排序：每週可節省小時（越高越優先）
  tasks.sort((a, b) => b.weeklySaved - a.weeklySaved);

  const totalWeeklyHours = tasks.reduce((s, t) => s + t.weeklyHours, 0);
  const totalWeeklySaved = tasks.reduce((s, t) => s + t.weeklySaved, 0);
  const byCategory: ScanResult["byCategory"] = {
    automate: { count: 0, weeklySaved: 0 },
    collaborate: { count: 0, weeklySaved: 0 },
    keep: { count: 0, weeklySaved: 0 },
  };
  for (const t of tasks) {
    byCategory[t.category].count += 1;
    byCategory[t.category].weeklySaved += t.weeklySaved;
  }

  const amoebaAvg = tasks.length > 0 ? tasks.reduce((s, t) => s + t.amoebaFit, 0) / tasks.length : 0;
  const amoebaLevel: ScanResult["amoebaLevel"] = amoebaAvg >= 0.5 ? "high" : amoebaAvg >= 0.33 ? "medium" : "low";

  return {
    tasks,
    totalWeeklyHours,
    totalWeeklySaved: round1(totalWeeklySaved),
    totalMonthlySaved: round1(totalWeeklySaved * 4.33),
    byCategory,
    amoebaAvg: round2(amoebaAvg),
    amoebaLevel,
  };
}

function scanOne(label: string, icon: string, dept: string, weeklyHours: number, traits: { structure: number; judgment: number; dataAccess: number; crossDept: number; variety: number }, isCustom: boolean, customId?: string): ScannedTask {
  const aiScore = aiScoreOf({ ...traits, weeklyHours });
  const category = categoryOf(aiScore);
  const saveRate = SAVE_RATES[category] * CORRECTION;
  const weeklySaved = weeklyHours * saveRate;
  return {
    id: isCustom ? customId || "custom" : label,
    label,
    icon,
    dept,
    weeklyHours,
    category,
    aiScore: round2(aiScore),
    saveRate: round2(saveRate),
    weeklySaved: round1(weeklySaved),
    monthlySaved: round1(weeklySaved * 4.33),
    amoebaFit: round2(amoebaFitOf(traits)),
    isCustom,
  };
}

export const CATEGORY_META: Record<Category, { label: string; badge: string; desc: string }> = {
  automate: {
    label: "適合 AI 自動化",
    badge: "🤖",
    desc: "規則明確、重複性高，AI 可直接完成大部分工作，人只需例外處理。",
  },
  collaborate: {
    label: "人機協作",
    badge: "🤝",
    desc: "需要專業判斷把關，AI 負責初稿與草稿，人負責決策與品質。",
  },
  keep: {
    label: "保留人工",
    badge: "🧑‍💼",
    desc: "高度依賴人際信任、談判與裁量，AI 僅能輔助，不宜自動化。",
  },
};

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
