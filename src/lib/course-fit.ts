/* ============================================
   課程適配度自評 — 規則引擎
   2026-09-29 小賀開發（第三批 B3-1 微型工具）

   用途：服務 Agentic AI for HR 初階班（2026-11-14）與進階班（2026-12-05），
         讓報名前自評「你的組織準備好上這堂課了嗎」。

   方法論：
   - 以「能否帶回可執行產出」為判斷核心，而非純 AI 知識量
   - 初階班重點：有沒有「可被交辦的明確任務」
   - 進階班重點：有沒有「多個已上線、需要銜接的工作流程」
   - 同時評估「組織準備度」（主管支持、資料可取得、時間投入）

   設計原則（與 roi-calculator / ai-roadmap / ai-investment-split 一致）：
   - 透明：規則公開，不黑箱
   - 保守：建議留餘地，不強推貴的班
   - 零依賴：純規則引擎，無 LLM API，離線可跑
   ============================================ */

export type RoleKey = "hr" | "owner" | "consultant" | "it" | "other";
export type ExperienceKey = "none" | "tool_user" | "agent_builder" | "team_runner";
export type ReadinessKey = "no" | "partial" | "yes";
export type CommitmentKey = "half" | "full" | "two_days";

export interface FitInput {
  role: RoleKey;
  experience: ExperienceKey;
  hasTask: ReadinessKey;
  hasData: ReadinessKey;
  hasSupport: ReadinessKey;
  commitment: CommitmentKey;
}

export type CourseLevel = "beginner" | "advanced" | "not_ready";

export interface CourseMatch {
  level: CourseLevel;
  title: string;
  slug: string;
  date: string;
  reason: string;
  previewList: string[];
}

export interface PrepItem {
  text: string;
  done: boolean;
}

export interface FitResult {
  match: CourseMatch;
  readinessScore: number;
  summary: string;
  breakdown: { label: string; score: number; max: number; note: string }[];
  prep: PrepItem[];
  cta: { primary: string; secondary?: string };
}

/* ---------------- 輸入選項 meta ---------------- */

export const ROLE_META: Record<RoleKey, { label: string; score: number }> = {
  hr: { label: "人資主管 / HRBP / 人資夥伴", score: 3 },
  owner: { label: "企業主 / 部門主管", score: 2 },
  consultant: { label: "顧問 / 講師 / 專案經理", score: 3 },
  it: { label: "IT / 數位轉型相關", score: 2 },
  other: { label: "其他職能", score: 1 },
};

export const EXPERIENCE_META: Record<ExperienceKey, { label: string; score: number; beginnerPct: number; advancedPct: number }> = {
  none: {
    label: "還沒有實際使用 AI 工具做過工作",
    score: 0,
    beginnerPct: 100,
    advancedPct: 0,
  },
  tool_user: {
    label: "會用 ChatGPT / Claude / Gemini 等工具輔助工作",
    score: 1,
    beginnerPct: 90,
    advancedPct: 10,
  },
  agent_builder: {
    label: "已經建置過一個可以重複執行任務的 AI 員工 / agent",
    score: 3,
    beginnerPct: 40,
    advancedPct: 60,
  },
  team_runner: {
    label: "已經在管理多個 AI 員工或自動化流程產線",
    score: 5,
    beginnerPct: 10,
    advancedPct: 90,
  },
};

export const READINESS_META: Record<ReadinessKey, { label: string; score: number }> = {
  no: { label: "還沒有", score: 0 },
  partial: { label: "有一點，但不明確", score: 1 },
  yes: { label: "已經有明確清單", score: 2 },
};

export const COMMITMENT_META: Record<CommitmentKey, { label: string; score: number }> = {
  half: { label: "只能撥出 0.5 天（講座式）", score: 0 },
  full: { label: "可以撥出 1 天完整課程", score: 1 },
  two_days: { label: "可以撥出 2 天，含課後實作", score: 2 },
};

const COURSE_INFO = {
  beginner: {
    title: "Agentic AI for HR 初階班",
    slug: "agentic-ai-for-hr-workshop",
    date: "2026-11-14",
  },
  advanced: {
    title: "Agentic AI for HR 進階班",
    slug: "agentic-ai-for-hr-advanced-workshop",
    date: "2026-12-05",
  },
};

/* ---------------- 計算 ---------------- */

export function evaluateCourseFit(input: FitInput): FitResult {
  const role = ROLE_META[input.role];
  const exp = EXPERIENCE_META[input.experience];
  const task = READINESS_META[input.hasTask];
  const data = READINESS_META[input.hasData];
  const support = READINESS_META[input.hasSupport];
  const commitment = COMMITMENT_META[input.commitment];

  const breakdown = [
    { label: "角色契合度", score: role.score, max: 3, note: role.label },
    { label: "AI 使用經驗", score: exp.score, max: 5, note: exp.label },
    { label: "可交辦任務清單", score: task.score, max: 2, note: task.label },
    { label: "資料可取得性", score: data.score, max: 2, note: data.label },
    { label: "主管 / 組織支持", score: support.score, max: 2, note: support.label },
    { label: "可投入時間", score: commitment.score, max: 2, note: commitment.label },
  ];

  const maxScore = breakdown.reduce((s, b) => s + b.max, 0);
  const rawScore = breakdown.reduce((s, b) => s + b.score, 0);
  const readinessScore = Math.round((rawScore / maxScore) * 100);

  // 決定班級：先算「適合進階」機率，再依門檻決定
  const advancedProbability =
    exp.advancedPct * 0.45 +
    (input.hasTask === "yes" ? 25 : input.hasTask === "partial" ? 10 : 0) +
    (input.hasData === "yes" ? 10 : 0) +
    (input.hasSupport === "yes" ? 10 : 0) +
    (input.commitment === "two_days" ? 10 : 0);

  // 不推薦任何課程的條件：連一天都無法投入、或完全沒有任務也沒有經驗
  const notReady =
    input.commitment === "half" ||
    (input.experience === "none" && input.hasTask === "no" && input.hasData === "no");

  let level: CourseLevel;
  if (notReady) {
    level = "not_ready";
  } else if (advancedProbability >= 60) {
    level = "advanced";
  } else {
    level = "beginner";
  }

  const course = COURSE_INFO[level === "not_ready" ? "beginner" : level];

  let reason: string;
  let previewList: string[];
  let summary: string;
  let prep: PrepItem[];
  let cta: { primary: string; secondary?: string };

  switch (level) {
    case "advanced":
      reason = "你已經有單一 AI 員工的實作經驗，下一個瓶頸是「如何讓多個 AI 員工分工、交接、檢查」。進階班就是為這個階段設計的。";
      previewList = [
        "設計一條多代理人流程（角色分工 + 交接規則 + 失敗退回）",
        "把重複性 HR 流程拆解成可交辦的任務鏈",
        "建立核准門檻、責任歸屬與禁區清單等治理規則",
      ];
      summary = `你的準備度 ${readinessScore} 分。以經驗與任務明確度來看，建議直接上 12/5 進階班；如果想先補穩基礎，11/14 初階班也可以當複習。`;
      prep = [
        { text: "列出你目前手上已經在運作的 AI 工具或 agent（哪怕只有一個）", done: input.experience !== "none" },
        { text: "帶一個想改成「多步驟協作」的 HR 流程來課堂上拆解", done: input.hasTask === "yes" },
        { text: "確認 12/5 可以完整出席，並在課後一週內開始實作", done: input.commitment === "two_days" },
      ];
      cta = {
        primary: "/courses/agentic-ai-for-hr-advanced-workshop",
        secondary: "/courses/agentic-ai-for-hr-workshop",
      };
      break;

    case "beginner":
      reason = "你已經具備基礎，但還沒有把 AI 從「對話工具」變成「可交辦工作的同事」。初階班會帶你完成這個轉換。";
      previewList = [
        "判讀一個 AI 導入案例是真的落地還是 demo 好看",
        "從零建置第一個 AI 員工：角色、任務邊界、工具與驗收標準",
        "帶走一份可直接使用的 AI 員工工作說明書",
      ];
      summary = `你的準備度 ${readinessScore} 分。建議先上 11/14 初階班，把「一個 AI 員工」的生命週期跑完整；進階班等你有 1–2 個 agent 上線後再上會更有收穫。`;
      prep = [
        { text: "寫下你工作中最想交出去的三件事（不用很完整，有方向即可）", done: input.hasTask !== "no" },
        { text: "準備一個付費版 AI 工具帳號（ChatGPT / Claude / Gemini 皆可）", done: input.experience !== "none" },
        { text: "確認 11/14 可以完整出席，並攜帶可連網筆電", done: input.commitment !== "half" },
      ];
      cta = {
        primary: "/courses/agentic-ai-for-hr-workshop",
        secondary: "/courses",
      };
      break;

    case "not_ready":
    default:
      reason = "現階段直接上課可能比較吃力——不是你不適合，而是組織還沒準備好承接課堂產出。先把預習做完，下個梯次會更有價值。";
      previewList = [
        "先從免費工具開始：用 ChatGPT / Claude 處理一個重複性小任務",
        "觀察你團隊裡「每天都在做、但沒人喜歡做」的工作清單",
        "確認主管願意給你時間把課堂產出帶回公司試點",
      ];
      summary = `你的準備度 ${readinessScore} 分。建議先完成下方預習清單，再回來重測；也可以先預約一對一諮詢，我們協助你判斷最適合的時間點。`;
      prep = [
        { text: "用 AI 工具實際完成一項工作任務（例如：改寫一封信、整理一份資料）", done: input.experience !== "none" },
        { text: "列出一個你確定想交給 AI 員工處理的具體任務", done: input.hasTask !== "no" },
        { text: "確認能取得這個任務需要的資料或範例", done: input.hasData !== "no" },
        { text: "與主管確認上完課後有時間把產出帶回公司試點", done: input.hasSupport !== "no" },
        { text: "確認能撥出至少 1 天完整課程時間", done: input.commitment !== "half" },
      ];
      cta = {
        primary: "/about/#contact",
      };
      break;
  }

  return {
    match: {
      level,
      ...course,
      reason,
      previewList,
    },
    readinessScore,
    summary,
    breakdown,
    prep,
    cta,
  };
}

/* ---------------- 純文字報告 ---------------- */

export function fitReportText(input: FitInput, r: FitResult): string {
  const lines: string[] = [];
  lines.push("【Agentic AI for HR 課程適配度自評】");
  lines.push(`建議班級：${r.match.title}`);
  lines.push(`課程日期：${r.match.date}`);
  lines.push(`準備度：${r.readinessScore} 分`);
  lines.push("");
  lines.push(r.summary);
  lines.push("");
  lines.push("── 為什麼這樣建議 ──");
  lines.push(r.match.reason);
  lines.push("");
  lines.push("── 你會學到 / 做到什麼 ──");
  r.match.previewList.forEach((p, i) => lines.push(`${i + 1}. ${p}`));
  lines.push("");
  lines.push("── 分項分數 ──");
  r.breakdown.forEach((b) => {
    lines.push(`${b.label}：${b.score}/${b.max} — ${b.note}`);
  });
  lines.push("");
  lines.push("── 課前預習 / 準備清單 ──");
  r.prep.forEach((p, i) => {
    lines.push(`${p.done ? "✓" : "□"} ${p.text}`);
  });
  lines.push("");
  lines.push("（本報告由榕耀管顧課程適配度自評工具產出：https://rong-rise.com/course-fit）");
  return lines.join("\n");
}
