/* ============================================
   AI 轉型路線圖生成器 — 規則引擎
   2026-09-01 小賀開發（第二批 B2-1 微型工具）

   方法論（跨框架交織，避免單一框架）：
   - 《任務變形蟲 Task Amoeba Model》：任務 = 分析單位，盤點先行
   - McKinsey Pilot Trap：試點要有驗證指標，達標才擴大，不卡關
   - 10-20-70 投資原則：技術 10% / 流程 20% / 人 70%
   - 治理五檢查：人、流程、資料、技術、文化

   設計原則（與 amoeba-scan / pilot-trap 一致）：
   - 透明：參數與規則公開，不黑箱
   - 保守：階段化、可檢驗，不吹牛
   - 零依賴：純規則引擎，無 LLM API，離線可跑
   ============================================ */

export type SizeKey = "s" | "m" | "l" | "xl";
export type AreaKey = "docs" | "service" | "hr" | "marketing" | "ops" | "data";
export type StageKey = "not-started" | "piloting" | "partial";
export type BudgetKey = "conservative" | "moderate" | "aggressive" | "unsure";

export interface RoadmapInput {
  size: SizeKey;
  areas: AreaKey[];
  stage: StageKey;
  budget: BudgetKey;
}

export interface PhaseAction {
  text: string;
  href?: string;
  linkLabel?: string;
}

export interface RoadmapPhase {
  id: string;
  months: string;
  theme: string;
  goal: string;
  actions: PhaseAction[];
  scenarios: string[];
  metrics: string[];
  warning?: string;
}

export interface InvestmentSplit {
  name: string;
  pct: number;
  amount: string;
  desc: string;
}

export interface RoadmapResult {
  headline: string;
  summary: string;
  phases: RoadmapPhase[];
  investment: {
    label: string;
    total: string;
    splits: InvestmentSplit[];
    note: string;
  };
  watchouts: string[];
  footerNote: string;
}

/* ---------------- 輸入選項 meta ---------------- */

export const SIZE_META: Record<SizeKey, { label: string; teamHint: string }> = {
  s: { label: "50 人以下", teamHint: "決策快、資源少，適合輕量治理（老闆＋部門主管直接把關）" },
  m: { label: "50–200 人", teamHint: "部門分工成形，需要部門級專案負責人與跨部門協調" },
  l: { label: "200–1000 人", teamHint: "跨部門系統多，需要專責 AI 治理小組與資料盤點先行" },
  xl: { label: "1000 人以上", teamHint: "集團級規模，治理與資料標準要在第一階段就建立，避免各事業群各買各的" },
};

export const AREA_META: Record<
  AreaKey,
  { label: string; icon: string; p2Scenarios: string[]; p3Expand: string }
> = {
  docs: {
    label: "文件與知識管理",
    icon: "📄",
    p2Scenarios: ["合約與文件草擬", "會議紀錄自動化", "知識庫問答機器人"],
    p3Expand: "把文件自動化擴到全公司的表單、報告與知識產線",
  },
  service: {
    label: "客服與銷售",
    icon: "🤝",
    p2Scenarios: ["客戶訊息自動分類與回覆草稿", "報價單／提案書生成"],
    p3Expand: "從客服延伸到業務開發與客戶成功團隊",
  },
  hr: {
    label: "HR 與行政",
    icon: "👥",
    p2Scenarios: ["履歷初步篩選", "員工常見問答機器人", "招募流程自動化"],
    p3Expand: "擴到績效流程、培訓體系與員工服務中心",
  },
  marketing: {
    label: "行銷與內容",
    icon: "📣",
    p2Scenarios: ["社群排程與文案初稿", "競品情報週報"],
    p3Expand: "擴到 SEO 內容、廣告素材與活動企劃",
  },
  ops: {
    label: "製造與供應鏈",
    icon: "🏭",
    p2Scenarios: ["生產排程輔助", "品質異常紀錄分析"],
    p3Expand: "擴到庫存預測與設備預測性維護",
  },
  data: {
    label: "數據分析與決策",
    icon: "📊",
    p2Scenarios: ["週報／月報自動生成", "異常數據偵測"],
    p3Expand: "擴到經營儀表板與決策支援系統",
  },
};

export const STAGE_META: Record<StageKey, { label: string }> = {
  "not-started": { label: "尚未開始" },
  piloting: { label: "試點實驗中" },
  partial: { label: "已局部導入" },
};

export const BUDGET_META: Record<BudgetKey, { label: string; hint: string }> = {
  conservative: { label: "保守（年預算 100 萬以下）", hint: "以省時型應用優先，先求驗證再求規模" },
  moderate: { label: "穩健（100–500 萬）", hint: "可同時支撐試點＋流程改造＋培訓" },
  aggressive: { label: "積極（500 萬以上）", hint: "適合直接進入規模化，但仍建議按階段驗證" },
  unsure: { label: "還不清楚", hint: "先用「穩健」級距當參考，盤點完成後再校準" },
};

/* 年度預算級距（萬元 NTD）by size × budget */
const BUDGET_BANDS: Record<BudgetKey, Record<SizeKey, [number, number]>> = {
  conservative: { s: [30, 60], m: [60, 100], l: [100, 200], xl: [200, 400] },
  moderate: { s: [60, 120], m: [120, 300], l: [300, 600], xl: [600, 1200] },
  aggressive: { s: [120, 250], m: [250, 600], l: [600, 1200], xl: [1200, 2500] },
  unsure: { s: [60, 120], m: [120, 300], l: [300, 600], xl: [600, 1200] },
};

/* ---------------- 階段內容（依現況調整） ---------------- */

const PHASE1_GOAL: Record<StageKey, string> = {
  "not-started": "用任務盤點取代「感覺」，建立 AI 轉型的共同語言與治理底線，讓全公司對「AI 先做什麼」有共識。",
  piloting:
    "把散落的試點收斂成有結構的驗證架構——決定哪些留下、哪些停掉，讓資源集中在真正有效的方向。",
  partial: "盤點既有 AI 應用與成效，收斂出一條主線，避免多頭馬車與重複投資。",
};

const PHASE1_ACTIONS: Record<StageKey, PhaseAction[]> = {
  "not-started": [
    {
      text: "任務盤點：把核心部門的工作拆成任務，篩出 Top 10 適合 AI 化的任務。",
      href: "/amoeba-scan",
      linkLabel: "用任務變形蟲盤點器（3 分鐘）",
    },
    {
      text: "定治理框架：明確「AI 專案誰決定、資料誰負責、風險誰把關」。規模小由老闆＋部門主管直接盯；規模大設專責治理小組。",
    },
    {
      text: "資料盤點：AI 的成效很大一部分取決於資料。逐項確認候選任務「要用的資料在誰手上、乾不乾淨、能不能用」。",
    },
    {
      text: "員工 AI 素養：先上基礎課——AI 能做什麼、不能做什麼、公司允許用什麼——並選出各部門種子人員。",
    },
    {
      text: "訂驗證指標：每個試點開跑前先寫下「成功長什麼樣子」：每週省幾小時、品質提升多少、多少人實際使用。",
    },
  ],
  piloting: [
    {
      text: "試點盤點：把各部門正在試的工具與場景列成一張表，標註投入資源與初步成效。",
      href: "/pilot-trap-scan",
      linkLabel: "用 Pilot Trap 診斷量表確認卡關風險",
    },
    {
      text: "收斂試點：留下有明確價值證據的 1–2 個，其餘暫停或明確停掉——試點的目的是驗證，不是攤平投資。",
    },
    {
      text: "補上治理框架：為留下來的試點指定負責人、資料來源與驗證指標，讓它們從「個人實驗」變成「公司專案」。",
    },
    {
      text: "員工 AI 素養：把試點中學到的做法整理成基礎教材，讓其他部門跟著上手。",
    },
  ],
  partial: [
    {
      text: "成效盤點：檢視已導入的應用——哪些真的在用、省了多少時間、哪些已經變成無人維護的孤兒工具。",
    },
    {
      text: "收斂主線：從成效最好的應用回頭找它的共同條件（資料、流程、負責人），把下一階段資源壓在這條主線上。",
    },
    {
      text: "標準化治理：把各部門各自為政的 AI 工具與權限收攏到一套框架下，避免重複付費與資料風險。",
    },
    {
      text: "補資料基建：把主線要用的資料清洗、串接、權限整理好——規模化前，資料要先能撐住。",
    },
  ],
};

const PHASE2_GOAL =
  "用 1–2 個高價值任務跑完「導入 → 流程改造 → 驗證」的完整迴圈。這階段的重點不是數量，是完整。";

const PHASE2_ACTIONS: PhaseAction[] = [
  {
    text: "選定 1–2 個試點場景（依你勾選的範圍推薦，見下方清單），一個部門、一個痛點，先跑 60–90 天。",
  },
  {
    text: "導入工具時同步改造流程：AI 不是「貼上去」就有效，流程要為人機協作重新設計（誰做初稿、誰做審核、標準在哪）。",
  },
  {
    text: "每 2–4 週檢討一次：記錄省時、品質與使用率，與 ROI 估算對照。",
    href: "/roi-calculator",
    linkLabel: "用 ROI 估算器對照數字",
  },
  {
    text: "達標才擴大：驗證過的任務才進下一步；沒達標先診斷是工具、資料還是流程的問題，不要換一個工具重來一次。",
  },
  {
    text: "把試點學到的寫成內部 SOP 與知識庫，讓成功可以複製到下一階段。",
  },
];

const PHASE3_GOAL =
  "把驗證過的場景橫向展開，從「導入工具」升級為「建立組織能力」——讓 AI 變成制度的一部分，而不是幾個人的專案。";

const PHASE3_ACTIONS: PhaseAction[] = [
  {
    text: "橫向複製：把試點成功的任務推到其他部門與相近場景，每複製一處都套用同一套 SOP 與指標。",
  },
  {
    text: "校準投資配置：依 10-20-70 原則檢討——技術 10%、流程 20%、人 70%——看資源是否失衡（最常見的失衡：工具買太多、培訓給太少）。",
  },
  {
    text: "組織設計：設立 AI 種子／內部顧問角色，把 AI 能力寫進職務說明與升遷標準。",
  },
  {
    text: "常態治理：每季檢視資料品質、風險、員工回饋與使用率，滾動調整方向。",
  },
  {
    text: "滾動盤點：更新任務清單，挑出下一批 AI 化任務，進入下一輪循環。",
  },
];

const PHASE1_WARNING: Record<StageKey, string> = {
  "not-started": "別從買工具開始。先盤點，再決定買什麼——否則買回來的只是昂貴的孤兒，工具清單會在盤點後自己長出來。",
  piloting: "試點散落在各部門卻沒人統整，等於每個人都在重新發明輪子。這個月先把「誰統籌」定下來。",
  partial: "局部導入最怕各部門各買各的。第一階段的關鍵字是收斂與標準化，不是再開新戰場。",
};

const PHASE2_WARNING: Record<StageKey, string> = {
  "not-started": "試點一次不要超過兩個。貪多就什麼都驗證不了，還會讓團隊疲乏。",
  piloting: "試點超過一年還沒有規模化，就是典型的 Pilot Trap——資源耗盡、全公司開始懷疑 AI。",
  partial: "別急著加新場景。先讓舊場景跑出可複製的數字，再談擴張。",
};

/* ---------------- 投資配置 ---------------- */

const INVEST_SPLIT_DESC: Record<string, string> = {
  技術: "工具與平台授權、硬體與 API 費用",
  流程: "顧問輔導、流程改造與導入執行",
  人: "員工培訓、種子人員與組織能力建置",
};

function formatWan(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1).replace(/\.0$/, "")} 億`;
  if (n >= 100) return `${n.toLocaleString("zh-TW")} 萬`;
  return `${n} 萬`;
}

function computeInvestment(budget: BudgetKey, size: SizeKey) {
  const [lo, hi] = BUDGET_BANDS[budget][size];
  const mid = (lo + hi) / 2;
  const pcts = [
    { name: "技術", pct: 10 },
    { name: "流程", pct: 20 },
    { name: "人", pct: 70 },
  ];
  const splits: InvestmentSplit[] = pcts.map((p) => ({
    name: p.name,
    pct: p.pct,
    amount: formatWan(Math.round((mid * p.pct) / 100)),
    desc: INVEST_SPLIT_DESC[p.name],
  }));
  return {
    label: `年度投資預算（10-20-70 配置）`,
    total: `${formatWan(lo)} – ${formatWan(hi)}`,
    splits,
    note:
      budget === "unsure"
        ? "預算還不清楚沒關係——先用「穩健」級距當參考，第一階段盤點完成後再校準。預算的意義不是一次編足，而是讓每一塊錢都對應一個要驗證的問題。"
        : "10-20-70 是經驗原則：技術只占一成，七成要花在「人」身上——培訓、種子人員、把流程改到能人機協作。工具買得再多，人不會用，ROI 就是零。",
  };
}

/* ---------------- 主函式 ---------------- */

export function generateRoadmap(input: RoadmapInput): RoadmapResult {
  const size = SIZE_META[input.size];
  const stage = STAGE_META[input.stage].label;
  const areas = input.areas.map((a) => AREA_META[a].label);
  const areaKeys = input.areas;
  const isBig = input.size === "l" || input.size === "xl";

  const headline = `你的組織 ${size.label}、聚焦 ${areas.length} 個領域（${areas.join("、")}），目前「${stage}」——這是一張為你排的 12 個月 AI 轉型路線圖。`;

  const summaryParts = [
    "路線圖的邏輯很簡單：先盤點（第 1–3 個月）、再試點（第 4–8 個月）、後規模化（第 9–12 個月）。前三個月看不到省時的數字是正常的——那是在為後九個月鋪路。",
  ];
  if (isBig) {
    summaryParts.push(
      "你的組織規模較大，治理與資料盤點要更早啟動：一次錯誤的採購決策，影響的是整個集團。"
    );
  } else {
    summaryParts.push(
      "你的組織規模較小，優勢是決策快——三個月內就能跑完一個完整試點，這正是小組織對抗大公司的武器。"
    );
  }
  if (input.stage === "piloting") {
    summaryParts.push("你已經在試點，路線圖會直接從「收斂試點」開始，幫你把實驗變成制度。");
  }
  const summary = summaryParts.join(" ");

  // Phase 1 scenarios：第一階段不做導入，但盤點時要鎖定範圍內的任務類型
  const phase1ScenarioLabels = areaKeys.map((k) => AREA_META[k].label);
  const phase2Scenarios = areaKeys.flatMap((k) => AREA_META[k].p2Scenarios).slice(0, 6);
  const phase3Scenarios = areaKeys.map((k) => AREA_META[k].p3Expand);

  const phases: RoadmapPhase[] = [
    {
      id: "phase1",
      months: "第 1–3 個月",
      theme: "奠基與診斷",
      goal: PHASE1_GOAL[input.stage],
      actions: PHASE1_ACTIONS[input.stage],
      scenarios: [`盤點重點領域：${phase1ScenarioLabels.join("、")}`],
      metrics: ["任務盤點完成（Top 10 清單）", "治理框架與負責人定案", "種子人員完成培訓"],
      warning: PHASE1_WARNING[input.stage],
    },
    {
      id: "phase2",
      months: "第 4–8 個月",
      theme: "試點落地",
      goal: PHASE2_GOAL,
      actions: PHASE2_ACTIONS,
      scenarios: phase2Scenarios,
      metrics: ["試點達標率（目標八成以上）", "每任務每週節省工時", "員工實際使用率"],
      warning: PHASE2_WARNING[input.stage],
    },
    {
      id: "phase3",
      months: "第 9–12 個月",
      theme: "規模化與制度化",
      goal: PHASE3_GOAL,
      actions: PHASE3_ACTIONS,
      scenarios: phase3Scenarios,
      metrics: ["覆蓋部門與任務數", "累計節省工時與成本", "AI 使用滲透率"],
    },
  ];

  const watchouts: string[] = (() => {
    switch (input.stage) {
      case "not-started":
        return [
          "最大的風險不是「太慢開始」，而是「亂開始」。前三個月都在打底，請留足耐心。",
          "AI 轉型的成敗，八成取決於資料與流程，兩成取決於工具——把心力放在前兩者。",
        ];
      case "piloting":
        return [
          "試點超過一年請把「規模化」列為最高優先級，而不是再開新試點。",
          "試點成功的定義不是「工具跑起來」，而是「數字被驗證、SOP 被寫下」。",
        ];
      case "partial":
        return [
          "已局部導入時，先讓舊場景跑出可複製的數字，再談加新場景。",
          "注意各部門重複付費：同類工具買三套，等於白白燒掉流程與人的預算。",
        ];
    }
  })();

  return {
    headline,
    summary,
    phases,
    investment: computeInvestment(input.budget, input.size),
    watchouts,
    footerNote:
      "本路線圖由規則引擎依你輸入的規模、範圍、現況與預算生成，屬於通用建議框架，不構成正式顧問方案。每個組織的資料條件與產業特性不同，落地前建議與專業顧問一起校準。",
  };
}

/* ---------------- 複製用純文字報告 ---------------- */

export function roadmapToText(r: RoadmapResult): string {
  const lines: string[] = [];
  lines.push("AI 轉型路線圖（12 個月）");
  lines.push("=".repeat(30));
  lines.push(r.headline);
  lines.push("");
  lines.push(r.summary);
  lines.push("");

  r.phases.forEach((p) => {
    lines.push(`【${p.months}｜${p.theme}】`);
    lines.push(`目標：${p.goal}`);
    lines.push("關鍵行動：");
    p.actions.forEach((a, i) => lines.push(`${i + 1}. ${a.text}`));
    if (p.scenarios.length > 0) {
      lines.push(`推薦場景：${p.scenarios.join("、")}`);
    }
    lines.push(`成功指標：${p.metrics.join("、")}`);
    if (p.warning) lines.push(`⚠️ ${p.warning}`);
    lines.push("");
  });

  lines.push(`【${r.investment.label}】`);
  lines.push(`總預算級距：${r.investment.total}（新台幣／年）`);
  r.investment.splits.forEach((s) => {
    lines.push(`- ${s.name} ${s.pct}%（約 ${s.amount}）：${s.desc}`);
  });
  lines.push(r.investment.note);
  lines.push("");

  lines.push("全程注意：");
  r.watchouts.forEach((w, i) => lines.push(`${i + 1}. ${w}`));
  lines.push("");
  lines.push(r.footerNote);
  lines.push("");
  lines.push("— 榕耀管顧 RongRise Consulting · https://rong-rise.com/ai-roadmap");
  return lines.join("\n");
}
