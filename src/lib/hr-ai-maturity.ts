/* ============================================
   HR AI 化成熟度評估 — 規則引擎（B2-2 微型工具）
   2026-09-05 開發（第二批 B2-2）

   方法論基礎：
   - CJ哥 20 年人資實戰 × 五層 AI 轉型責任框架
   - McKinsey《Your AI Agents Need Performance Management Too》(2026.08)
   - HR 五大場景：招募甄選、績效管理、培訓發展、員工服務、數據決策

   設計原則（與 ai-roadmap / amoeba-scan 一致）：
   - 透明：參數與規則公開，不黑箱
   - 保守：分數如實反映，不吹牛
   - 零依賴：純規則引擎，無 LLM API，離線可跑
   ============================================ */

export type ScenarioKey = "recruit" | "performance" | "training" | "service" | "analytics";

export interface Question {
  id: string;
  text: string;
  options: { value: number; label: string }[];
}

export interface Scenario {
  key: ScenarioKey;
  label: string;
  icon: string;
  description: string;
  questions: Question[];
}

export interface ScenarioResult {
  key: ScenarioKey;
  label: string;
  score: number; // 1-5
  maxScore: number;
  pct: number; // 0-100
  level: "novice" | "developing" | "intermediate" | "advanced" | "leader";
}

export interface AssessmentResult {
  scenarios: ScenarioResult[];
  overallScore: number;
  overallPct: number;
  overallLevel: string;
  strengths: string[];
  gaps: string[];
  recommendations: { scenario: string; text: string; priority: "high" | "medium" | "low" }[];
  nextStep: string;
}

/* ============ 五大場景定義 ============ */

const SCENARIOS: Scenario[] = [
  {
    key: "recruit",
    label: "招募甄選",
    icon: "🔍",
    description: "AI 在人才招募流程中的應用程度，從履歷篩選到面試評估",
    questions: [
      {
        id: "r1",
        text: "我們使用 AI 輔助篩選履歷，自動比對職缺條件",
        options: [
          { value: 1, label: "沒有，完全人工篩選" },
          { value: 2, label: "試用過但未正式導入" },
          { value: 3, label: "部分職缺使用，人工作最終決定" },
          { value: 4, label: "多數職缺使用，有標準化評估流程" },
          { value: 5, label: "全面導入，AI 篩選+人資複核已制度化" },
        ],
      },
      {
        id: "r2",
        text: "我們用 AI 工具輔助撰寫職缺描述與面試問題",
        options: [
          { value: 1, label: "沒有" },
          { value: 2, label: "偶爾使用生成式 AI 輔助" },
          { value: 3, label: "經常使用，但無標準格式" },
          { value: 4, label: "有模板庫+AI 輔助撰寫標準流程" },
          { value: 5, label: "完全整合到招募系統中自動產生" },
        ],
      },
      {
        id: "r3",
        text: "我們用 AI 分析面試記錄，輔助候選人評分決策",
        options: [
          { value: 1, label: "沒有" },
          { value: 2, label: "偶爾用 AI 摘要面試記錄" },
          { value: 3, label: "經常使用 AI 分析，但分數僅供參考" },
          { value: 4, label: "AI 分析是評分流程的標準環節" },
          { value: 5, label: "AI 評分與面試官評分並列，有比對機制" },
        ],
      },
      {
        id: "r4",
        text: "我們用 AI 進行人才庫管理與被動候選人開發",
        options: [
          { value: 1, label: "沒有系統化人才庫" },
          { value: 2, label: "有人才庫但純手動維護" },
          { value: 3, label: "用 ATS 自動管理，無 AI 輔助" },
          { value: 4, label: "AI 輔助人才匹配與主動推薦" },
          { value: 5, label: "AI 驅動的人才雷達，主動掃描並推播" },
        ],
      },
    ],
  },
  {
    key: "performance",
    label: "績效管理",
    icon: "📊",
    description: "AI 在目標設定、績效考核與回饋流程中的應用",
    questions: [
      {
        id: "p1",
        text: "我們用 AI 輔助設定個人與團隊目標（OKR/KPI）",
        options: [
          { value: 1, label: "沒有" },
          { value: 2, label: "主管自行用 AI 工具協助思考" },
          { value: 3, label: "有目標管理系統，AI 輔助追蹤" },
          { value: 4, label: "AI 自動建議目標並對齊公司策略" },
          { value: 5, label: "AI 驅動目標拆解+對齊+進度預測" },
        ],
      },
      {
        id: "p2",
        text: "我們用 AI 分析績效數據，找出趨勢與異常",
        options: [
          { value: 1, label: "沒有系統化分析" },
          { value: 2, label: "Excel 手動統計" },
          { value: 3, label: "有報表系統，人工判讀" },
          { value: 4, label: "AI 自動產出績效洞察與異常警示" },
          { value: 5, label: "AI 預測績效趨勢並主動建議干預行動" },
        ],
      },
      {
        id: "p3",
        text: "我們用 AI 輔助進行 360 度回饋分析",
        options: [
          { value: 1, label: "沒有 360 度回饋制度" },
          { value: 2, label: "有制度但純人工彙整" },
          { value: 3, label: "用工具收集，人工分析" },
          { value: 4, label: "AI 自動彙整並標註關鍵洞察" },
          { value: 5, label: "AI 綜合分析+行為建議+發展計畫產出" },
        ],
      },
      {
        id: "p4",
        text: "我們將 AI Agent 的產出納入績效管理範圍",
        options: [
          { value: 1, label: "公司還沒有 AI Agent" },
          { value: 2, label: "有 Agent 但沒人在管它的績效" },
          { value: 3, label: "有盤點 Agent 數量，但無考核機制" },
          { value: 4, label: "部分關鍵 Agent 有 KPI 追蹤" },
          { value: 5, label: "Agent 績效已納入定期考核制度" },
        ],
      },
    ],
  },
  {
    key: "training",
    label: "培訓發展",
    icon: "📚",
    description: "AI 在員工培訓、技能發展與學習路徑規劃中的應用",
    questions: [
      {
        id: "t1",
        text: "我們用 AI 分析員工技能缺口與培訓需求",
        options: [
          { value: 1, label: "沒有系統化技能盤點" },
          { value: 2, label: "主管主觀判斷培訓需求" },
          { value: 3, label: "有年度培訓計畫，依經驗規劃" },
          { value: 4, label: "AI 輔助技能盤點與缺口分析" },
          { value: 5, label: "AI 即時技能雷達+自動建議個人化培訓" },
        ],
      },
      {
        id: "t2",
        text: "我們用 AI 提供個人化學習路徑與內容推薦",
        options: [
          { value: 1, label: "沒有" },
          { value: 2, label: "有線上課程平台，自行選課" },
          { value: 3, label: "依職能別推薦固定課程清單" },
          { value: 4, label: "AI 依個人技能缺口推薦學習路徑" },
          { value: 5, label: "AI 動態調整學習路徑+成效追蹤" },
        ],
      },
      {
        id: "t3",
        text: "我們用 AI 輔助教材生成與培訓內容製作",
        options: [
          { value: 1, label: "沒有" },
          { value: 2, label: "偶爾用 AI 工具輔助編寫" },
          { value: 3, label: "經常使用 AI 生成教材初稿" },
          { value: 4, label: "有標準化 AI 教材製作流程" },
          { value: 5, label: "AI 自動產出多格式教材+即時更新" },
        ],
      },
      {
        id: "t4",
        text: "我們追蹤培訓成效並用 AI 分析 RO training",
        options: [
          { value: 1, label: "沒有成效追蹤" },
          { value: 2, label: "課程結束後滿意度調查" },
          { value: 3, label: "有 Level 1-2 評估（反應+學習）" },
          { value: 4, label: "AI 輔助 Level 3-4 評估（行為+結果）" },
          { value: 5, label: "AI 持續追蹤+培訓 ROI 計算制度化" },
        ],
      },
      {
        id: "t5",
        text: "我們培養員工的 AI 素養與使用能力",
        options: [
          { value: 1, label: "沒有相關培訓" },
          { value: 2, label: "有開設 AI 入門講座" },
          { value: 3, label: "有系統性 AI 素養培訓課程" },
          { value: 4, label: "各部門有專屬 AI 應用培訓" },
          { value: 5, label: "AI 能力是核心職能，列入晉升評核" },
        ],
      },
    ],
  },
  {
    key: "service",
    label: "員工服務",
    icon: "🎯",
    description: "AI 在員工日常服務、入職流程與自助服務中的應用",
    questions: [
      {
        id: "s1",
        text: "我們有 AI 助理（聊天機器人）回答員工常見問題",
        options: [
          { value: 1, label: "沒有" },
          { value: 2, label: "試用過但未正式上線" },
          { value: 3, label: "已上線，覆蓋部分 HR 常見問答" },
          { value: 4, label: "AI 助理覆蓋多領域（HR/IT/行政）" },
          { value: 5, label: "AI 助理整合公司知識庫，回答精準且持續優化" },
        ],
      },
      {
        id: "s2",
        text: "我們用 AI 自動化員工入職流程",
        options: [
          { value: 1, label: "純人工辦理入職" },
          { value: 2, label: "部分表單電子化" },
          { value: 3, label: "入職流程有系統化管理" },
          { value: 4, label: "AI 輔助入職排程與文件自動生成" },
          { value: 5, label: "AI 驅動全流程入職+個人化入職計畫" },
        ],
      },
      {
        id: "s3",
        text: "我們用 AI 分析員工滿意度與敬業度調查",
        options: [
          { value: 1, label: "沒有定期調查" },
          { value: 2, label: "有年度調查，人工彙整" },
          { value: 3, label: "有工具輔助收集與報表" },
          { value: 4, label: "AI 自動分析開放式回應並標註趨勢" },
          { value: 5, label: "AI 即時 pulse survey+情感分析+行動建議" },
        ],
      },
      {
        id: "s4",
        text: "員工能自助查詢福利、薪資與請假資訊",
        options: [
          { value: 1, label: "需詢問 HR 專員" },
          { value: 2, label: "有紙本或 PDF 手冊" },
          { value: 3, label: "有員工入口網站查詢" },
          { value: 4, label: "入口網站+AI 搜尋輔助" },
          { value: 5, label: "AI 語意查詢+個人化儀表板" },
        ],
      },
    ],
  },
  {
    key: "analytics",
    label: "數據決策",
    icon: "📈",
    description: "AI 在人力數據分析、留任預測與策略決策中的應用",
    questions: [
      {
        id: "a1",
        text: "我們整合各 HR 系統數據做統一人力分析",
        options: [
          { value: 1, label: "各系統數據各自獨立" },
          { value: 2, label: "部分數據可匯出彙整" },
          { value: 3, label: "有 HR 數據倉儲或 BI 工具" },
          { value: 4, label: "AI 自動整合多源數據產出報表" },
          { value: 5, label: "即時數據湖+AI 驅動人力儀表板" },
        ],
      },
      {
        id: "a2",
        text: "我們用 AI 預測員工留任風險與離職傾向",
        options: [
          { value: 1, label: "沒有系統化預測" },
          { value: 2, label: "主管依經驗判斷離職風險" },
          { value: 3, label: "有離職率統計報表" },
          { value: 4, label: "AI 分析關鍵因子+風險評分" },
          { value: 5, label: "AI 主動預警+建議留任行動方案" },
        ],
      },
      {
        id: "a3",
        text: "我們用 AI 輔助人力編制與招募規劃",
        options: [
          { value: 1, label: "依主管申請審批" },
          { value: 2, label: "有年度人力預算編制" },
          { value: 3, label: "依業務數據推算人力需求" },
          { value: 4, label: "AI 輔助預測人力需求與排程" },
          { value: 5, label: "AI 驅動動態編制+自動招募啟動" },
        ],
      },
      {
        id: "a4",
        text: "我們用數據驅動 HR 策略決策，而非僅靠經驗",
        options: [
          { value: 1, label: "完全憑主管經驗決策" },
          { value: 2, label: "有參考數據但無系統" },
          { value: 3, label: "定期有 HR 數據報告輔助決策" },
          { value: 4, label: "AI 提供數據洞察與建議方案" },
          { value: 5, label: "AI 模擬不同方案結果，輔助策略選擇" },
        ],
      },
    ],
  },
];

/* ============ 評分邏輯 ============ */

function getLevel(avg: number): "novice" | "developing" | "intermediate" | "advanced" | "leader" {
  if (avg < 1.5) return "novice";
  if (avg < 2.5) return "developing";
  if (avg < 3.5) return "intermediate";
  if (avg < 4.5) return "advanced";
  return "leader";
}

const LEVEL_LABELS: Record<string, string> = {
  novice: "起步期（1.0-1.4）",
  developing: "發展期（1.5-2.4）",
  intermediate: "穩定期（2.5-3.4）",
  advanced: "領先期（3.5-4.4）",
  leader: "標竿期（4.5-5.0）",
};

/* ============ 建議邏輯 ============ */

const SCENARIO_RECOMMENDATIONS: Record<ScenarioKey, string[]> = {
  recruit: [
    "從導入 AI 履歷篩選開始：先選一個高流量職缺做 POC，比較 AI 篩選 vs 人工篩選的命中率與時間差。",
    "建立標準化 AI 面試題庫：讓招募團隊共用 AI 輔助的面試問題模板，減少重工，提升面試品質一致性。",
    "導入 AI 人才雷達：設定關鍵職能關鍵字，讓 AI 自動掃描外部人才庫並推播被動候選人。",
  ],
  performance: [
    "從 OKR/KPI 的 AI 輔助追蹤開始：先讓 AI 自動彙整目標進度，減少主管手動追蹤的時間。",
    "建立績效數據分析儀表板：整合考核、目標、回饋數據，讓 AI 標註異常與趨勢。",
    "將 AI Agent 績效納入管理：盤點公司已有的 Agent，為每個 Agent 設定基本的 KPI 與 owner。",
  ],
  training: [
    "從 AI 素養培訓開始：先建立全公司的 AI 基礎認知，讓員工理解 AI 能幫什麼、不能幫什麼。",
    "導入技能盤點工具：用 AI 分析現有團隊的技能組合與缺口，作為培訓規劃的數據基礎。",
    "建立個人化學習路徑：依員工角色與技能缺口，讓 AI 推薦最適合的課程與學習資源。",
  ],
  service: [
    "從 AI 員工助理開始：先解決 HR 最常被問的前 20 個問題，讓 AI 助理分擔第一線服務量。",
    "自動化入職流程：把入職文件生成、設備申請、帳號開通串成自動化流程。",
    "導入 pulse survey 機制：用 AI 定期收集員工反饋，即時掌握組織氣候。",
  ],
  analytics: [
    "從整合 HR 數據開始：先盤點現有 HR 系統的數據品質，建立統一的人力數據字典。",
    "導入留任風險預測：用 AI 分析歷史離職數據，建立離職風險模型，主動預警。",
    "建立 HR 策略儀表板：整合人才盤點、離職率、招募效率等關鍵指標，用數據驅動決策。",
  ],
};

export function evaluate(scores: Record<ScenarioKey, number[]>): AssessmentResult {
  const scenarioKeys: ScenarioKey[] = ["recruit", "performance", "training", "service", "analytics"];

  const scenarioResults: ScenarioResult[] = scenarioKeys.map((key) => {
    const scenario = SCENARIOS.find((s) => s.key === key)!;
    const answers = scores[key] || [];
    const avg = answers.length > 0 ? answers.reduce((a, b) => a + b, 0) / answers.length : 0;
    const maxScore = scenario.questions.length * 5;
    const totalScore = answers.reduce((a, b) => a + b, 0);
    return {
      key,
      label: scenario.label,
      score: Math.round(avg * 10) / 10,
      maxScore,
      pct: maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0,
      level: getLevel(avg),
    };
  });

  const overallScore =
    scenarioResults.length > 0
      ? Math.round((scenarioResults.reduce((a, b) => a.score + b.score, 0) / scenarioResults.length) * 10) / 10
      : 0;
  const overallPct = Math.round(
    scenarioResults.reduce((a, b) => a.pct, 0) / scenarioResults.length
  );

  // Strengths: top 2 scenarios
  const sorted = [...scenarioResults].sort((a, b) => b.score - a.score);
  const strengths = sorted.slice(0, 2).map((s) => `${s.label}（${s.score} 分，${LEVEL_LABELS[s.level]}）`);

  // Gaps: bottom 2 scenarios
  const gaps = sorted.slice(-2).map((s) => `${s.label}（${s.score} 分，${LEVEL_LABELS[s.level]}）`);

  // Priority recommendations
  const recommendations: AssessmentResult["recommendations"] = [];
  for (const sr of sorted.slice().reverse()) {
    // Only recommend for scenarios below intermediate
    const priority = sr.score < 2 ? "high" : sr.score < 3 ? "medium" : "low";
    if (priority === "low") continue;
    const recs = SCENARIO_RECOMMENDATIONS[sr.key];
    if (recs && recs.length > 0) {
      const idx = sr.score < 2 ? 0 : 1;
      recommendations.push({
        scenario: sr.label,
        text: idx < recs.length ? recs[idx] : recs[0],
        priority,
      });
    }
  }

  // Next step
  const nextStep = overallScore < 3
    ? "建議從評分最低的場景選一個痛點，先做小規模 POC。完成後再做 AI 轉型路線圖規劃。"
    : "整體成熟度不錯！建議針對缺口場景制定改善計畫，並連結到 AI 轉型路線圖做整體布局。";

  return {
    scenarios: scenarioResults,
    overallScore,
    overallPct,
    overallLevel: LEVEL_LABELS[getLevel(overallScore)],
    strengths,
    gaps,
    recommendations: recommendations.slice(0, 4),
    nextStep,
  };
}

export function getAllScenarios(): Scenario[] {
  return SCENARIOS;
}

export function getScenarioLabels(): Record<ScenarioKey, string> {
  return {
    recruit: "招募甄選",
    performance: "績效管理",
    training: "培訓發展",
    service: "員工服務",
    analytics: "數據決策",
  };
}