/* ============================================
   AI 投資配置體檢（10-20-70 Split Checkup）— 規則引擎
   2026-09-22 小賀開發（第二批 B2-5 微型工具）

   方法論（跨框架交織，避免單一框架）：
   - 10-20-70 投資原則（顧問業常用經驗原則；原始版本為 10% 演算法、
     20% 技術與資料、70% 人與流程）——本工具把三桶重新對應為
     「技術／流程／人」，並依導入階段給出建議區間
   - 階段位移：10-20-70 是整體原則，不同導入階段的合理區間會位移
     （起步期技術占比低、流程與人高；規模化期技術授權上升）
   - 預算釋出節奏 30/40/30：預算與驗證綁定，避免一次給完變成沒有 gate 的試點
     （對應 Pilot Trap：資源耗盡、全公司開始懷疑 AI）
   - 《任務變形蟲》：任務 = 分析單位，先盤點再花錢

   設計原則（與 amoeba-scan / ai-roadmap / ai-governance-scan 一致）：
   - 透明：參數與假設公開，不黑箱
   - 保守：給區間而非單點，避免假精確
   - 零依賴：純規則引擎，無 LLM API，離線可跑
   ============================================ */

export type BucketKey = "tech" | "process" | "people";
export type StageKey = "starting" | "piloting" | "scaling";
export type BucketStatus = "ok" | "low" | "high";

export interface AllocationInput {
  stage: StageKey;
  /** 年度 AI 投資預算（萬元 NTD） */
  budgetWan: number;
  /** 目前（或預計）配置比例，三桶合計理論上 100 */
  techPct: number;
  processPct: number;
  peoplePct: number;
}

export interface BucketResult {
  key: BucketKey;
  label: string;
  icon: string;
  desc: string;
  currentPct: number;
  currentAmount: string;
  targetPct: number;
  targetRange: [number, number];
  targetAmount: string;
  /** 現況 - 目標中位數（正 = 超配，負 = 不足） */
  deviationPp: number;
  /** 超出建議區間的幅度（0 = 落在區間內） */
  beyondPp: number;
  status: BucketStatus;
  /** 需補足（正）或可釋出（負）的金額，單位：萬 */
  gapWan: number;
  gapLabel: string;
  risk: string;
  actions: string[];
}

export interface ReleasePhase {
  label: string;
  pct: number;
  amount: string;
  gate: string;
}

export interface SplitResult {
  healthScore: number;
  grade: string;
  gradeColor: "green" | "yellow" | "orange" | "red";
  headline: string;
  summary: string;
  inputTotalPct: number;
  buckets: BucketResult[];
  /** 主要失衡診斷（最多 3 條） */
  diagnosis: string[];
  /** 症狀自檢（依失衡桶給對應症狀） */
  symptoms: { bucket: string; items: string[] }[];
  releasePhases: ReleasePhase[];
  conversions: { title: string; lines: string[]; note: string }[];
  disclaimer: string;
}

/* ---------------- 輸入選項 meta ---------------- */

export const BUCKET_META: Record<BucketKey, { label: string; icon: string; desc: string }> = {
  tech: {
    label: "技術",
    icon: "🧰",
    desc: "工具與平台授權、API 用量、硬體與系統整合",
  },
  process: {
    label: "流程",
    icon: "🔧",
    desc: "流程重新設計、顧問輔導、導入執行與文件化",
  },
  people: {
    label: "人",
    icon: "🧑‍🏫",
    desc: "員工培訓、種子人員、內部講師與組織能力建置",
  },
};

export const BUCKET_ORDER: BucketKey[] = ["tech", "process", "people"];

export const STAGE_META: Record<
  StageKey,
  { label: string; hint: string; targets: Record<BucketKey, [number, number]>; rationale: string }
> = {
  starting: {
    label: "起步期（還沒開始，或剛起步）",
    hint: "先把「要做什麼」想清楚，工具留一筆小額驗證金就好",
    targets: { tech: [10, 20], process: [20, 30], people: [55, 65] },
    rationale:
      "起步期最大的成本不是工具，是共識與盤點。先把任務盤點與主管共識做完，技術桶只需要一筆小額驗證金——先驗證一個場景，再談採購規模。",
  },
  piloting: {
    label: "試點期（有 1–2 個場景在跑）",
    hint: "標準 10-20-70 的區間最適用於這個階段",
    targets: { tech: [5, 15], process: [15, 25], people: [65, 75] },
    rationale:
      "試點期的目標是驗證，不是攤平投資。工具夠用就好，錢要花在讓試點真的跑出數字：把流程改到能人機協作，加上足夠的使用培訓。",
  },
  scaling: {
    label: "規模化期（已局部導入，要往外擴散）",
    hint: "授權與整合費用會上升，但「人」仍是最大一桶",
    targets: { tech: [15, 25], process: [15, 25], people: [55, 65] },
    rationale:
      "規模化期技術桶會自然上升（授權、整合、資安），但擴散靠的是內部講師與種子人員，不是更多工具——「人」的比重不能掉。",
  },
};

/* ---------------- 失衡風險與行動 ---------------- */

const RISK_TEXT: Record<BucketKey, { high: string; low: string }> = {
  tech: {
    high: "技術桶超配 = 工具囤積風險。授權買了、人不會用，帳面上有 AI，實際上 ROI 是零；而且重複授權會讓後續整合更難。",
    low: "技術桶偏低 = 驗證能力不足。員工學了卻沒有工具可用，熱度會退；想驗證的想法排隊等採購，等到機會都過了。",
  },
  process: {
    high: "流程桶超配 = 改造沒對準痛點。如果改的是文件與表單，而不是決策節點與審核關卡，投再多也只是把紙本數位化。",
    low: "流程桶不足 = 舊流程套新工具。工具照著舊流程走，效果打折，員工只會覺得「多了一個系統要填」。",
  },
  people: {
    high: "人桶超配是好事，但要確認錢真的花在能力上（實作工作坊、陪跑、內部講師養成），而不是買了一堆線上課程帳號沒人看。",
    low: "人桶不足是最常見的致命傷：工具買了，但真正在用的人不多。培訓與種子人員的錢不能省，這是唯一會留在公司的資產。",
  },
};

const ACTIONS: Record<BucketKey, { high: string[]; low: string[]; ok: string[] }> = {
  tech: {
    high: [
      "先盤點重複授權：同一功能買了兩套工具的機率不低，砍掉重複的再談新增。",
      "新工具採購前先問一句：現有工具做不到什麼？答不出來就先不買。",
      "技術預算改成里程碑解鎖——試點驗證通過，才撥下一筆。",
    ],
    low: [
      "至少留一筆「小額驗證金」：單一工具、單一團隊、8–12 週，先把一個場景跑出數字。",
      "優先選能與現有系統銜接的工具，避免為了省錢而導入無法整合的孤島工具。",
    ],
    ok: ["技術桶落在建議區間：維持「先驗證、再採購」的節奏，避免年末預算消化式採購。"],
  },
  process: {
    high: [
      "確認改的是流程還是文件：沒有動到決策節點與審核關卡的改造，通常不會產生效果。",
      "挑一個最痛的流程做端到端重畫，不要同時開五條改造線。",
    ],
    low: [
      "挑 1–2 個核心流程重畫：誰決策、誰審核、哪些步驟可以交給 AI——畫完再上工具。",
      "把流程改動寫成可交接的文件，否則試點一結束，做法就隨著人離開而消失。",
    ],
    ok: ["流程桶落在建議區間：持續把試點跑出來的流程做法文件化，這是規模化的前提。"],
  },
  people: {
    high: [
      "檢查培訓形式：實作工作坊＋陪跑的效果遠大於線上課程帳號，錢要花在有練習、有產出的形式。",
      "把培訓對象從「有興趣的人」改成「每個部門指定 1–2 位種子人員」，讓能力擴散有節點。",
    ],
    low: [
      "先補種子人員與主管的 AI 素養課：主管不懂，就不會給時間，員工自然沒時間學。",
      "把培訓排進工作時間並設練習任務，否則「太忙沒時間學」會變成永遠的理由。",
      "設定一個可檢查的目標，例如「每部門至少 2 人能獨立完成一個 AI 輔助任務」。",
    ],
    ok: ["人桶落在建議區間：接著把內部講師養成寫進計畫，讓培訓能力留在公司。"],
  },
};

const SYMPTOMS: Record<BucketKey, { high: string[]; low: string[] }> = {
  tech: {
    high: [
      "買了授權，但實際每週在用的只有少數幾個人",
      "工具清單裡有兩三套功能重疊的產品",
      "採購由單一部門決定，其他部門上線當天才知道",
    ],
    low: ["培訓上完了，但回去沒有工具可以用", "想驗證的想法排隊等採購，等到熱度都退了"],
  },
  process: {
    high: ["改了一堆文件與表單，但決策關卡沒動", "導入會議開了三次，每次都回到原點"],
    low: [
      "上了 AI 工具，簽核流程跟以前一模一樣",
      "員工說：只是多了一個系統要填",
      "舊表單原封不動搬上線，等於數位化的紙本",
    ],
  },
  people: {
    high: ["培訓預算拿去買線上課程帳號，但沒人看完", "課程辦完沒有實作練習，學完就忘"],
    low: [
      "只辦過一次 AI 培訓（或根本還沒辦）",
      "沒有指定任何部門的 AI 種子人員",
      "主管自己也說不出 AI 要解決什麼問題",
      "導入後使用率一路下滑，問卷理由是「太忙沒時間學」",
    ],
  },
};

/* ---------------- 預算釋出節奏 ---------------- */

const RELEASE_PHASES: { label: string; pct: number; gate: string }[] = [
  {
    label: "第 1–4 月",
    pct: 30,
    gate: "任務盤點完成、選定 1–2 個試點場景、每部門種子人員與專案負責人到位——這三件事沒完成，第二筆錢不撥。",
  },
  {
    label: "第 5–8 月",
    pct: 40,
    gate: "試點跑出可量測的成效（工時、週期、品質至少一項有數字）——達標才擴大，沒達標先修流程，不要加預算。",
  },
  {
    label: "第 9–12 月",
    pct: 30,
    gate: "至少一個場景完成規模化，且內部講師能自行培訓新同事——能力留在公司，而不是留在顧問身上。",
  },
];

/* ---------------- 換算假設（透明公開） ---------------- */

/** 企業 AI 實作培訓每小時成本概估（元）：外部講師＋場地＋學員工時機會成本 */
const TRAINING_HOUR_COST_LO = 4000;
const TRAINING_HOUR_COST_HI = 8000;
/** 每人每年合理的 AI 培訓時數（小時） */
const HOURS_PER_PERSON = 12;
/** 企業級 AI 工具年費概估（萬元/套） */
const TOOL_COST_LO = 10;
const TOOL_COST_HI = 30;

export const DISCLAIMER =
  "10-20-70 是顧問業常用的經驗原則，原始版本為「10% 演算法、20% 技術與資料、70% 人與流程」；本工具將三桶重新對應為「技術／流程／人」，各階段建議區間為校準參考值，不是會計準則。金額換算採市場行情粗略估算，非任何報價。實際配置仍須回到你的策略目標、既有資產與驗證結果。";

/* ---------------- 工具函式 ---------------- */

export function formatWan(n: number): string {
  if (!isFinite(n) || n <= 0) return "0 萬";
  if (n >= 10000) {
    const yi = n / 10000;
    return `${yi.toFixed(1).replace(/\.0$/, "")} 億`;
  }
  const rounded = n >= 100 ? Math.round(n) : Math.round(n * 10) / 10;
  return `${rounded.toLocaleString("zh-TW")} 萬`;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

/** 一位小數，整數時不顯示 .0 */
function oneDec(n: number): string {
  return n.toFixed(1).replace(/\.0$/, "");
}

function mid([lo, hi]: [number, number]): number {
  return (lo + hi) / 2;
}

export function gradeOf(score: number): { grade: string; color: "green" | "yellow" | "orange" | "red" } {
  if (score >= 90) return { grade: "校準良好", color: "green" };
  if (score >= 75) return { grade: "略有偏差", color: "yellow" };
  if (score >= 55) return { grade: "明顯失衡", color: "orange" };
  return { grade: "高風險配置", color: "red" };
}

/* ---------------- 主函式 ---------------- */

export function evaluateAllocation(input: AllocationInput): SplitResult {
  const stage = STAGE_META[input.stage];
  const budget = Math.max(0, Math.round(input.budgetWan || 0));

  const current: Record<BucketKey, number> = {
    tech: clamp(Math.round(input.techPct || 0), 0, 100),
    process: clamp(Math.round(input.processPct || 0), 0, 100),
    people: clamp(Math.round(input.peoplePct || 0), 0, 100),
  };
  const inputTotalPct = current.tech + current.process + current.people;

  let penalty = 0;
  const buckets: BucketResult[] = BUCKET_ORDER.map((key) => {
    const meta = BUCKET_META[key];
    const range = stage.targets[key];
    const targetPct = mid(range);
    const cur = current[key];
    const dev = cur - targetPct;

    let status: BucketStatus = "ok";
    if (cur < range[0]) status = "low";
    else if (cur > range[1]) status = "high";

    // 落在建議區間內 → 不扣分；超出區間才依超出幅度扣分（上限 25 分／桶）
    const beyondPp = Math.max(0, range[0] - cur, cur - range[1]);
    penalty += Math.min(beyondPp * 0.7, 25);

    const currentAmountWan = (budget * cur) / 100;
    const targetAmountWan = (budget * targetPct) / 100;
    const gapWan = Math.round(targetAmountWan - currentAmountWan);

    const gapLabel =
      status === "ok"
        ? "落在建議區間內"
        : cur === 0
        ? "這一桶目前沒有編列預算"
        : gapWan > 0
        ? `建議補足約 ${formatWan(gapWan)}`
        : `可釋出約 ${formatWan(Math.abs(gapWan))}（轉到其他桶）`;

    return {
      key,
      label: meta.label,
      icon: meta.icon,
      desc: meta.desc,
      currentPct: cur,
      currentAmount: formatWan(Math.round(currentAmountWan)),
      targetPct,
      targetRange: range,
      targetAmount: formatWan(Math.round(targetAmountWan)),
      deviationPp: Math.round(dev),
      beyondPp: Math.round(beyondPp),
      status,
      gapWan,
      gapLabel,
      risk: status === "ok" ? "" : RISK_TEXT[key][status],
      actions: ACTIONS[key][status],
    };
  });

  // 合計不等於 100 的懲罰（避免使用者少填一桶卻拿到高分）
  const totalDev = Math.abs(inputTotalPct - 100);
  if (totalDev > 0) penalty += Math.min(totalDev * 1.5, 15);

  const healthScore = Math.round(clamp(100 - penalty, 0, 100));
  const { grade, color } = gradeOf(healthScore);

  const offBuckets = buckets.filter((b) => b.status !== "ok");
  const worst = offBuckets
    .slice()
    .sort((a, b) => b.beyondPp - a.beyondPp)[0];

  const stageShort = stage.label.replace(/（.*）/, "");

  const headline =
    offBuckets.length === 0
      ? "配置落在建議區間，接下來比的是執行紀律"
      : worst && worst.key === "people" && worst.status === "high"
      ? `「人」桶高於建議區間 ${worst.beyondPp} 個百分點——占比高通常不是壞事，但要確認錢花在能力養成上，而不是買了沒人看的課程`
      : worst && worst.beyondPp < 10
      ? `配置大致合理，只有小幅偏移：${worst.label}桶${worst.status === "high" ? "超出" : "低於"}建議區間 ${
          worst.beyondPp
        } 個百分點`
      : worst
      ? `最需要調整的是「${worst.label}」桶——${worst.status === "high" ? "超出" : "低於"}建議區間 ${
          worst.beyondPp
        } 個百分點`
      : "配置結構大致合理，仍有校準空間";

  const summary =
    offBuckets.length === 0
      ? `以${stageShort}來說，技術／流程／人三桶都落在建議區間內。配置對了不等於會成功——真正的差別在於預算有沒有跟驗證綁定：先把錢花在能跑出數字的地方，達標才往下撥。`
      : `以${stageShort}來說，有 ${offBuckets.length} 個桶落在建議區間之外。10-20-70 不是要你按比例記帳，而是提醒一件容易被忽略的事：工具買得再多，人不會用，ROI 就是零。常見的情況是「技術超配、人不足」——重點不是立刻改預算，而是先知道錢現在花在哪裡。調整順序建議「先補人、再修流程、最後才談加購技術」。`;

  const diagnosis: string[] = [];
  if (totalDev > 0) {
    diagnosis.push(
      `三桶合計為 ${inputTotalPct}%，不等於 100%——可能有桶別沒填到，或還有未列入的支出（例如內部人力工時）。先把帳算完整，診斷才有意義。`
    );
  }
  for (const b of offBuckets) {
    diagnosis.push(
      `${b.icon} ${b.label}桶：目前 ${b.currentPct}%（${b.currentAmount}），建議區間 ${b.targetRange[0]}–${b.targetRange[1]}%${
        b.status === "high" ? "，屬於超配" : "，屬於不足"
      }。${b.risk}`
    );
  }
  if (offBuckets.length === 0) {
    diagnosis.push(
      "三桶都在建議區間內。接下來要防的不是配置錯誤，而是「沒有 gate 的花錢方式」——把預算切成 30/40/30，與驗證里程碑綁定。"
    );
  }

  const symptoms = offBuckets.map((b) => ({
    bucket: `${b.icon} ${b.label}桶（${b.status === "high" ? "超配" : "不足"}）`,
    items: SYMPTOMS[b.key][b.status === "high" ? "high" : "low"],
  }));

  const releasePhases: ReleasePhase[] = (() => {
    let allocated = 0;
    return RELEASE_PHASES.map((p, i) => {
      // 最後一期用「總額扣掉前兩期」，避免四捨五入後三期加總與總額對不上
      const amountWan =
        i === RELEASE_PHASES.length - 1 ? Math.max(0, budget - allocated) : Math.round((budget * p.pct) / 100);
      allocated += amountWan;
      return {
        label: p.label,
        pct: p.pct,
        amount: formatWan(amountWan),
        gate: p.gate,
      };
    });
  })();

  // 換算：人桶 → 培訓人時；技術桶 → 工具年費套數
  const peopleAmountWan = (budget * current.people) / 100;
  const techAmountWan = (budget * current.tech) / 100;
  const peopleYuan = peopleAmountWan * 10000;

  const hoursHi = Math.round(peopleYuan / TRAINING_HOUR_COST_LO);
  const hoursLo = Math.round(peopleYuan / TRAINING_HOUR_COST_HI);
  const peopleHi = Math.round(hoursHi / HOURS_PER_PERSON);
  const peopleLo = Math.round(hoursLo / HOURS_PER_PERSON);

  const toolsHi = techAmountWan / TOOL_COST_LO;
  const toolsLo = techAmountWan / TOOL_COST_HI;

  const conversions = [
    {
      title: `🧑‍🏫 「人」桶能撐多少培訓？`,
      lines: [
        `你的「人」桶預算為 ${formatWan(Math.round(peopleAmountWan))}（占 ${current.people}%）。`,
        `以企業 AI 實作培訓每小時 4,000–8,000 元（含外部講師、場地與學員工時機會成本）估，約可支撐 ${
          hoursLo === hoursHi ? hoursLo : `${hoursLo}–${hoursHi}`
        } 人時的培訓。`,
        `若以每人每年 12 小時的合理培訓量計，約等於 ${peopleLo === peopleHi ? peopleLo : `${peopleLo}–${peopleHi}`} 位同仁的完整養成。`,
      ],
      note: "換算目的是檢查「人」桶是不是只是一句口號。實際成本依講師、形式（工作坊／陪跑／線上課）差異很大，實作型工作坊的單價會明顯高於線上課，但效果也差最多。",
    },
    {
      title: "🧰 「技術」桶能買多少工具？",
      lines: [
        `你的「技術」桶預算為 ${formatWan(Math.round(techAmountWan))}（占 ${current.tech}%）。`,
        `以企業級 AI 工具年費 10–30 萬／套（含授權與 API 用量）估，約等於 ${oneDec(toolsLo)}–${oneDec(
          toolsHi
        )} 套工具的年度費用。`,
        "工具不是越多越好：同一流程用兩套工具，通常是浪費，還會讓資料散在兩邊。",
      ],
      note: "先把「要驗證什麼問題」寫下來，再決定買哪一套。以問題為單位採購，而不是以部門為單位採購。",
    },
  ];

  return {
    healthScore,
    grade,
    gradeColor: color,
    headline,
    summary,
    inputTotalPct,
    buckets,
    diagnosis,
    symptoms,
    releasePhases,
    conversions,
    disclaimer: DISCLAIMER,
  };
}

/* ---------------- 純文字報告 ---------------- */

export function splitReportText(input: AllocationInput, r: SplitResult): string {
  const stage = STAGE_META[input.stage];
  const lines: string[] = [];
  lines.push("【AI 投資配置體檢（10-20-70）】");
  lines.push(`導入階段：${stage.label}`);
  lines.push(`年度預算：${formatWan(Math.round(input.budgetWan || 0))}`);
  lines.push(`目前配置：技術 ${r.buckets[0].currentPct}% / 流程 ${r.buckets[1].currentPct}% / 人 ${r.buckets[2].currentPct}%`);
  lines.push("");
  lines.push(`配置健康分：${r.healthScore} 分（${r.grade}）`);
  lines.push(r.headline);
  lines.push("");
  lines.push("── 三桶對照 ──");
  for (const b of r.buckets) {
    lines.push(
      `${b.icon} ${b.label}：${b.currentPct}%（${b.currentAmount}）｜建議 ${b.targetRange[0]}–${b.targetRange[1]}%（中位 ${b.targetPct}%，${b.targetAmount}）｜${b.gapLabel}`
    );
  }
  lines.push("");
  lines.push("── 診斷 ──");
  for (const d of r.diagnosis) lines.push(`• ${d}`);
  lines.push("");
  lines.push("── 調整行動 ──");
  for (const b of r.buckets) {
    lines.push(`${b.icon} ${b.label}桶：`);
    for (const a of b.actions) lines.push(`  - ${a}`);
  }
  if (r.symptoms.length > 0) {
    lines.push("");
    lines.push("── 症狀自檢 ──");
    for (const s of r.symptoms) {
      lines.push(`${s.bucket}`);
      for (const it of s.items) lines.push(`  □ ${it}`);
    }
  }
  lines.push("");
  lines.push("── 預算釋出節奏（與驗證綁定） ──");
  for (const p of r.releasePhases) {
    lines.push(`• ${p.label}：${p.pct}%（${p.amount}）— ${p.gate}`);
  }
  lines.push("");
  lines.push("── 換算參考 ──");
  for (const c of r.conversions) {
    lines.push(c.title);
    for (const l of c.lines) lines.push(`  - ${l}`);
  }
  lines.push("");
  lines.push(`※ ${r.disclaimer}`);
  lines.push("");
  lines.push("（本報告由榕耀管顧 AI 投資配置體檢工具產出：https://rong-rise.com/ai-investment-split）");
  return lines.join("\n");
}
