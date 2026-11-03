/* ============================================
   人機策略對齊度自評 — 規則引擎（B5-1 微型工具）
   方法論：榕耀管顧「人機策略四層」框架（2026-10-31 定案）

   四層由上而下（人機策略在最上，系統實作在最下）：
   1. 人機策略（strategy）  —— 誰負責什麼、AI 預算與績效歸屬、人力與 agent 的編制關係
   2. 人機流程（process）   —— 工作怎麼拆給人與 agent、交接點、任務邊界與迭代
   3. 管理機制（management）—— 核准權、失敗定義、責任歸屬三件事凍結；
                              驗收標準版本化、考核綁版本不綁日曆
   4. 系統實作（system）    —— 工具鏈、權限、可觀測性、資料落地

   核心主張：上層沒有下層支撐＝空談，下層沒有上層授權＝白做。

   評分規則（透明、可驗算）：
   - 每層 3 題，1–5 分，取平均得 layerAvg
   - pct = (layerAvg - 1) / 4 * 100，四捨五入，夾在 0–100
   - 燈號：pct < 45 → 紅燈；45 ≤ pct ≤ 70 → 黃燈；pct > 70 → 綠燈
   - 等級：layerAvg < 1.5 起步 / < 2.5 形成 / < 3.5 發展 / < 4.5 成熟 / 其餘 標竿
   - overallScore = 四層 layerAvg 的平均，取一位小數
   - 缺答的題目不計入平均；整層缺答則該層 0 分（不會回傳 NaN）

   設計原則（與 ai-employee-diagnosis / ai-governance-scan 一致）：
   - 零依賴：純函式，無 API、無 npm 套件、離線可跑
   - 透明：參數寫在這裡，不藏
   - 保守：分數如實反映，不為了好看而加分
   - 可執行：建議要能明天就做，不是「應該加強」這種話
   ============================================ */

export type LayerKey = "strategy" | "process" | "management" | "system";
export type Level = "起步" | "形成" | "發展" | "成熟" | "標竿";
export type Status = "紅燈" | "黃燈" | "綠燈";
export type Priority = "high" | "medium" | "low";

export interface Question {
  id: string;
  text: string;
  options: { value: number; label: string }[];
}

export interface Layer {
  key: LayerKey;
  label: string;
  icon: string;
  description: string;
  questions: Question[];
}

export interface LayerResult {
  key: LayerKey;
  label: string;
  icon: string;
  score: number; // 1-5，一層平均
  pct: number; // 0-100
  level: Level;
  status: Status;
}

export interface Gap {
  key: LayerKey;
  label: string;
  score: number;
  reason: string;
}

export interface Misalignment {
  title: string;
  detail: string;
  severity: Priority;
}

export interface Recommendation {
  layer: string;
  text: string;
  priority: Priority;
}

export interface AlignmentResult {
  layers: LayerResult[];
  overallScore: number;
  overallLevel: Level;
  redCount: number;
  yellowCount: number;
  greenCount: number;
  weakestLayer: { key: LayerKey; label: string; score: number };
  gaps: Gap[];
  misalignments: Misalignment[];
  recommendations: Recommendation[];
  strengths: string[];
  summary: string;
  nextStep: string;
}

/* ============ 四層定義（每層 3 題） ============ */

const LAYERS: Layer[] = [
  {
    key: "strategy",
    label: "人機策略",
    icon: "🎯",
    description: "誰負責什麼、預算與績效歸誰、agent 算誰的人力。人資策略的下一步是人機策略。",
    questions: [
      {
        id: "s1",
        text: "AI 的預算與 AI 的績效，是不是編在同一條線上？",
        options: [
          { value: 1, label: "預算編在 IT，績效沒有人認領，年底兩邊不對帳" },
          { value: 2, label: "預算在 IT，績效掛在個別部門，但從來沒有一起檢討" },
          { value: 3, label: "預算與績效都由同一個部門管，但沒有共同的指標" },
          { value: 4, label: "預算與績效同一條線，年度檢視會一起看" },
          { value: 5, label: "同一條線且有共同 KPI，預算增減直接對應績效檢討結果" },
        ],
      },
      {
        id: "s2",
        text: "AI 產出出錯的時候，第一個被問責的是哪個單位？",
        options: [
          { value: 1, label: "看誰倒楣：錯誤落法務、預算落 IT，人資只拿一半責任" },
          { value: 2, label: "通常找 IT，因為系統是他們買的" },
          { value: 3, label: "看錯誤類型，每次都要重新討論一次" },
          { value: 4, label: "有事先約定，業務單位負最終責任" },
          { value: 5, label: "責任歸屬寫在編制裡，出事直接對應到職位，不用開會決定" },
        ],
      },
      {
        id: "s3",
        text: "你們的編制表上，agent 算誰的人力？",
        options: [
          { value: 1, label: "編制表只有人，agent 不在任何人的員額裡" },
          { value: 2, label: "agent 算 IT 的資產，不算任何團隊的產能" },
          { value: 3, label: "有些 agent 掛在部門下，但沒有正式的歸屬關係" },
          { value: 4, label: "agent 有明確的歸屬主管，算進該主管的管理幅度" },
          {
            value: 5,
            label: "編制表同時列人與 agent：主管帶 4 人、每人帶 5–6 個 agent，考核表上就看得到",
          },
        ],
      },
    ],
  },
  {
    key: "process",
    label: "人機流程",
    icon: "🔀",
    description: "工作怎麼拆給人與 agent、交接點寫在哪、任務邊界怎麼跟版本一起改。",
    questions: [
      {
        id: "p1",
        text: "一件工作從「人做」改成「人＋agent 做」，交接點是誰決定的？",
        options: [
          { value: 1, label: "沒有交接點，都是邊做邊改，誰接到誰處理" },
          { value: 2, label: "有默契，但沒有寫下來，換人就得重談" },
          { value: 3, label: "重要流程會討論交接點，但只存在會議紀錄裡" },
          { value: 4, label: "每個流程都寫下人機交接點：哪一步 agent 做完、交給誰" },
          { value: 5, label: "交接點是流程設計的一部分，改流程就一定一起改交接點" },
        ],
      },
      {
        id: "p2",
        text: "設計一件新工作的時候，你們先想員額，還是先想檢查點？",
        options: [
          { value: 1, label: "先算要幾個人，檢查點等出事再說" },
          { value: 2, label: "先看誰有空，再決定這件事怎麼分" },
          { value: 3, label: "會想到檢查，但沒有固定順序" },
          { value: 4, label: "先定檢查點，再決定要人還是要 agent" },
          { value: 5, label: "檢查點先寫死，員額最後才談；沒有檢查點的工作不進流程" },
        ],
      },
      {
        id: "p3",
        text: "流程多久改一次？改了之後，人與 agent 拿到的是同一版嗎？",
        options: [
          { value: 1, label: "幾乎不改，出大錯才動，動了也沒有紀錄" },
          { value: 2, label: "想到才改，改了不一定通知，agent 還在跑舊的" },
          { value: 3, label: "有問題會改，口頭通知相關的人" },
          { value: 4, label: "有固定檢視頻率，改版會通知人，也會更新 agent 的指令" },
          { value: 5, label: "流程有版本號，改版同步給人與 agent，並記錄改了什麼、為什麼改" },
        ],
      },
    ],
  },
  {
    key: "management",
    label: "管理機制",
    icon: "📐",
    description: "核准權、失敗定義、責任歸屬三件事凍結；驗收標準版本化，考核綁版本不綁日曆。",
    questions: [
      {
        id: "m1",
        text: "核准權、失敗定義、責任歸屬——這三件事寫死了嗎？",
        options: [
          { value: 1, label: "三件都沒寫，出事再討論" },
          { value: 2, label: "有口頭共識，但沒有文件，換主管就變" },
          { value: 3, label: "寫了一部分（例如核准權），另外兩件還在個案判斷" },
          { value: 4, label: "三件都成文，多數情況照著走" },
          { value: 5, label: "三件都凍結並寫進系統，要改得走變更流程、留下紀錄" },
        ],
      },
      {
        id: "m2",
        text: "驗收標準綁的是版本，還是日曆？考核結果又會被拿去怎麼用？",
        options: [
          { value: 1, label: "沒有驗收標準，也沒有考核，agent 上線就一直用" },
          { value: 2, label: "年底一起看，標準每年重寫一次，考核只是打分數" },
          { value: 3, label: "有驗收標準但沒有版本紀錄，考核結果偶爾影響要不要繼續用" },
          { value: 4, label: "標準有版本，考核對照當時那一版；結果會調整權限或決定是否複製到別的單位" },
          {
            value: 5,
            label: "考核綁版本不綁日曆；結果直接對應配置：給更多權限＝升遷、複製到別的單位＝調任、下架＝資遣",
          },
        ],
      },
      {
        id: "m3",
        text: "你們怎麼判斷一個 agent 是好還是不好？",
        options: [
          { value: 1, label: "看產出量，做得多就是好" },
          { value: 2, label: "看有沒有出錯，沒出事就繼續用" },
          { value: 3, label: "看產出品質，但只有一個人判斷得出來" },
          { value: 4, label: "看可被檢查與可被接手：別人接手能不能跑得動" },
          { value: 5, label: "用三個判準：可被檢查、可被接手、失敗代價可控——產出多不算" },
        ],
      },
    ],
  },
  {
    key: "system",
    label: "系統實作",
    icon: "⚙️",
    description: "工具鏈、權限分級、可觀測性、資料落地。沒有這一層，前三層都只是文件。",
    questions: [
      {
        id: "y1",
        text: "agent 做了什麼，你看得到嗎？出錯時追得回是哪一輪嗎？",
        options: [
          { value: 1, label: "看不到，只能看最後產出" },
          { value: 2, label: "看得到部分紀錄，但不完整，出事只能猜" },
          { value: 3, label: "有紀錄，但沒有人定期看，也沒有告警" },
          { value: 4, label: "每次執行的輸入輸出都留著，出錯能回溯到那一輪" },
          { value: 5, label: "有監控與告警，異常會主動通知負責人，並留下處理紀錄" },
        ],
      },
      {
        id: "y2",
        text: "權限是怎麼給的？agent 能碰到哪些資料、哪些系統，誰說了算？",
        options: [
          { value: 1, label: "大家共用一組帳號，權限全開" },
          { value: 2, label: "有分帳號，但權限沒有分級，需要就開" },
          { value: 3, label: "重要系統有分權限，其他還是共用" },
          { value: 4, label: "依角色分級，只給工作需要的權限" },
          { value: 5, label: "權限可稽核、可回收，換角色或下架時會同步調整" },
        ],
      },
      {
        id: "y3",
        text: "agent 要用的公司資料，拿得到嗎？還是每次都要人貼給它？",
        options: [
          { value: 1, label: "拿不到，每次都手動貼，貼什麼由當下的人決定" },
          { value: 2, label: "拿得到一部分，但格式常要人工整理" },
          { value: 3, label: "有資料介面，但不穩定，常常要重跑" },
          { value: 4, label: "主要系統有介面，agent 能自動取用需要的資料" },
          { value: 5, label: "資料與工具鏈已串接，agent 在流程中自動取得資料，權限跟著角色走" },
        ],
      },
    ],
  },
];

/* ============ 評分參數（要改就改這裡） ============ */

const PCT_RED_MAX = 45; // pct < 45 → 紅燈
const PCT_YELLOW_MAX = 70; // 45 ≤ pct ≤ 70 → 黃燈；> 70 → 綠燈
const LEVEL_STEPS: [number, Level][] = [
  [1.5, "起步"],
  [2.5, "形成"],
  [3.5, "發展"],
  [4.5, "成熟"],
];
const TOP_LEVEL: Level = "標竿";
const GAP_THRESHOLD = 3; // 低於 3 分列入缺口
const ALIGN_LOW = 2.5; // 錯位診斷的低分門檻
// 對齊良好一律用「綠燈」判斷（pct > 70 → 平均 > 3.8），
// 不要另外開一組門檻，否則會出現「四層全黃燈卻說已對齊」的矛盾。
const isGreen = (l: LayerResult): boolean => l.status === "綠燈";

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function getLevel(avg: number): Level {
  for (const [threshold, level] of LEVEL_STEPS) {
    if (avg < threshold) return level;
  }
  return TOP_LEVEL;
}

function getStatus(pct: number): Status {
  if (pct < PCT_RED_MAX) return "紅燈";
  if (pct <= PCT_YELLOW_MAX) return "黃燈";
  return "綠燈";
}

function getPriority(status: Status): Priority {
  if (status === "紅燈") return "high";
  if (status === "黃燈") return "medium";
  return "low";
}

/* ============ 每題對應一條可執行建議 ============ */

const QUESTION_RECOMMENDATIONS: Record<string, string> = {
  // 人機策略
  s1: "把 AI 預算與 AI 績效放到同一條線上：下一次預算會議，要求提預算的單位同時提績效指標，兩份文件一起審、一起刪。",
  s2: "先把問責寫進編制：列出三種最可能的 AI 事故（對外內容出錯、客戶資料外流、流程誤觸），各自指定一個職位負最終責任，不要寫部門。",
  s3: "把 agent 補進編制表：在現有考核表加一欄「部屬數／agent 數」，讓管理幅度與考績範圍看得出來，不然 agent 永遠是預算外的人力。",
  // 人機流程
  p1: "挑一條最常跑的流程，寫下人機交接點：哪一步 agent 做完、交給誰、交付格式是什麼。只寫一頁就夠。",
  p2: "下次設計工作先問檢查點：這件事出錯時，哪一個檢查點會攔下來？檢查點定了再談要幾個人。",
  p3: "給流程一個版本號：從今天起，流程改版就記一筆「改了什麼、誰要知道」，並同步更新對應 agent 的指令。",
  // 管理機制
  m1: "凍結三件事：核准權、失敗定義、責任歸屬寫成一頁，註明誰有權改、改了要通知誰。沒有這一頁，後面所有討論都會回到原點。",
  m2: "把驗收標準版本化：每份標準標上版本與生效日，考核時對照產出當時那一版，不要對照年底的記憶。",
  m3: "換掉「產出多就是好」的判準：挑一個 agent，用「可被檢查、可被接手、失敗代價可控」三項重新評一次，把不合格的那項寫成待辦。",
  // 系統實作
  y1: "先補執行紀錄：讓 agent 每次執行都留下輸入、輸出與呼叫過的工具，出事時能回到那一輪，而不是重跑一次祈禱它會好。",
  y2: "盤一次權限：列出每個 agent 能碰到的系統與資料，把不需要的收回，並指定一個「有權開權限」的職位。",
  y3: "打通一條資料路：挑 agent 最常要的那一份資料，做成它能直接取的介面。先接通一條，不要一次接全部系統。",
};

const LAYER_GROWTH_RECOMMENDATIONS: Record<LayerKey, string> = {
  strategy: "策略層已站穩，下一步把它變成年度制度：每年檢視一次人機編制，確認預算、績效、問責還在同一條線上。",
  process: "流程層已清楚，下一步讓它可被接手：把交接點與版本紀錄交給第二個人維護，避免只有一個人知道流程長什麼樣。",
  management: "管理機制已在運作，下一步讓它可稽核：定期抽查核准紀錄與失敗定義的執行情況，確認沒有人繞過。",
  system: "系統層已到位，下一步擴大納管：把可觀測性與權限分級套用到還沒納管的 agent，避免出現體制外的執行。",
};

const LAYER_STRENGTH_NOTES: Record<LayerKey, string> = {
  strategy: "誰負責什麼、預算與績效歸誰，已經講得清楚",
  process: "交接點與任務邊界寫得下來，換人接手不會斷",
  management: "核准權與失敗定義有依據，考核對得上版本",
  system: "權限、紀錄、資料介面都在，出錯追得回來",
};

const GAP_REASONS: Record<LayerKey, string> = {
  strategy: "策略層分數低，通常代表 AI 預算、績效、問責分屬不同部門，出錯時沒有人能一次講清楚誰該負責。",
  process: "流程層分數低，代表工作沒有真的拆給 agent，交接點靠默契，換人或換模型就會斷。",
  management: "管理機制分數低，代表核准權與失敗定義沒有凍結，跑得快但煞不住，出事只能個案檢討。",
  system: "系統層分數低，代表沒有可觀測性與權限分級，前三層寫得再漂亮，也只能靠人盯。",
};

/* ============ 主評估函式 ============ */

export function evaluate(answers: Record<string, number>): AlignmentResult {
  const layerResults: LayerResult[] = LAYERS.map((layer) => {
    const values = layer.questions
      .map((q) => answers[q.id])
      .filter((v): v is number => typeof v === "number" && Number.isFinite(v))
      .map((v) => clamp(v, 1, 5));

    const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    const pct = values.length > 0 ? clamp(Math.round(((avg - 1) / 4) * 100), 0, 100) : 0;

    return {
      key: layer.key,
      label: layer.label,
      icon: layer.icon,
      score: round1(avg),
      pct,
      level: getLevel(avg),
      status: getStatus(pct),
    };
  });

  const overallScore = round1(
    layerResults.reduce((sum, l) => sum + l.score, 0) / layerResults.length
  );
  const overallLevel = getLevel(overallScore);

  const redCount = layerResults.filter((l) => l.status === "紅燈").length;
  const yellowCount = layerResults.filter((l) => l.status === "黃燈").length;
  const greenCount = layerResults.filter((l) => l.status === "綠燈").length;

  const sorted = [...layerResults].sort((a, b) => a.score - b.score);
  const weakest = sorted[0];

  const byKey = (key: LayerKey): LayerResult =>
    layerResults.find((l) => l.key === key) as LayerResult;

  const strategy = byKey("strategy");
  const process = byKey("process");
  const management = byKey("management");
  const system = byKey("system");

  const gaps: Gap[] = sorted
    .filter((l) => l.score < GAP_THRESHOLD)
    .map((l) => ({ key: l.key, label: l.label, score: l.score, reason: GAP_REASONS[l.key] }));

  /* ---- 跨層錯位診斷 ---- */
  const misalignments: Misalignment[] = [];
  const allLow = layerResults.every((l) => l.status === "紅燈");
  const allHigh = layerResults.every(isGreen);

  if (allLow) {
    misalignments.push({
      title: "還沒開始",
      detail:
        "四層都落在 45% 以下。先不要談框架，挑一個最常出錯的流程，把交接點與檢查點寫下來，三個月後再測一次。",
      severity: "high",
    });
  } else if (allHigh) {
    misalignments.push({
      title: "四層對齊",
      detail:
        "四層都是綠燈，上層有授權、下層有支撐。接下來要守的是版本：核准權、失敗定義、驗收標準改了要留紀錄。",
      severity: "low",
    });
  } else {
    if (isGreen(strategy) && system.score < ALIGN_LOW) {
      misalignments.push({
        title: "策略空談",
        detail:
          "策略層已經想清楚誰負責什麼，但系統層還停在人工補位。方向講得出來、落地要靠人盯，換一個人盯，整組就停。",
        severity: "high",
      });
    }
    if (isGreen(system) && strategy.score < ALIGN_LOW) {
      misalignments.push({
        title: "工具先行、方向未定",
        detail:
          "工具、權限、紀錄都建起來了，但誰負責什麼、預算與績效歸誰還沒定。系統跑得動，卻沒有人能回答這件事為什麼要做。",
        severity: "high",
      });
    }
    if (management.score < ALIGN_LOW && isGreen(process)) {
      misalignments.push({
        title: "跑得快但沒煞車",
        detail:
          "流程拆得細、交接點也清楚，但核准權、失敗定義、責任歸屬沒凍結。流程能重跑，責任說不清楚。",
        severity: "high",
      });
    }
    if (misalignments.length === 0) {
      misalignments.push({
        title: "部分對齊",
        detail:
          "四層沒有明顯錯位，但還有層卡在 3 分上下。這種狀態通常不是缺做法，是做法沒有固定下來，換個人接手就會走鐘。",
        severity: "medium",
      });
    }
  }

  /* ---- 建議：依低分層給具體行動，低分層排前面 ---- */
  const recommendations: Recommendation[] = [];
  for (const lr of sorted) {
    const layer = LAYERS.find((l) => l.key === lr.key) as Layer;

    if (!isGreen(lr)) {
      // 找該層最低分的那一題，給對應行動
      let minQid = layer.questions[0].id;
      let minScore = Infinity;
      for (const q of layer.questions) {
        const v = answers[q.id];
        const score = typeof v === "number" && Number.isFinite(v) ? v : 1;
        if (score < minScore) {
          minScore = score;
          minQid = q.id;
        }
      }
      recommendations.push({
        layer: `${lr.icon} ${lr.label}`,
        text: QUESTION_RECOMMENDATIONS[minQid] || LAYER_GROWTH_RECOMMENDATIONS[lr.key],
        priority: getPriority(lr.status),
      });
    } else {
      recommendations.push({
        layer: `${lr.icon} ${lr.label}`,
        text: LAYER_GROWTH_RECOMMENDATIONS[lr.key],
        priority: "low",
      });
    }
  }

  /* ---- 強項 ---- */
  const strengths = layerResults
    .filter(isGreen)
    .map((l) => `${l.icon} ${l.label}（${l.score.toFixed(1)} 分）：${LAYER_STRENGTH_NOTES[l.key]}`);

  /* ---- 總結（第一人稱顧問口吻，不用金句收尾） ---- */
  const primary = misalignments[0];
  const spread = round1(Math.max(...layerResults.map((l) => l.score)) - Math.min(...layerResults.map((l) => l.score)));
  const hasNamedMisalignment = primary.title !== "部分對齊";
  let summary: string;
  if (allLow) {
    summary = `四層平均 ${overallScore.toFixed(1)} 分，四層都在紅燈。我看起來是還沒開始，而不是做錯——這種階段不需要框架，需要一個具體的流程被拆開來看一次。`;
  } else if (allHigh && spread < 0.3) {
    summary = `四層平均 ${overallScore.toFixed(1)} 分，四層分數幾乎一致，沒有哪一層明顯拖住其他層。上層有授權、下層有支撐，現在要守的是版本紀錄，不是再加新工具。`;
  } else if (allHigh) {
    summary = `四層平均 ${overallScore.toFixed(1)} 分，${weakest.label}是相對最低的一層（${weakest.score.toFixed(1)} 分），但仍在前段。現在要守的是版本紀錄，不是再加新工具。`;
  } else if (redCount > 0 && hasNamedMisalignment) {
    summary = `我看到最明顯的錯位是「${primary.title}」。四層平均 ${overallScore.toFixed(1)} 分，${weakest.label}只有 ${weakest.score.toFixed(1)} 分——它是拖住其他三層的那一層，先補它，其他層的投入才不會漏掉。`;
  } else if (redCount > 0) {
    summary = `四層平均 ${overallScore.toFixed(1)} 分，${weakest.label}只有 ${weakest.score.toFixed(1)} 分，是四層裡最先會出事的地方。沒有明顯的跨層錯位，問題在這一層本身還沒做完。`;
  } else {
    summary = `四層平均 ${overallScore.toFixed(1)} 分，沒有紅燈，但${weakest.label}（${weakest.score.toFixed(1)} 分）是下一個會出事的地方。這種分數通常代表做法有了、但沒固定成制度。`;
  }

  /* ---- 下一步 ---- */
  let nextStep: string;
  if (allLow) {
    nextStep = "先做一件事：挑一條最常出錯的流程，寫下人機交接點與一個檢查點。兩週後回來重測，看哪一層先動。";
  } else if (redCount > 0) {
    nextStep = `先處理${weakest.label}：從上面的高優先建議挑一條，兩週內做完，其餘三層暫時不加新工具。做完再重測，確認分數真的動了。`;
  } else if (yellowCount > 0) {
    nextStep = `把黃燈的層標準化：${weakest.label}先寫成一頁可交接的文件，指定一個人維護，四週後重測。`;
  } else {
    nextStep = "四層都在綠燈，下一步是防守：把核准權、失敗定義、驗收標準的版本紀錄補齊，並三個月後重測一次。";
  }

  return {
    layers: layerResults,
    overallScore,
    overallLevel,
    redCount,
    yellowCount,
    greenCount,
    weakestLayer: { key: weakest.key, label: weakest.label, score: weakest.score },
    gaps,
    misalignments,
    recommendations,
    strengths,
    summary,
    nextStep,
  };
}

export function getAllLayers(): Layer[] {
  return LAYERS;
}

export function getLayerKeyList(): LayerKey[] {
  return ["strategy", "process", "management", "system"];
}

/* ============ 純文字報告（複製用） ============ */

const PRIORITY_LABEL: Record<Priority, string> = {
  high: "高優先",
  medium: "中優先",
  low: "持續優化",
};

export function alignmentReportText(result: AlignmentResult): string {
  const lines: string[] = [];

  lines.push("【人機策略對齊度自評結果】");
  lines.push(
    `整體：${result.overallScore.toFixed(1)} 分（${result.overallLevel}）｜${result.redCount} 紅燈 · ${result.yellowCount} 黃燈 · ${result.greenCount} 綠燈`
  );
  lines.push("");
  lines.push("四層分數：");
  for (const l of result.layers) {
    lines.push(`• ${l.icon} ${l.label}：${l.score.toFixed(1)} 分（${l.level}／${l.status}，${l.pct}%）`);
  }
  lines.push("");
  lines.push("跨層錯位診斷：");
  for (const m of result.misalignments) {
    lines.push(`• ${m.title}：${m.detail}`);
  }
  lines.push("");
  if (result.gaps.length > 0) {
    lines.push("缺口（低於 3 分）：");
    for (const g of result.gaps) {
      lines.push(`• ${g.label}（${g.score.toFixed(1)} 分）：${g.reason}`);
    }
    lines.push("");
  }
  lines.push("優先行動：");
  for (const rec of result.recommendations) {
    lines.push(`• [${PRIORITY_LABEL[rec.priority]}] ${rec.layer}：${rec.text}`);
  }
  lines.push("");
  if (result.strengths.length > 0) {
    lines.push("強項：");
    for (const s of result.strengths) {
      lines.push(`• ${s}`);
    }
    lines.push("");
  }
  lines.push(`總結：${result.summary}`);
  lines.push(`下一步：${result.nextStep}`);
  lines.push("");
  lines.push("—— 榕耀管顧 · 人機策略四層框架　https://rong-rise.com/human-ai-alignment");

  return lines.join("\n");
}
