/* ============================================
   Pilot Trap 診斷量表 — 分類引擎
   2026-08-20 小賀開發（W3-B1 微型工具）

   方法論（對齊《逃離 Pilot 陷阱》McKinsey 2026）：
   - Pilot Trap：用 low-code 一天架起 agent 卻無人治理，
     舊流程碎片被硬化成 code
   五個維度（0-100，越高越健康）：
   - platform  平台歸屬張力（誰擁有 AI 平台？IT/HR/老闆權力）
   - trust     投資 vs 監視（員工信任界線）
   - apprentice 自動化 vs 加速人（下一代判斷力誰培養）
   - governance 治理成熟度（owner/審計/成本/退役）
   - pilotTrap Pilot Trap 傾向（反向：越高 = 越遠離陷阱）

   設計原則（對齊 amoeba-scan）：
   - 透明：公式與題目公開
   - 零依賴：純規則引擎，離線可跑
   - 25 題 / 每題 0-3 分 / 每維度 5 題
   ============================================ */

export interface Option {
  text: string;
  score: number; // 0-3
}

export interface Question {
  id: string;
  dimension: keyof typeof DIMENSIONS;
  text: string;
  options: Option[];
}

export const DIMENSIONS = {
  platform: { key: "platform", label: "平台歸屬", sub: "誰擁有 AI 平台", color: "#1A6DB5" },
  trust: { key: "trust", label: "員工信任", sub: "投資 vs 監視", color: "#2EC4B6" },
  apprentice: { key: "apprentice", label: "人才培養", sub: "自動化 vs 加速人", color: "#E8912A" },
  governance: { key: "governance", label: "治理成熟", sub: "owner/審計/退役", color: "#7FA6D9" },
  pilotTrap: { key: "pilotTrap", label: "Pilot 陷阱", sub: "鋪路 vs 硬化（反向）", color: "#C0603A" },
} as const;

export type DimensionKey = keyof typeof DIMENSIONS;

export const QUESTIONS: Question[] = [
  // ---- 維度 1：平台歸屬張力 ----
  { id: "p1", dimension: "platform", text: "你們公司的 AI 工具與 agent，主要由誰決定導入？", options: [
    { text: "各部門自行決定，想用就用", score: 0 },
    { text: "老闆或高階主管拍板，沒有固定流程", score: 1 },
    { text: "IT 統一審核，但流程冗長卡關", score: 2 },
    { text: "有明確歸屬單位與跨部門協作機制", score: 3 },
  ]},
  { id: "p2", dimension: "platform", text: "業務或人資部門想導入新的 AI 工具時，流程是？", options: [
    { text: "直接用，事後沒人管", score: 0 },
    { text: "層層請示，等到熱情冷掉", score: 1 },
    { text: "有人可以問，但沒有正式管道", score: 2 },
    { text: "有明確的申請、評估、試行流程", score: 3 },
  ]},
  { id: "p3", dimension: "platform", text: "HR 部門要建 AI 應用（如自動篩履歷、員工問答），誰說了算？", options: [
    { text: "人資自己買，IT 不知情", score: 0 },
    { text: "IT 全權決定，人資只能排隊", score: 1 },
    { text: "兩邊各做各的，互不通氣", score: 2 },
    { text: "人資主導、IT 支援、有共同治理", score: 3 },
  ]},
  { id: "p4", dimension: "platform", text: "你們有沒有正式討論過「AI 平台到底該歸誰管」？", options: [
    { text: "從沒討論過", score: 0 },
    { text: "討論過，沒有結論", score: 1 },
    { text: "有結論，沒有執行", score: 2 },
    { text: "有決策，且定期檢討", score: 3 },
  ]},
  { id: "p5", dimension: "platform", text: "各部門的 AI 應用，彼此之間知道對方在做什麼嗎？", options: [
    { text: "完全不知道，各做各的", score: 0 },
    { text: "偶爾聽到，沒有正式資訊", score: 1 },
    { text: "有清單，但沒人維護", score: 2 },
    { text: "有公開盤點與共享機制", score: 3 },
  ]},

  // ---- 維度 2：投資 vs 監視（員工信任）----
  { id: "t1", dimension: "trust", text: "員工使用 AI 的紀錄，公司會拿來做什麼？", options: [
    { text: "用於稽核員工表現", score: 0 },
    { text: "不定期抽查，員工不知情", score: 1 },
    { text: "用於改善工具，但沒事先說明", score: 2 },
    { text: "用於改善工具，員工全程知情可查", score: 3 },
  ]},
  { id: "t2", dimension: "trust", text: "公司對員工使用 AI 的整體態度是？", options: [
    { text: "禁止為主", score: 0 },
    { text: "放任不管", score: 1 },
    { text: "鼓勵，但沒有規範與訓練", score: 2 },
    { text: "明確政策 + 配套訓練 + 信任為本", score: 3 },
  ]},
  { id: "t3", dimension: "trust", text: "你認為員工相信「公司導入 AI 是為他們好」嗎？", options: [
    { text: "不相信，覺得是在監視", score: 0 },
    { text: "多數觀望", score: 1 },
    { text: "多數相信", score: 2 },
    { text: "相信，且有機制持續維繫", score: 3 },
  ]},
  { id: "t4", dimension: "trust", text: "公司用 AI 做個人化（職涯建議、績效分析）時，員工是否知情？", options: [
    { text: "不知情，資料默默被用", score: 0 },
    { text: "知情，但無法選擇", score: 1 },
    { text: "知情，可以選擇退出", score: 2 },
    { text: "知情、可選擇、有申訴管道", score: 3 },
  ]},
  { id: "t5", dimension: "trust", text: "AI 的決定影響員工（排班、考核、晉升）時，有人為解釋嗎？", options: [
    { text: "沒有，機器說了算", score: 0 },
    { text: "偶爾有", score: 1 },
    { text: "有標準流程", score: 2 },
    { text: "有人為覆核與申訴機制", score: 3 },
  ]},

  // ---- 維度 3：自動化 vs 加速人（學徒制）----
  { id: "a1", dimension: "apprentice", text: "AI 接手例行工作後，新人要怎麼學會這份工作？", options: [
    { text: "沒想過，AI 全做了", score: 0 },
    { text: "靠老員工口頭傳承", score: 1 },
    { text: "有保留部分工作給新人練手", score: 2 },
    { text: "有系統性的學徒路徑設計", score: 3 },
  ]},
  { id: "a2", dimension: "apprentice", text: "你們評估 AI 導入時，會考慮「哪些人類能力因此變得更值錢」嗎？", options: [
    { text: "不會，只看省多少人力", score: 0 },
    { text: "偶爾想到", score: 1 },
    { text: "會考慮", score: 2 },
    { text: "會，而且寫進轉型目標", score: 3 },
  ]},
  { id: "a3", dimension: "apprentice", text: "AI 做出來的成果，員工有機會理解它怎麼做、為什麼這樣做嗎？", options: [
    { text: "沒有，對員工是黑箱", score: 0 },
    { text: "只有少數技術人懂", score: 1 },
    { text: "有分享機制", score: 2 },
    { text: "有系統性的知識轉移", score: 3 },
  ]},
  { id: "a4", dimension: "apprentice", text: "你認為判斷力、教練、關係這些 AI 拿不走的能力，該怎麼培養？", options: [
    { text: "工作久了自然會", score: 0 },
    { text: "沒仔細想過", score: 1 },
    { text: "有在討論", score: 2 },
    { text: "有刻意設計的培養機制", score: 3 },
  ]},
  { id: "a5", dimension: "apprentice", text: "公司會獎勵「人機協作得好」的員工嗎？", options: [
    { text: "沒有這個概念", score: 0 },
    { text: "偶爾會肯定", score: 1 },
    { text: "有，但不固定", score: 2 },
    { text: "是考核與晉升的一部分", score: 3 },
  ]},

  // ---- 維度 4：治理成熟度 ----
  { id: "g1", dimension: "governance", text: "你們的每個 AI 應用或 agent，有明確的負責人嗎？", options: [
    { text: "沒有", score: 0 },
    { text: "少數有", score: 1 },
    { text: "大部分有", score: 2 },
    { text: "全部有，權責清楚", score: 3 },
  ]},
  { id: "g2", dimension: "governance", text: "AI 出錯時，你們查得到它實際做了什麼嗎？", options: [
    { text: "查不到，黑箱", score: 0 },
    { text: "部分可以", score: 1 },
    { text: "大部分可以", score: 2 },
    { text: "完整可審計、可回溯", score: 3 },
  ]},
  { id: "g3", dimension: "governance", text: "你們知道每個 AI 工具每個月花多少錢嗎？", options: [
    { text: "不知道", score: 0 },
    { text: "大概知道", score: 1 },
    { text: "有帳目，沒人定期看", score: 2 },
    { text: "有定期成本盤點", score: 3 },
  ]},
  { id: "g4", dimension: "governance", text: "多久檢討一次「這個 AI 工具還要不要留」？", options: [
    { text: "從沒檢討過", score: 0 },
    { text: "出事才檢討", score: 1 },
    { text: "不定期", score: 2 },
    { text: "定期（每月或每季）", score: 3 },
  ]},
  { id: "g5", dimension: "governance", text: "你們有完整的 AI 應用清單或盤點嗎？", options: [
    { text: "沒有", score: 0 },
    { text: "有，但已經過時", score: 1 },
    { text: "有，且有在更新", score: 2 },
    { text: "有，且與負責人、成本掛鉤", score: 3 },
  ]},

  // ---- 維度 5：Pilot Trap 傾向（反向計分：高 = 遠離陷阱）----
  { id: "f1", dimension: "pilotTrap", text: "你們目前的 AI 應用，多數屬於哪一種？", options: [
    { text: "把現有流程整段自動化（如客服、行政）", score: 0 },
    { text: "優化單一環節的效率", score: 1 },
    { text: "嘗試全新的營運模式", score: 2 },
    { text: "先定義未來藍圖，再倒推該做什麼", score: 3 },
  ]},
  { id: "f2", dimension: "pilotTrap", text: "「AI 轉型最終要長成什麼樣」，你們內部有共識嗎？", options: [
    { text: "沒有，見招拆招", score: 0 },
    { text: "有大概方向，沒寫下來", score: 1 },
    { text: "有明確藍圖", score: 2 },
    { text: "有藍圖，且定期校準", score: 3 },
  ]},
  { id: "f3", dimension: "pilotTrap", text: "員工自己用 low-code 架 agent 的風氣是？", options: [
    { text: "遍地開花，沒人管", score: 0 },
    { text: "有，但沒有規範", score: 1 },
    { text: "受控的試點計畫", score: 2 },
    { text: "在治理框架下的平台", score: 3 },
  ]},
  { id: "f4", dimension: "pilotTrap", text: "你們的 pilot 專案成功之後，通常怎麼處理？", options: [
    { text: "沒想過，一直 pilot", score: 0 },
    { text: "就地擴大規模", score: 1 },
    { text: "先評估是否對齊藍圖再擴大", score: 2 },
    { text: "只擴大對齊藍圖的，其餘關閉", score: 3 },
  ]},
  { id: "f5", dimension: "pilotTrap", text: "過去一年，有沒有「自動化了一個後來被淘汰的流程」的經驗？", options: [
    { text: "沒檢討過這問題", score: 0 },
    { text: "有，但沒有處理", score: 1 },
    { text: "有，且檢討過", score: 2 },
    { text: "有系統性的避免機制", score: 3 },
  ]},
];

export interface PilotTrapResult {
  scores: Record<DimensionKey, number>;   // 0-100，越高越健康
  overall: number;                        // 五維平均
  level: "stable" | "attention" | "red";  // 整體健康等級
  pilotRisk: number;                      // 陷阱深度 0-100（越高越危險）
  lowDimensions: DimensionKey[];          // 低於 60 的維度
  advice: string[];                       // 建議行動
}

const DIMENSION_QUESTIONS = (() => {
  const m: Record<DimensionKey, Question[]> = {
    platform: [], trust: [], apprentice: [], governance: [], pilotTrap: [],
  };
  for (const q of QUESTIONS) m[q.dimension].push(q);
  return m;
})();

function pct(total: number): number {
  return Math.round((total / (QUESTIONS.length / 5) / 3) * 100);
}

export const ADVICE_MAP: Record<DimensionKey, string> = {
  platform: "平台歸屬混亂是 Pilot Trap 的溫床。先指定一個單位對所有 AI 應用負責，並建立跨部門的申請、評估、試行流程。中小企業的關鍵是老闆與人資主管之間，AI 平台的權力歸屬要先講清楚。",
  trust: "員工信任是 agentic 轉型的地基，不是法規問題。停止用 AI 紀錄稽核員工，改為透明揭露：用什麼資料、做什麼決定、誰可以申訴。信任斷裂的補救成本遠高於建立成本。",
  apprentice: "agent 拿走 entry-level 工作後，下一代判斷力不會自己長出來。保留部分例行工作給新人練手，把「教新人判斷」寫進資深員工的考核，是現在就要做的事。",
  governance: "治理成熟度是五關裡最急的。立刻做三件事：每個 AI 應用掛一個負責人、建立可審計的 log、每月盤點一次成本與「還要不要留」。沒有治理，自動化越多，風險越大。",
  pilotTrap: "你們的 pilot 正在硬化舊流程。停下來，先定義 AI 轉型的未來藍圖（North Star），再倒推每個 pilot 該不該存在。持續 pilot 但方向不明，等於在加速走錯路。",
};

export function computeResult(answers: Record<string, number>): PilotTrapResult {
  const scores = {} as Record<DimensionKey, number>;
  for (const dim of Object.keys(DIMENSIONS) as DimensionKey[]) {
    const qs = DIMENSION_QUESTIONS[dim];
    const total = qs.reduce((s, q) => s + (answers[q.id] ?? 0), 0);
    scores[dim] = pct(total);
  }
  const overall = Math.round(
    (scores.platform + scores.trust + scores.apprentice + scores.governance + scores.pilotTrap) / 5
  );
  const pilotRisk = 100 - scores.pilotTrap;
  const lowDimensions = (Object.keys(DIMENSIONS) as DimensionKey[]).filter((d) => scores[d] < 60);
  let level: "stable" | "attention" | "red";
  if (lowDimensions.length === 0 && overall >= 80) level = "stable";
  else if (lowDimensions.length >= 3 || overall < 60) level = "red";
  else level = "attention";
  const advice: string[] = [];
  if (lowDimensions.length === 0) {
    advice.push("五個維度都在健康線以上，你們的 agent 部隊治理已經贏過大多數企業。下一步是維持月檢紀律，並把經驗複製到新導入的 AI 應用。");
  } else {
    for (const d of lowDimensions) advice.push(ADVICE_MAP[d]);
    if (lowDimensions.includes("governance") || lowDimensions.includes("pilotTrap")) {
      advice.push("我們建議先做一次完整的 agent 資產盤點（用治理五檢查），再決定哪些 pilot 該擴大、哪些該關閉。");
    }
  }
  return { scores, overall, level, pilotRisk, lowDimensions, advice };
}
