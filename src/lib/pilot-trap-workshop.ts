/* ============================================
   Pilot Trap 診斷量表 — 工作坊彙總引擎
   2026-08-26 小賀開發（P3-4 Agentic HR 診斷工作坊工具）

   工作坊模式（現場 10-20 人）：
   1. 參與者各自完成個人量表（/pilot-trap-scan）→ 結果頁複製「分數碼」
   2. 主持人把所有人的分數碼貼進 /pilot-trap-workshop
   3. 產生團隊雷達圖、健康分佈、高分歧維度、行動建議
   4. 可列印/存 PDF 的 A4 診斷報告

   分數碼格式：`姓名|45,62,38,70,55`（姓名可省略，五維度 0-100）
   零依賴：純函數，離線可跑，與個人量表共用 DIMENSIONS/ADVICE_MAP
   ============================================ */

import {
  DIMENSIONS,
  ADVICE_MAP,
  type DimensionKey,
} from "./pilot-trap-scan";

export interface WorkshopEntry {
  name: string;
  scores: Record<DimensionKey, number>;
}

export interface TeamResult {
  count: number;
  avg: Record<DimensionKey, number>;
  overall: number;
  level: "stable" | "attention" | "red";
  pilotRisk: number;
  distribution: { stable: number; attention: number; red: number };
  lowDimensions: DimensionKey[];
  strongest: DimensionKey[];
  weakest: DimensionKey;
  spread: Record<DimensionKey, { min: number; max: number; range: number }>;
  advice: string[];
}

const DIM_LIST = Object.keys(DIMENSIONS) as DimensionKey[];

// 個人結果 → 分數碼："姓名|45,62,38,70,55"
export function encodeScoreCode(
  name: string,
  scores: Record<DimensionKey, number>
): string {
  const vals = DIM_LIST.map((d) => scores[d]).join(",");
  const n = name.trim() || "參與者";
  return `${n}|${vals}`;
}

// 多行分數碼 → entries（容錯：無姓名、空白行、格式不符整行跳過）
export function parseScoreCodes(text: string): WorkshopEntry[] {
  const entries: WorkshopEntry[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    let name = "";
    let nums: string[] = [];
    if (line.includes("|")) {
      const parts = line.split("|");
      name = parts[0].trim();
      nums = (parts[1] || "").split(",");
    } else {
      nums = line.split(",");
    }
    const vals = nums
      .map((v) => Number(v.trim()))
      .filter((v) => Number.isFinite(v));
    if (vals.length !== DIM_LIST.length) continue;
    const scores = {} as Record<DimensionKey, number>;
    DIM_LIST.forEach((d, i) => {
      scores[d] = Math.max(0, Math.min(100, Math.round(vals[i])));
    });
    entries.push({ name: name || `參與者 ${entries.length + 1}`, scores });
  }
  return entries;
}

export function computeTeamResult(entries: WorkshopEntry[]): TeamResult | null {
  if (entries.length === 0) return null;

  const avg = {} as Record<DimensionKey, number>;
  const spread = {} as Record<DimensionKey, { min: number; max: number; range: number }>;
  for (const d of DIM_LIST) {
    const vals = entries.map((e) => e.scores[d]);
    avg[d] = Math.round(vals.reduce((s, v) => s + v, 0) / vals.length);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    spread[d] = { min, max, range: max - min };
  }

  const overall = Math.round(DIM_LIST.reduce((s, d) => s + avg[d], 0) / DIM_LIST.length);
  const pilotRisk = 100 - avg.pilotTrap;
  const lowDimensions = DIM_LIST.filter((d) => avg[d] < 60);
  const strongest = DIM_LIST.filter((d) => avg[d] >= 70);
  const weakest = DIM_LIST.reduce((a, b) => (avg[a] <= avg[b] ? a : b));

  let level: "stable" | "attention" | "red";
  if (lowDimensions.length === 0 && overall >= 80) level = "stable";
  else if (lowDimensions.length >= 3 || overall < 60) level = "red";
  else level = "attention";

  const distribution = { stable: 0, attention: 0, red: 0 };
  for (const e of entries) {
    const lows = DIM_LIST.filter((d) => e.scores[d] < 60);
    const o = Math.round(DIM_LIST.reduce((s, d) => s + e.scores[d], 0) / DIM_LIST.length);
    if (lows.length === 0 && o >= 80) distribution.stable++;
    else if (lows.length >= 3 || o < 60) distribution.red++;
    else distribution.attention++;
  }

  const advice: string[] = [];
  advice.push(ADVICE_MAP[weakest]);

  const highSpread = DIM_LIST.filter((d) => spread[d].range >= 40);
  if (highSpread.length > 0) {
    advice.push(
      `高分歧維度（${highSpread.map((d) => DIMENSIONS[d].label).join("、")}）：團隊內部看法落差超過 40 分，代表成員對現況的認知不一致。先別急著行動，安排一次對齊會議，讓高分與低分的成員互相說明理由。`
    );
  }
  if (lowDimensions.length >= 3) {
    advice.push(
      "超過三個維度在健康線以下，這個團隊的 agent 部署已接近失控。建議立刻做一次完整的 AI 資產盤點（治理五檢查），再決定哪些 pilot 該擴大、哪些該關閉。"
    );
  }
  if (distribution.red > 0 && distribution.red >= entries.length * 0.3) {
    advice.push(
      `${distribution.red} 位成員的個人診斷落在紅燈區，這些人多半正被無人治理的 pilot 直接影響。工作坊結束後，優先個別訪談他們，收集第一線的真實問題。`
    );
  }
  if (strongest.length > 0) {
    advice.push(
      `共同強項在${strongest.map((d) => DIMENSIONS[d].label).join("、")}，這是團隊共識基礎，可以當作下一步轉型的起點。`
    );
  }
  advice.push(
    "把工作坊結論收斂成「AI 轉型 North Star 一頁圖」與 30/60/90 天行動計畫，並指定一位負責人追蹤。"
  );

  return {
    count: entries.length,
    avg,
    overall,
    level,
    pilotRisk,
    distribution,
    lowDimensions,
    strongest,
    weakest,
    spread,
    advice,
  };
}
