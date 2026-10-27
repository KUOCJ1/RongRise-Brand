/* ============================================
   Agentic AI 員工管理學五階自評 — 規則引擎（B4-1 微型工具）
   2026-10-27 小賀開發（第四批首發）

   方法論基礎：
   - 榕耀管顧原創「Agentic AI 員工管理學」框架
   - 五階生命週期：招募 → 入職 → 考核 → 治理 → 成長
   - framework-definition.md v2.0（2026-09-10）為唯一來源

   設計原則（與 ai-governance-scan / ai-hr-assessment 一致）：
   - 透明：參數與規則公開，不黑箱
   - 保守：分數如實反映，不吹牛
   - 零依賴：純規則引擎，無 LLM API，離線可跑
   - 個別化：建議依據每一題的低分來推，而不是只看階段均分
   ============================================ */

export type StageKey = "recruit" | "onboard" | "appraise" | "govern" | "grow";

export interface Question {
  id: string;
  text: string;
  options: { value: number; label: string }[];
}

export interface Stage {
  key: StageKey;
  label: string;
  icon: string;
  description: string;
  questions: Question[];
}

export interface StageResult {
  key: StageKey;
  label: string;
  icon: string;
  score: number; // 1-5
  pct: number; // 0-100
  level: "起步期" | "形成期" | "發展期" | "成熟期" | "標竿期";
  status: "紅燈" | "黃燈" | "綠燈";
}

export interface DiagnosisResult {
  stages: StageResult[];
  overallScore: number;
  overallLevel: string;
  redCount: number;
  yellowCount: number;
  greenCount: number;
  hasRisk: boolean;
  strengths: string[];
  risks: { stage: string; score: number; level: string; status: StageResult["status"] }[];
  recommendations: { stage: string; text: string; priority: "high" | "medium" | "low" }[];
  summary: string;
  nextStep: string;
}

/* ============ 五階定義 ============ */

const STAGES: Stage[] = [
  {
    key: "recruit",
    label: "招募",
    icon: "🎯",
    description: "先寫職能，再選工具：AI 員工的角色分工是否清楚、不重疊",
    questions: [
      {
        id: "r1",
        text: "我們能清楚列出每一個 AI 員工（或 AI 代理）負責的職能",
        options: [
          { value: 1, label: "沒有，所有事都交給同一個通用助理" },
          { value: 2, label: "有少數用途，但沒有明確分工" },
          { value: 3, label: "有大致分類，但職能會重疊" },
          { value: 4, label: "多數 AI 員工有明確職能，重疊很少" },
          { value: 5, label: "每個 AI 員工的職能都能一句話說清楚，彼此不重疊" },
        ],
      },
      {
        id: "r2",
        text: "當 AI 產出出錯時，我們能指出是哪一個職能環節出問題",
        options: [
          { value: 1, label: "無法判斷，只能整體重來" },
          { value: 2, label: "偶爾能猜，但沒有固定歸因方式" },
          { value: 3, label: "大問題能歸因，小問題常常找不到源頭" },
          { value: 4, label: "多數錯誤能歸因到特定職能" },
          { value: 5, label: "錯誤歸因是標準流程，每個環節有明確 owner" },
        ],
      },
      {
        id: "r3",
        text: "我們在選 AI 工具之前，會先確認「這個職能需要什麼能力」",
        options: [
          { value: 1, label: "先看工具功能，再決定怎麼用" },
          { value: 2, label: "有時會想需求，但很快就被工具牽著走" },
          { value: 3, label: "重要採購會先列需求，但不固定" },
          { value: 4, label: "多數情況先定職能需求，再選工具" },
          { value: 5, label: "職能設計是採購前的強制步驟" },
        ],
      },
    ],
  },
  {
    key: "onboard",
    label: "入職",
    icon: "📚",
    description: "技能＋記憶＋上下文：AI 員工有沒有拿到完整的上崗資訊",
    questions: [
      {
        id: "o1",
        text: "我們有把重複工作寫成「技能」或「標準作業程序」給 AI 使用",
        options: [
          { value: 1, label: "沒有，每次都下新指令" },
          { value: 2, label: "有幾個常用提示詞，但沒有整理" },
          { value: 3, label: "有提示詞庫或簡單 SOP" },
          { value: 4, label: "多數重複工作已寫成可重複呼叫的技能" },
          { value: 5, label: "技能會持續改版、累積，並有自動精煉機制" },
        ],
      },
      {
        id: "o2",
        text: "AI 員工能在需要時查到公司過往的決策脈絡與背景",
        options: [
          { value: 1, label: "沒有，AI 每次從零開始" },
          { value: 2, label: "偶爾會手動貼上下文給 AI" },
          { value: 3, label: "有部分資料庫，但結構鬆散" },
          { value: 4, label: "有結構化知識庫，AI 能查到關鍵決策背景" },
          { value: 5, label: "知識庫與工作流程自動串接，AI 在對的時間拿到對的上下文" },
        ],
      },
      {
        id: "o3",
        text: "新的 AI 員工上線前，會經過一套標準化的入職流程",
        options: [
          { value: 1, label: "沒有，直接開始用" },
          { value: 2, label: "會試用幾次，但無標準流程" },
          { value: 3, label: "有基本測試，但沒有固定檢核點" },
          { value: 4, label: "有標準入職流程，含技能載入與測試任務" },
          { value: 5, label: "入職流程完整，通過考核才能正式上線" },
        ],
      },
    ],
  },
  {
    key: "appraise",
    label: "考核",
    icon: "📏",
    description: "先定義什麼叫做對：AI 產出有沒有可量測的品質門檻",
    questions: [
      {
        id: "a1",
        text: "我們對 AI 的對外產出有明確的品質門檻（例如分數、檢核表）",
        options: [
          { value: 1, label: "沒有，靠人看了覺得可以就發" },
          { value: 2, label: "有口頭標準，但沒有量化" },
          { value: 3, label: "有檢核表，但執行不一致" },
          { value: 4, label: "有量化門檻，多數產出會檢查" },
          { value: 5, label: "門檻自動檢查，未達標無法進入下一關" },
        ],
      },
      {
        id: "a2",
        text: "品質門檻真的攔下過不符合標準的產出",
        options: [
          { value: 1, label: "從來沒有，好像每次都過" },
          { value: 2, label: "很少，印象中有過一兩次" },
          { value: 3, label: "偶爾會退回，但沒有記錄" },
          { value: 4, label: "經常攔下，並會記錄原因" },
          { value: 5, label: "退回是常態，每次都留下紀錄與改善依據" },
        ],
      },
      {
        id: "a3",
        text: "我們有獨立於產出者之外的品質審查機制",
        options: [
          { value: 1, label: "沒有，誰做的誰自己檢查" },
          { value: 2, label: "有時會請同事幫看，但不固定" },
          { value: 3, label: "重要產出會有第二人檢查" },
          { value: 4, label: "有固定審查角色或流程" },
          { value: 5, label: "審查機制獨立、定期運作，並輸出報告" },
        ],
      },
    ],
  },
  {
    key: "govern",
    label: "治理",
    icon: "🛡️",
    description: "分級授權，不是全面自動化：風險與效率的平衡線畫在哪",
    questions: [
      {
        id: "g1",
        text: "我們有區分「AI 可以自己決定」與「必須人工核准」的事項",
        options: [
          { value: 1, label: "沒有區分，很多事直接自動跑" },
          { value: 2, label: "有大概感覺，但沒寫成規則" },
          { value: 3, label: "有書面分級，但執行不穩定" },
          { value: 4, label: "分級授權明確，多數流程依規則運作" },
          { value: 5, label: "授權分級寫進流程，未核准無法執行高風險動作" },
        ],
      },
      {
        id: "g2",
        text: "如果今天出一次大錯，我能指出哪一道關卡應該擋下來",
        options: [
          { value: 1, label: "指不出來，只能事後檢討" },
          { value: 2, label: "大概知道，但沒有明確關卡" },
          { value: 3, label: "有幾個關卡，但不確定是否都有效" },
          { value: 4, label: "能明確指出關卡，且多數有效運作" },
          { value: 5, label: "每個風險層級都有對應關卡，並定期驗證" },
        ],
      },
      {
        id: "g3",
        text: "「AI 產出的頻率與數量」是由人決定，而不是系統自己無限加速",
        options: [
          { value: 1, label: "系統能跑多快就跑多快" },
          { value: 2, label: "有時會注意到頻率，但沒有控制機制" },
          { value: 3, label: "重要發布會人工決定時間點" },
          { value: 4, label: "多數對外動作的節奏由人決定" },
          { value: 5, label: "節奏是治理的一部分，系統只執行不決定" },
        ],
      },
    ],
  },
  {
    key: "grow",
    label: "成長",
    icon: "🌱",
    description: "讓錯誤變成組織記憶：有沒有學習機制防止同一個根因再犯",
    questions: [
      {
        id: "gr1",
        text: "我們會記錄 AI 出錯的根因，而不只是修掉當下的問題",
        options: [
          { value: 1, label: "不會記錄，修完就結案" },
          { value: 2, label: "偶爾會寫幾句，但沒有固定格式" },
          { value: 3, label: "重要事故會記錄，但不完整" },
          { value: 4, label: "多數事故會記錄根因與修法" },
          { value: 5, label: "事故紀錄是標準流程，並會追蹤是否再犯" },
        ],
      },
      {
        id: "gr2",
        text: "我們會把錯誤的檢查點寫回流程或技能，防止下次再發生",
        options: [
          { value: 1, label: "不會，靠大家記得" },
          { value: 2, label: "偶爾會更新文件，但不固定" },
          { value: 3, label: "重要事故後會更新流程" },
          { value: 4, label: "多數事故會導致流程或技能更新" },
          { value: 5, label: "每次事故都會產出具體的檢查點，並寫入自動化流程" },
        ],
      },
      {
        id: "gr3",
        text: "我們會定期檢視 AI 員工的表現，並決定下一版要優化什麼",
        options: [
          { value: 1, label: "不會，用到壞了再說" },
          { value: 2, label: "有問題才檢視，沒問題就不動" },
          { value: 3, label: "偶爾會檢視，但沒有週期" },
          { value: 4, label: "會定期檢視表現並排定優化" },
          { value: 5, label: "有週期性回顧機制，並明確規劃下一版成長目標" },
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

function getStatusByLevel(level: StageResult["level"]): "紅燈" | "黃燈" | "綠燈" {
  if (level === "起步期" || level === "形成期") return "紅燈";
  if (level === "發展期") return "黃燈";
  return "綠燈";
}

/* ============ 建議邏輯（每題對應一條行動建議） ============ */

const QUESTION_RECOMMENDATIONS: Record<string, string> = {
  // 招募
  r1: "先寫 AI 職能表：不要問「哪個工具好用」，先列出你需要的職能（例如內容、開發、維運、審查、研究），再決定每個職能需要什麼能力。",
  r2: "建立錯誤歸因習慣：每次出錯時，先問「是哪個職能環節出的錯」，而不是「AI 又不穩」。",
  r3: "職能設計優先於工具選型：下次採購 AI 工具前，先寫一頁「這個職能需要什麼能力」清單，用它來篩選工具。",
  // 入職
  o1: "建立第一個技能：挑一件你每週會重複做的事，把提示詞、步驟、檢查點寫成一份可以重複呼叫的技能。",
  o2: "整理一個小知識庫：不要一次整理全部，先從「AI 員工最常需要知道的 10 個決策背景」開始。",
  o3: "設計入職測試：新 AI 員工上線前，給它一個標準任務，通過了才能正式接手工作。",
  // 考核
  a1: "挑一項對外產出定門檻：例如「文案開頭必須在 100 字內講重點」或「每個論點都要有數字支撐」。",
  a2: "讓門檻真的會攔人：門檻寫好後，故意用一份不及格的產出測試，確認它能被擋下來。",
  a3: "引入獨立審查：找一個不負責產出的人，定期抽查 AI 產出，並留下書面紀錄。",
  // 治理
  g1: "畫一條授權線：把 AI 會做的事分成三級——低風險全自動、中風險產出後人工過目、高風險一律核准。",
  g2: "做一次災難演練：假設今天 AI 自動發了一則錯誤訊息，哪一道關卡應該擋下來？把答案寫成檢查點。",
  g3: "指定節奏決定者：問「這件事的頻率與量，現在是誰決定的？」如果是系統自己決定，就要把人放回迴路裡。",
  // 成長
  gr1: "開一份事故紀錄：從今天開始，每次 AI 出錯都記錄「根因、換到的知識、下次檢查點」。",
  gr2: "把檢查點寫進流程：不要只靠「記得」，要讓系統在下次執行時自動檢查。",
  gr3: "排定定期回顧：每兩週或每個月，檢視一次 AI 員工的表現，決定下一版要優化什麼。",
};

const STAGE_GROWTH_RECOMMENDATIONS: Record<StageKey, string> = {
  recruit: "持續優化職能分工：定期檢視 AI 員工的職能是否隨業務變化而重疊或散落，避免新舊角色重疊。",
  onboard: "加深知識庫與工作流程的連結：讓新上線的 AI 員工在執行任務前，自動拿到最相關的決策背景與約束。",
  appraise: "把門檻從「人看」轉為「系統檢」：逐步將量化門檻寫入自動化檢查，減少人工審查的漏洞。",
  govern: "定期回顧授權分級：隨著 AI 能力提升，某些中風險動作可能可以放手，但該停的地方一定要停得住。",
  grow: "建立「下一版成長目標」的計畫節奏：每次回顧後都明確記錄「這個 AI 員工下一版要優化什麼」，而不是只停在「還行」。",
};

function getPriorityByStatus(status: StageResult["status"]): "high" | "medium" | "low" {
  if (status === "紅燈") return "high";
  if (status === "黃燈") return "medium";
  return "low";
}

export function evaluate(scores: Record<StageKey, number[]>): DiagnosisResult {
  const stageKeys: StageKey[] = ["recruit", "onboard", "appraise", "govern", "grow"];

  const stageResults: StageResult[] = stageKeys.map((key) => {
    const stage = STAGES.find((s) => s.key === key)!;
    const answers = scores[key] || [];
    const avg = answers.length > 0 ? answers.reduce((a, b) => a + b, 0) / answers.length : 0;
    const totalScore = answers.reduce((a, b) => a + b, 0);
    const maxScore = stage.questions.length * 5;
    const level = getLevel(avg);
    return {
      key,
      label: stage.label,
      icon: stage.icon,
      score: Math.round(avg * 10) / 10,
      pct: maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0,
      level,
      status: getStatusByLevel(level),
    };
  });

  const overallScore =
    stageResults.length > 0
      ? Math.round((stageResults.reduce((a, b) => a + b.score, 0) / stageResults.length) * 10) / 10
      : 0;
  const overallLevel = getLevel(overallScore);

  const redCount = stageResults.filter((d) => d.status === "紅燈").length;
  const yellowCount = stageResults.filter((d) => d.status === "黃燈").length;
  const greenCount = stageResults.filter((d) => d.status === "綠燈").length;
  const hasRisk = redCount > 0 || yellowCount > 0;

  // Strengths: 成熟期（>=3.5）才稱為強項，發展期不列入
  const strengths = stageResults
    .filter((d) => d.score >= 3.5)
    .map((d) => `${d.icon} ${d.label}（${d.score} 分，${d.level}）`);

  // Risks: 發展期以下（<3.5），依分數由低到高排序
  const risks = stageResults
    .filter((d) => d.score < 3.5)
    .sort((a, b) => a.score - b.score)
    .map((d) => ({ stage: `${d.icon} ${d.label}`, score: d.score, level: d.level, status: d.status }));

  // Recommendations: 每階段找出最低分那一題，給出對應行動建議
  const recommendations: DiagnosisResult["recommendations"] = [];
  for (const sr of [...stageResults].sort((a, b) => a.score - b.score)) {
    const stage = STAGES.find((s) => s.key === sr.key)!;
    const answers = scores[sr.key] || [];

    let text: string;
    let priority: "high" | "medium" | "low";

    if (sr.score < 3.5) {
      // 找最低分的那一題
      let minIdx = 0;
      let minScore = Infinity;
      for (let i = 0; i < answers.length; i++) {
        if (answers[i] < minScore) {
          minScore = answers[i];
          minIdx = i;
        }
      }
      const qid = stage.questions[minIdx]?.id;
      text = (qid && QUESTION_RECOMMENDATIONS[qid]) || STAGE_GROWTH_RECOMMENDATIONS[sr.key];
      priority = getPriorityByStatus(sr.status);
    } else {
      // 綠燈階段：給持續優化建議
      text = STAGE_GROWTH_RECOMMENDATIONS[sr.key];
      priority = "low";
    }

    recommendations.push({
      stage: `${sr.icon} ${sr.label}`,
      text,
      priority,
    });
  }

  // Summary
  let summary: string;
  if (redCount > 0) {
    summary = `你的 AI 員工管理有 ${redCount} 個紅燈階段，需要先補基礎。建議從分數最低的階段選一個具體行動，先建立可運作的機制。`;
  } else if (yellowCount > 0) {
    summary = `你的 AI 員工管理有 ${yellowCount} 個階段在黃燈區，已經有基本做法但還不穩定。建議針對黃燈階段制定標準流程，讓好做法變成習慣。`;
  } else {
    summary = `你的 AI 員工管理五階都在綠燈區，基礎扎實。建議持續優化每個階段的自動化與精密度，並把經驗複製到更多 AI 員工。`;
  }

  // Next step：不能只看整體平均，一個紅燈階段就該先補
  const nextStep =
    redCount > 0
      ? "先從分數最低的那一階選一個最小可行行動，跑兩週後再複測。管理機制是複利的，越早建立越划算。"
      : yellowCount > 0
      ? "基本做法已經有了，但還不穩定。選一個黃燈階段做標準化：寫下 SOP、指定負責人、設定檢查節奏，4 週後再複測。"
      : "五階都在綠燈區，基礎已穩。建議把成功經驗複製到更多 AI 員工，或用 AI 轉型路線圖計畫下一階段的深化。";

  return {
    stages: stageResults,
    overallScore,
    overallLevel,
    redCount,
    yellowCount,
    greenCount,
    hasRisk,
    strengths,
    risks,
    recommendations: recommendations.slice(0, 5),
    summary,
    nextStep,
  };
}

export function getAllStages(): Stage[] {
  return STAGES;
}

export function getStageKeyList(): StageKey[] {
  return ["recruit", "onboard", "appraise", "govern", "grow"];
}
