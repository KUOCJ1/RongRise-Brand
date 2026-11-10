/* ============================================
   AI 員工授權等級測驗 — 規則引擎（B5-2 微型工具）
   方法論：榕耀管顧研究專刊《人類與 AI 的授權悖論》
           授權四級：L1 建議 / L2 可逆執行 / L3 不可逆執行 / L4 對外代表
   判定依據：資料穩定度、錯誤成本、人工覆核必要性、外部影響範圍

   切級規則（寫清楚，避免 5 點量表被坐實成 2 級）：
   - external === 5 → L4（直接對外代表公司）
   - cost >= 4 → L3（錯誤成本高或需額外審批才恢復）
   - external === 4 → L3（對外使用，需要核准，但未經具名授權）
   - data >= 3 && cost <= 3 && review <= 3 && external <= 3 → L2
   - 其他 → L1

   設計原則：
   - 純函式、零依賴、離線可跑
   - 分級依據只用「能不能回頭」，不用金額或部門
   - 輸出同時給「建議等級」與「缺口提醒」，不為了好聽而隱藏風險
   ============================================ */

export type DimensionKey = "data" | "cost" | "review" | "external";
export type Level = "L1" | "L2" | "L3" | "L4";

export interface Option {
  value: number;
  label: string;
}

export interface Dimension {
  key: DimensionKey;
  label: string;
  shortLabel: string;
  icon: string;
  question: string;
  options: Option[];
}

export interface DimensionResult {
  key: DimensionKey;
  label: string;
  shortLabel: string;
  icon: string;
  score: number;
  answerLabel: string;
}

export interface Gap {
  key: DimensionKey;
  label: string;
  text: string;
}

export interface AuthLevelResult {
  level: Level;
  levelLabel: string;
  icon: string;
  headline: string;
  summary: string;
  audit: string[];
  risks: string[];
  gaps: Gap[];
  checklist: string[];
  reportText: string;
}

/* ============ 四維度定義（每維度一題，1–5 分） ============ */

const DIMENSIONS: Dimension[] = [
  {
    key: "data",
    label: "資料穩定度",
    shortLabel: "資料",
    icon: "📊",
    question: "這個任務要用的資料，是穩定可預期的嗎？",
    options: [
      { value: 1, label: "每次都不一樣，靠人當下貼給 AI" },
      { value: 2, label: "大致固定，但格式常變，要人工整理" },
      { value: 3, label: "有固定來源，但偶爾需要更新或清理" },
      { value: 4, label: "有穩定來源，AI 可以自動取用" },
      { value: 5, label: "已經接成 API／資料庫，格式與權限都受控" },
    ],
  },
  {
    key: "cost",
    label: "錯誤成本",
    shortLabel: "成本",
    icon: "💥",
    question: "如果 AI 做錯了，要付出多大代價才能恢復？",
    options: [
      { value: 1, label: "幾秒鐘就能改回來，幾乎沒影響" },
      { value: 2, label: "需要重新跑一次，沒有外部後果" },
      { value: 3, label: "需要一段時間修正，可能影響內部進度" },
      { value: 4, label: "會造成實質損失或需要額外審批才能恢復" },
      { value: 5, label: "錯了就回不去，可能有法律、財務或安全後果" },
    ],
  },
  {
    key: "review",
    label: "人工覆核必要性",
    shortLabel: "覆核",
    icon: "🔍",
    question: "人類有辦法在合理時間內，逐項檢查 AI 的產出嗎？",
    options: [
      { value: 1, label: "完全可以，產出很短、標準很清楚" },
      { value: 2, label: "大部分可以，只需要抽查關鍵點" },
      { value: 3, label: "可以核對邏輯與來源，但無法逐行驗證" },
      { value: 4, label: "很難，產出太長或需要專業判斷" },
      { value: 5, label: "幾乎不可能，連專家也無法完整審核" },
    ],
  },
  {
    key: "external",
    label: "外部影響範圍",
    shortLabel: "外部",
    icon: "🌐",
    question: "這個任務的結果，會對公司外部產生法律或商業效果嗎？",
    options: [
      { value: 1, label: "完全內部，不會被任何人看到" },
      { value: 2, label: "內部同事會看到，不會外流" },
      { value: 3, label: "會給外部看到，但不構成承諾" },
      { value: 4, label: "會被外部使用，需要內部核准" },
      { value: 5, label: "直接對外代表公司（寄客戶信、報價、付款、發布）" },
    ],
  },
];

/* ============ 等級定義（與研究專刊一致） ============ */

const LEVELS: Record<
  Level,
  {
    label: string;
    icon: string;
    headline: string;
    audit: string[];
  }
> = {
  L1: {
    label: "L1 建議",
    icon: "📝",
    headline: "AI 出點子，人類做最後決定",
    audit: [
      "交付格式固定加一欄「依據」，空白的不採用",
      "指定一個人負責看過產出，並留下看過的紀錄",
      "每個結論都要能指回一個人看得懂的來源",
    ],
  },
  L2: {
    label: "L2 可逆執行",
    icon: "⚙️",
    headline: "AI 可以動手，但做錯了要回得來",
    audit: [
      "每次執行保留輸入、輸出與呼叫過的工具日誌",
      "定期事後抽查，確認產出品質沒有漂移",
      "回復路徑要實際演練過，不能只在文件裡",
    ],
  },
  L3: {
    label: "L3 不可逆執行",
    icon: "🔒",
    headline: "做下去就回不去，需要雙人核准與事前模擬",
    audit: [
      "執行前必須雙人核准，且核准者與生產者不同源",
      "正式執行前先模擬一次，確認影響範圍與回復步驟",
      "停止鍵要指定到一個具體的人，並測試過有效",
    ],
  },
  L4: {
    label: "L4 對外代表",
    icon: "🏛️",
    headline: "這個動作會綁住公司，必須具名授權、全程留痕、可撤回",
    audit: [
      "對外動作需要具名授權，授權人與職位寫清楚",
      "全程留痕：誰、什麼時候、根據什麼核准",
      "必須有可撤回機制，並在出錯時能在合理時間內對外補救",
    ],
  },
};

/* ============ 缺口門檻 ============ */

const GAP_TEXT: Record<DimensionKey, string> = {
  data: "資料穩定度還不夠，AI 執行時輸入可能飄動，建議先穩定資料來源。",
  cost: "錯誤成本偏高，需要更強的凍結、核准與回復機制，不要貿然自動化。",
  review: "人類難以在合理時間內完整覆核，建議縮小範圍或增加對抗性審核。",
  external: "對外影響大，必須以 L4 標準對待：具名授權、全程留痕、可撤回。",
};

const RISK_TEXT: Record<DimensionKey, string> = {
  data: "資料不穩定，AI 可能拿到錯誤或過期的輸入。",
  cost: "錯誤成本高，一旦出錯恢復代價大。",
  review: "人難以完整審核，錯誤可能穿過簽核。",
  external: "對外代表公司，錯誤會產生法律或商業後果。",
};

function answerLabel(dim: Dimension, value: number): string {
  return dim.options.find((o) => o.value === value)?.label ?? "";
}

function hasAllAnswers(answers: Record<DimensionKey, number>): boolean {
  return DIMENSIONS.every((d) => typeof answers[d.key] === "number" && answers[d.key] >= 1 && answers[d.key] <= 5);
}

/* ============ 動態標題：處理 L1 但人無法覆核的矛盾 ============ */

function getHeadline(level: Level, answers: Record<DimensionKey, number>): string {
  const review = answers.review ?? 1;
  const data = answers.data ?? 1;
  if (level === "L1") {
    if (review >= 4) {
      return "AI 可以出點子，但人類現在驗不動；先縮小範圍到人可以覆核的粒度";
    }
    if (data <= 2) {
      return "AI 可以出點子，但資料還不穩定，先固定輸入再說";
    }
  }
  return LEVELS[level].headline;
}

/* ============ 主評估函式 ============ */

export function evaluate(
  answers: Record<DimensionKey, number>,
  taskDescription?: string
): AuthLevelResult {
  if (!hasAllAnswers(answers)) {
    throw new Error("請先回答所有四個維度的問題");
  }

  const data = answers.data;
  const cost = answers.cost;
  const review = answers.review;
  const external = answers.external;

  // 切級規則說明見檔案頭
  let level: Level = "L1";
  if (external === 5) {
    level = "L4";
  } else if (cost >= 4) {
    level = "L3";
  } else if (external === 4) {
    level = "L3";
  } else if (data >= 3 && cost <= 3 && review <= 3 && external <= 3) {
    level = "L2";
  }

  const levelInfo = LEVELS[level];

  // 維度結果
  const dimensionResults: DimensionResult[] = DIMENSIONS.map((d) => ({
    key: d.key,
    label: d.label,
    shortLabel: d.shortLabel,
    icon: d.icon,
    score: answers[d.key],
    answerLabel: answerLabel(d, answers[d.key]),
  }));

  // 缺口
  const gaps: Gap[] = [];
  if (data <= 2) gaps.push({ key: "data", label: DIMENSIONS.find((d) => d.key === "data")!.label, text: GAP_TEXT.data });
  if (cost >= 4) gaps.push({ key: "cost", label: DIMENSIONS.find((d) => d.key === "cost")!.label, text: GAP_TEXT.cost });
  if (review >= 4) gaps.push({ key: "review", label: DIMENSIONS.find((d) => d.key === "review")!.label, text: GAP_TEXT.review });
  if (external >= 4) gaps.push({ key: "external", label: DIMENSIONS.find((d) => d.key === "external")!.label, text: GAP_TEXT.external });

  // 風險
  const risks: string[] = [];
  if (data <= 2) risks.push(RISK_TEXT.data);
  if (cost >= 4) risks.push(RISK_TEXT.cost);
  if (review >= 4) risks.push(RISK_TEXT.review);
  if (external >= 4) risks.push(RISK_TEXT.external);
  if (level === "L4" && (data <= 2 || review >= 4 || cost >= 4)) {
    risks.push("對外動作同時存在資料、覆核或成本缺口，建議先縮小範圍或補強機制，再列入 L4。");
  }
  if (level === "L3" && (data <= 2 || review >= 4)) {
    risks.push("雖然判為 L3，但資料或覆核條件不足，建議先補強再授權給 AI 執行。");
  }

  // 檢查清單（依 level 分岐）
  const checklist: string[] = [
    "把這個任務列入授權等級對照表，標明 L 級與負責人",
    "在交付格式加一欄「依據」，空白的不採用",
  ];
  if (level === "L2" || level === "L3" || level === "L4") {
    checklist.push("指定一個有權限按停止鍵的具體人名");
    checklist.push("實際演練一次回復，並記錄平均回復時間");
  }
  if (level === "L3" || level === "L4") {
    checklist.push("執行前做雙人核准，且核准者與生產者不同源");
    checklist.push("用不同模型或不同資料重做關鍵一段，做對抗性審核");
  }
  if (level === "L4") {
    checklist.push("確認對外內容可撤回，並在出錯時有補救窗口");
  }

  // 總結
  const dimText = (key: DimensionKey) => {
    const d = DIMENSIONS.find((x) => x.key === key)!;
    const score = answers[key];
    const label = d.options.find((o) => o.value === score)?.label ?? "";
    return `${d.shortLabel}${score} 分：${label}`;
  };

  let summary = `四個維度綜合判斷：${dimText("data")}；${dimText("cost")}；${dimText("review")}；${dimText("external")}。`;
  if (level === "L1") {
    summary += ` 這個任務最適合讓 AI 產出建議或草稿，最後由人類決定要不要執行。`;
    if (review >= 4) {
      summary += ` 但目前人類難以在合理時間內覆核這個粒度的產出，建議先把任務拆到人能驗證的範圍，再議授權等級。`;
    }
    if (gaps.length > 0 && review < 4) {
      summary += ` 目前還有 ${gaps.length} 個缺口需要先處理，否則連 L1 都可能流於形式。`;
    }
  } else if (level === "L2") {
    summary += ` 資料與覆核條件足夠讓 AI 自動執行，且錯誤成本在內部可控範圍。重點是保留完整日誌與回復路徑。`;
  } else if (level === "L3") {
    summary += ` 錯誤成本高或動作對外，必須在執行前做雙人核准與事前模擬。`;
    if (data <= 2 || review >= 4) {
      summary += ` 但目前資料或覆核條件還不夠成熟，建議先補強再真正授權給 AI。`;
    }
  } else {
    summary += ` 這個動作會直接對外代表公司，必須以 L4 標準對待。`;
    if (gaps.length > 0) {
      summary += ` 但目前還有缺口，建議先修補機制或縮小範圍，不要貿然對外自動化。`;
    }
  }

  const headline = getHeadline(level, answers);
  const reportText = buildReportText({
    level,
    levelInfo: { ...levelInfo, headline },
    dimensionResults,
    gaps,
    risks,
    checklist,
    summary,
    taskDescription,
  });

  return {
    level,
    levelLabel: levelInfo.label,
    icon: levelInfo.icon,
    headline,
    summary,
    audit: levelInfo.audit,
    risks,
    gaps,
    checklist,
    reportText,
  };
}

export function getDimensions(): Dimension[] {
  return DIMENSIONS;
}

export function getLevels(): Record<Level, { label: string; icon: string; headline: string; audit: string[] }> {
  return LEVELS;
}

/* ============ 純文字報告（複製用） ============ */

function buildReportText(payload: {
  level: Level;
  levelInfo: { label: string; icon: string; headline: string; audit: string[] };
  dimensionResults: DimensionResult[];
  gaps: Gap[];
  risks: string[];
  checklist: string[];
  summary: string;
  taskDescription?: string;
}): string {
  const lines: string[] = [];
  lines.push(`【AI 員工授權等級測驗結果】`);
  lines.push(`${payload.levelInfo.icon} ${payload.levelInfo.label} — ${payload.levelInfo.headline}`);
  if (payload.taskDescription?.trim()) {
    lines.push("");
    lines.push(`任務描述：${payload.taskDescription.trim()}`);
  }
  lines.push("");
  lines.push("四維度評分：");
  for (const d of payload.dimensionResults) {
    lines.push(`• ${d.icon} ${d.label}（${d.shortLabel}）：${d.score} 分 — ${d.answerLabel}`);
  }
  lines.push("");
  if (payload.gaps.length > 0) {
    lines.push("缺口提醒：");
    for (const g of payload.gaps) {
      lines.push(`• ${g.label}：${g.text}`);
    }
    lines.push("");
  }
  if (payload.risks.length > 0) {
    lines.push("主要風險：");
    for (const r of payload.risks) {
      lines.push(`• ${r}`);
    }
    lines.push("");
  }
  lines.push("必要審核機制：");
  for (const a of payload.levelInfo.audit) {
    lines.push(`• ${a}`);
  }
  lines.push("");
  lines.push("下一步檢查清單：");
  for (const c of payload.checklist) {
    lines.push(`• ${c}`);
  }
  lines.push("");
  lines.push(`總結：${payload.summary}`);
  lines.push("");
  lines.push("—— 榕耀管顧 · 人類與 AI 的授權悖論　https://rong-rise.com/ai-authorization-level/");
  return lines.join("\n");
}
