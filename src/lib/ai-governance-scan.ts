/* ============================================
   AI 治理五檢查自評 — 規則引擎（B2-3 微型工具）
   2026-09-08 小賀開發（第二批 B2-3）

   方法論基礎：
   - 榕耀管顧「治理五檢查」框架：人、流程、資料、技術、文化
   - CJ哥 31 agent 治理實戰經驗
   - McKinsey《Your AI Agents Need Performance Management Too》(2026.08)
   - 與 pilot-trap-scan 互補：後者測點卡關，前者測治理體質

   設計原則（與 ai-hr-assessment / ai-skill-path 一致）：
   - 透明：參數與規則公開，不黑箱
   - 保守：分數如實反映，不吹牛
   - 零依賴：純規則引擎，無 LLM API，離線可跑
   ============================================ */

export type DimKey = "people" | "process" | "data" | "tech" | "culture";

export interface Question {
  id: string;
  text: string;
  options: { value: number; label: string }[];
}

export interface Dimension {
  key: DimKey;
  label: string;
  icon: string;
  description: string;
  questions: Question[];
}

export interface DimResult {
  key: DimKey;
  label: string;
  icon: string;
  score: number; // 1-5
  pct: number; // 0-100
  level: "起步期" | "形成期" | "發展期" | "成熟期" | "標竿期";
  status: "紅燈" | "黃燈" | "綠燈";
}

export interface ScanResult {
  dimensions: DimResult[];
  overallScore: number;
  overallLevel: string;
  redCount: number;
  yellowCount: number;
  greenCount: number;
  hasRisk: boolean;
  strengths: string[];
  risks: { dim: string; score: number; level: string }[];
  recommendations: { dim: string; text: string; priority: "high" | "medium" | "low" }[];
  summary: string;
}

/* ============ 五大維度定義 ============ */

const DIMENSIONS: Dimension[] = [
  {
    key: "people",
    label: "人",
    icon: "👥",
    description: "AI 治理的人才配置、角色分工與員工素養",
    questions: [
      {
        id: "p1",
        text: "我們有明確的 AI 治理負責人（或團隊）統籌 AI 導入與管理",
        options: [
          { value: 1, label: "沒有，各部門各自為政" },
          { value: 2, label: "有高層口頭支持，但無正式負責人" },
          { value: 3, label: "有指定負責人，但權責模糊" },
          { value: 4, label: "有專責團隊，權責明確" },
          { value: 5, label: "治理團隊運作成熟，定期向董事會報告" },
        ],
      },
      {
        id: "p2",
        text: "我們定期為員工提供 AI 素養與治理相關培訓",
        options: [
          { value: 1, label: "沒有相關培訓" },
          { value: 2, label: "有零星講座，無系統規劃" },
          { value: 3, label: "有定期 AI 培訓課程" },
          { value: 4, label: "各部門有專屬 AI 應用培訓" },
          { value: 5, label: "AI 素養是核心職能，列入晉升評核" },
        ],
      },
      {
        id: "p3",
        text: "各部門有指定 AI 推廣大使或種子人員",
        options: [
          { value: 1, label: "沒有" },
          { value: 2, label: "有少數自發性的 AI 愛好者" },
          { value: 3, label: "部分部門有種子人員" },
          { value: 4, label: "多數部門有指定 AI 大使" },
          { value: 5, label: "AI 大使制度完善，定期交流與回報" },
        ],
      },
      {
        id: "p4",
        text: "我們有系統化的 AI 人才盤點與技能發展計畫",
        options: [
          { value: 1, label: "沒有" },
          { value: 2, label: "主管主觀判斷員工 AI 能力" },
          { value: 3, label: "有年度技能盤點，含 AI 能力" },
          { value: 4, label: "AI 技能盤點制度化，銜接培訓規劃" },
          { value: 5, label: "AI 人才地圖即時更新，驅動招募與發展策略" },
        ],
      },
    ],
  },
  {
    key: "process",
    label: "流程",
    icon: "📋",
    description: "AI 導入流程、治理機制與決策審核",
    questions: [
      {
        id: "pr1",
        text: "我們有正式的 AI 專案導入流程（含評估、試點、驗證、規模化）",
        options: [
          { value: 1, label: "沒有，各部門自己決定" },
          { value: 2, label: "有粗略概念，無正式文件" },
          { value: 3, label: "有流程文件，但未嚴格執行" },
          { value: 4, label: "流程標準化，多數專案依循" },
          { value: 5, label: "流程制度化，有階段性驗證門檻與回退機制" },
        ],
      },
      {
        id: "pr2",
        text: "我們有 AI 使用規範或治理政策文件",
        options: [
          { value: 1, label: "沒有" },
          { value: 2, label: "有口頭約定，無正式文件" },
          { value: 3, label: "有初步規範，但涵蓋範圍有限" },
          { value: 4, label: "有完整政策文件，員工可查閱" },
          { value: 5, label: "政策定期更新，有違規通報與處理機制" },
        ],
      },
      {
        id: "pr3",
        text: "我們有 AI 專案的定期審查與績效追蹤機制",
        options: [
          { value: 1, label: "沒有" },
          { value: 2, label: "專案結束後有一次檢討" },
          { value: 3, label: "有定期進度報告，但無標準格式" },
          { value: 4, label: "有標準化審查流程與 KPI 追蹤" },
          { value: 5, label: "審查機制包含技術、業務、風險三維評估" },
        ],
      },
      {
        id: "pr4",
        text: "我們有 AI 供應商與工具評估的標準流程",
        options: [
          { value: 1, label: "沒有，各部門自行採購" },
          { value: 2, label: "有採購審核，但無 AI 專用評估標準" },
          { value: 3, label: "有基本的 AI 工具評估清單" },
          { value: 4, label: "評估流程含安全、合規、整合性審查" },
          { value: 5, label: "評估標準制度化，含 POC 驗證門檻與供應商評比" },
        ],
      },
    ],
  },
  {
    key: "data",
    label: "資料",
    icon: "📊",
    description: "AI 資料治理、品質管理與安全隱私",
    questions: [
      {
        id: "d1",
        text: "我們有資料分類分級制度，明確哪些資料可用於 AI",
        options: [
          { value: 1, label: "沒有" },
          { value: 2, label: "有概念但無正式分類" },
          { value: 3, label: "有基本分類（公開/內部/機密）" },
          { value: 4, label: "分類細緻，含 AI 適用性標記" },
          { value: 5, label: "資料分類自動化，與 AI 授權管理連動" },
        ],
      },
      {
        id: "d2",
        text: "我們有資料品質管理機制（含清洗、標註、驗證）",
        options: [
          { value: 1, label: "沒有系統化機制" },
          { value: 2, label: "專案層級手動處理" },
          { value: 3, label: "有基本資料品質檢查流程" },
          { value: 4, label: "資料品質監控自動化，定期報表" },
          { value: 5, label: "資料品質是 AI 專案的前置門檻，不合格不啟動" },
        ],
      },
      {
        id: "d3",
        text: "我們有 AI 資料安全與隱私保護措施（如去識別化、存取控制）",
        options: [
          { value: 1, label: "沒有" },
          { value: 2, label: "有基本存取控制，但無 AI 專用措施" },
          { value: 3, label: "部分資料送入 AI 前做去識別化" },
          { value: 4, label: "去識別化與存取控制是標準流程" },
          { value: 5, label: "資料安全措施定期審查，含隱私衝擊評估" },
        ],
      },
      {
        id: "d4",
        text: "我們有跨系統資料整合與治理規範",
        options: [
          { value: 1, label: "各系統資料各自獨立" },
          { value: 2, label: "部分系統有手動資料交換" },
          { value: 3, label: "有資料整合平台，但無統一治理" },
          { value: 4, label: "有資料治理委員會與整合標準" },
          { value: 5, label: "資料治理驅動 AI 數據供應鏈，自動化整合" },
        ],
      },
    ],
  },
  {
    key: "tech",
    label: "技術",
    icon: "⚙️",
    description: "AI 技術架構、工具管理與系統整合",
    questions: [
      {
        id: "t1",
        text: "我們有統一的 AI 技術架構或平台策略",
        options: [
          { value: 1, label: "沒有，各部門各買各的" },
          { value: 2, label: "有技術偏好但無強制" },
          { value: 3, label: "有建議的技術棧與平台" },
          { value: 4, label: "有統一的 AI 平台與架構標準" },
          { value: 5, label: "架構策略定期檢討，含汰換與升級機制" },
        ],
      },
      {
        id: "t2",
        text: "我們有 AI 模型選型、測試與部署標準流程",
        options: [
          { value: 1, label: "沒有" },
          { value: 2, label: "開發者自行決定" },
          { value: 3, label: "有基本評估流程" },
          { value: 4, label: "選型與測試標準化，含效能與安全測試" },
          { value: 5, label: "CI/CD 管線整合 AI 模型部署，有自動化測試" },
        ],
      },
      {
        id: "t3",
        text: "我們有 AI 系統的監控、日誌與可追溯機制",
        options: [
          { value: 1, label: "沒有" },
          { value: 2, label: "有基本日誌，但無系統化監控" },
          { value: 3, label: "有監控機制，能追蹤主要指標" },
          { value: 4, label: "監控涵蓋效能、準確度、異常，有預警機制" },
          { value: 5, label: "可追溯性完整，能回溯每一筆 AI 決策歷程" },
        ],
      },
      {
        id: "t4",
        text: "我們有 AI 工具與既有系統的整合能力與標準",
        options: [
          { value: 1, label: "沒有整合能力" },
          { value: 2, label: "點對點手工整合" },
          { value: 3, label: "有 API 標準，部分系統可串接" },
          { value: 4, label: "有整合平台與標準化介面" },
          { value: 5, label: "整合架構設計完善，新工具可快速接入" },
        ],
      },
    ],
  },
  {
    key: "culture",
    label: "文化",
    icon: "🌱",
    description: "組織文化、領導支持與風險意識",
    questions: [
      {
        id: "c1",
        text: "高階主管公開支持 AI 導入並參與治理決策",
        options: [
          { value: 1, label: "高層不關心或不了解 AI" },
          { value: 2, label: "口頭支持，但無實際行動" },
          { value: 3, label: "高層定期了解 AI 進度" },
          { value: 4, label: "高層積極參與治理決策與資源配置" },
          { value: 5, label: "高層是 AI 轉型的發起人與主要推動者" },
        ],
      },
      {
        id: "c2",
        text: "我們鼓勵員工嘗試 AI 工具，並有安全探索的環境",
        options: [
          { value: 1, label: "禁止使用未經核可的 AI 工具" },
          { value: 2, label: "不鼓勵也不禁止" },
          { value: 3, label: "鼓勵使用，但無安全指引" },
          { value: 4, label: "鼓勵使用，提供安全工具清單與沙盒環境" },
          { value: 5, label: "有正式 AI 創新時間與安全實驗機制" },
        ],
      },
      {
        id: "c3",
        text: "我們有 AI 失敗案例分享與學習的文化",
        options: [
          { value: 1, label: "沒有，失敗被隱瞞或責怪" },
          { value: 2, label: "偶爾有分享，但不正式" },
          { value: 3, label: "有定期回顧，但不一定分享 AI 失敗" },
          { value: 4, label: "AI 失敗被視為學習機會，定期分享" },
          { value: 5, label: "失敗案例制度化，產出改善行動並追蹤成效" },
        ],
      },
      {
        id: "c4",
        text: "我們對 AI 的風險與限制有務實認知（不神化也不妖魔化）",
        options: [
          { value: 1, label: "多數人對 AI 一知半解" },
          { value: 2, label: "看法兩極化（過度樂觀或過度悲觀）" },
          { value: 3, label: "部分員工有基本認知" },
          { value: 4, label: "多數員工有務實的 AI 認知" },
          { value: 5, label: "AI 認知是組織共識，風險管理融入日常工作" },
        ],
      },
    ],
  },
];

/* ============ 評分邏輯 ============ */

function getLevel(avg: number): "起步期" | "形成期" | "發展期" | "成熟期" | "標竿期" {
  if (avg < 1.5) return "起步期";
  if (avg < 2.5) return "形成期";
  if (avg < 3.5) return "發展期";
  if (avg < 4.5) return "成熟期";
  return "標竿期";
}

function getStatus(avg: number): "紅燈" | "黃燈" | "綠燈" {
  if (avg < 2.0) return "紅燈";
  if (avg < 3.0) return "黃燈";
  return "綠燈";
}

/* ============ 建議邏輯 ============ */

const DIM_RECOMMENDATIONS: Record<DimKey, string[]> = {
  people: [
    "從指派 AI 治理負責人開始：先決定誰（或哪個團隊）負責 AI 導入的統籌與協調，不必一開始就設專職，但要有人能回答「我們的 AI 誰在管」。",
    "建立 AI 素養培訓計畫：從一堂入門課開始，讓全公司理解 AI 能幫什麼、不能幫什麼，目標是建立共同語言。",
    "導入 AI 人才盤點：盤點現有團隊的 AI 技能分布，找出缺口與種子人員，為後續培訓與招募提供依據。",
  ],
  process: [
    "從建立 AI 導入流程開始：文件化從提案、評估、試點到規模化的標準步驟，讓各部門有共同遵循的框架。",
    "制定 AI 使用規範：先寫一頁基本規範（什麼可以做、什麼不行、資料該怎麼保護），滾動式更新。",
    "建立供應商評估標準：下次採購 AI 工具時，用同一套標準評估（安全、合規、整合性、廠商支援），避免重複踩坑。",
  ],
  data: [
    "從資料分類開始：先盤點現有資料，分為「可直接用於 AI」「需去識別化後可用」「不可用於 AI」三級。",
    "建立資料品質檢查機制：每次 AI 專案啟動前，先對訓練資料做品質檢查，記錄問題與處理方式。",
    "制定資料安全標準：明確哪些資料不能送入外部 AI 服務、去識別化要做到什麼程度，形成書面指引。",
  ],
  tech: [
    "從盤點現有 AI 工具開始：先搞清楚各部門在用什麼、花多少錢，再決定是否需要統一平台策略。",
    "建立模型測試標準：下次導入新 AI 模型時，先跑一組標準測試（準確度、回應時間、邊界案例），記錄結果。",
    "導入 AI 系統監控：至少做到日誌留存與關鍵指標監控，確保問題發生時可以回溯與追蹤。",
  ],
  culture: [
    "從高層共識開始：安排一次 AI 治理議題的經營會議，讓高層理解治理不是創新的敵人，而是規模化的前提。",
    "建立安全探索機制：提供一份經審查的 AI 工具清單，讓員工在安全範圍內自由嘗試，把 Shadow AI 變成 Visible AI。",
    "建立失敗分享機制：定期舉辦 AI 回顧會議，鼓勵分享失敗經驗，產出改善行動，讓組織從錯誤中學習。",
  ],
};

export function evaluate(scores: Record<DimKey, number[]>): ScanResult {
  const dimKeys: DimKey[] = ["people", "process", "data", "tech", "culture"];

  const dimResults: DimResult[] = dimKeys.map((key) => {
    const dim = DIMENSIONS.find((d) => d.key === key)!;
    const answers = scores[key] || [];
    const avg = answers.length > 0 ? answers.reduce((a, b) => a + b, 0) / answers.length : 0;
    const totalScore = answers.reduce((a, b) => a + b, 0);
    const maxScore = dim.questions.length * 5;
    return {
      key,
      label: dim.label,
      icon: dim.icon,
      score: Math.round(avg * 10) / 10,
      pct: maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0,
      level: getLevel(avg),
      status: getStatus(avg),
    };
  });

  const overallScore =
    dimResults.length > 0
      ? Math.round((dimResults.reduce((a, b) => a + b.score, 0) / dimResults.length) * 10) / 10
      : 0;

  const redCount = dimResults.filter((d) => d.status === "紅燈").length;
  const yellowCount = dimResults.filter((d) => d.status === "黃燈").length;
  const greenCount = dimResults.filter((d) => d.status === "綠燈").length;
  const hasRisk = redCount > 0 || yellowCount > 0;

  // Strengths: dimensions with 綠燈
  const strengths = dimResults
    .filter((d) => d.status === "綠燈")
    .map((d) => `${d.icon} ${d.label}（${d.score} 分，${d.level}）`);

  // Risks: 紅燈 and 黃燈 dimensions
  const risks = dimResults
    .filter((d) => d.status !== "綠燈")
    .map((d) => ({ dim: `${d.icon} ${d.label}`, score: d.score, level: d.level }));

  // Recommendations
  const recommendations: ScanResult["recommendations"] = [];
  for (const dr of [...dimResults].sort((a, b) => a.score - b.score)) {
    const recs = DIM_RECOMMENDATIONS[dr.key];
    if (!recs) continue;
    let priority: "high" | "medium" | "low";
    if (dr.score < 2.0) priority = "high";
    else if (dr.score < 3.0) priority = "medium";
    else continue; // green dimensions skip

    const idx = dr.score < 2.0 ? 0 : 1;
    recommendations.push({
      dim: `${dr.icon} ${dr.label}`,
      text: idx < recs.length ? recs[idx] : recs[0],
      priority,
    });
  }

  // Summary
  let summary: string;
  if (redCount > 0) {
    summary = `您的 AI 治理有 ${redCount} 個紅燈維度，需要立即關注。建議從分數最低的維度開始，先做一個具體改善行動，建立治理動能。`;
  } else if (yellowCount > 0) {
    summary = `您的 AI 治理有 ${yellowCount} 個黃燈維度，已具備基本意識但需系統化。建議針對黃燈維度制定改善計畫，逐步提升治理成熟度。`;
  } else {
    summary = `您的 AI 治理水準穩定，五個維度均在綠燈區。建議持續監控治理成效，並將治理經驗擴散到更多業務場景。`;
  }

  return {
    dimensions: dimResults,
    overallScore,
    overallLevel: getLevel(overallScore),
    redCount,
    yellowCount,
    greenCount,
    hasRisk,
    strengths,
    risks,
    recommendations: recommendations.slice(0, 5),
    summary,
  };
}

export function getAllDimensions(): Dimension[] {
  return DIMENSIONS;
}

export function getDimKeyList(): DimKey[] {
  return ["people", "process", "data", "tech", "culture"];
}