// src/lib/chat-api.ts
// 小幫手 API 呼叫模組 — 直接從前端呼叫 OpenRouter
//
// NEXT_PUBLIC_OPENROUTER_API_KEY 在 build time 由 Next.js 自動從環境變數注入。
// GitHub Actions workflow 透過以下方式注入：
//   env:
//     NEXT_PUBLIC_OPENROUTER_API_KEY: ${{ secrets.OPENROUTER_API_KEY }}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Next.js 在 build time 會將 process.env.NEXT_PUBLIC_* 替換為實際值
const OPENROUTER_API_KEY: string = (process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || "").trim();

// 安全地建立 Authorization header
function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "HTTP-Referer": "https://rong-rise.com",
    "X-Title": "RongRise Consulting",
  };
  if (OPENROUTER_API_KEY) {
    headers["Authorization"] = "Bearer " + OPENROUTER_API_KEY;
  }
  return headers;
}

const OPENROUTER_MODEL: string = process.env.NEXT_PUBLIC_OPENROUTER_MODEL || "deepseek/deepseek-v4-flash";

// System prompt — 引導式對話風格
const SYSTEM_PROMPT: string =
  "你是「榕耀管顧」的 AI 長小賀，C.J. Kuo 老師的專業助手。" +
  "\n\n" +
  "【你的角色與文化】\n" +
  "- 你是榕耀管顧的 AI 長小賀，語氣親切但專業，像一位悉心的講師，不是冷冰冷的機器人\n" +
  "- 回答時要像在跟客戶聊天，不是在寫報告\n" +
  "- 適時表達好奇心，讓對話有溫度\n" +
  "- 每次回答前想想：這個人的真正問題是什麼？他能立刻執行什麼？\n" +
  "- 連結 slug 只能從下方知識庫清單使用，不要自己編造連結\n\n" +
  "【知識庫文章】\n" +
  "1. AI 轉型實戰營 (/knowledge/ai-transformation-bootcamp) — 四階段路徑、RTIF、五大轉型要素\n" +
  "2. HR×AI 課程設計 (/knowledge/hr-ai-course-design) — 選→用→育→留、九宮格 2.0\n" +
  "3. 中小企業 ESG 實務 (/knowledge/sme-esg-guide) — 三大面向、起步三步驟\n" +
  "4. 製造業 AI 品質檢測 (/knowledge/manufacturing-ai-quality) — 台中射出廠案例\n" +
  "5. AI 成熟度評估 (/knowledge/ai-maturity-assessment) — 五大維度、Level 1-5\n" +
  "6. 團隊創新管理 (/knowledge/team-innovation-management) — 四項創新策略\n" +
  "7. AI 工具選型指南 (/knowledge/ai-tool-selection-guide) — 五大評估維度、TCO\n" +
  "8. 服務業 AI 客服導入 (/knowledge/service-ai-chatbot-case) — 電商案例\n" +
  "9. 政府 AI 補助資源 (/knowledge/gov-ai-subsidy-guide) — 各部會補助\n" +
  "10. 2026 AI 轉型趨勢 (/knowledge/ai-transformation-trends-2026) — 四大趨勢\n" +
  "11. Agentic AI 工作坊 (/knowledge/agentic-ai-transformation-workshop)\n" +
  "12. HR AI 轉型五層責任 (/knowledge/hr-ai-transformation-five-layers)\n" +
  "13. 策略是減法 (/knowledge/strategy-subtraction-traditional-industry)\n\n" +
  "【品牌資訊】\n" +
  "- 公司名稱：榕耀管顧 RongRise Consulting\n" +
  "- 創辦人：郭鎮榕 C.J. Kuo 老師\n" +
  "- 核心服務：AI 轉型策略、人才發展策略、ESG 永續諮詢\n" +
  "- 網站：https://rong-rise.com | 連絡：info@rongrise.com | LINE: @954qxhhe\n\n" +
  "【回答原則 — 引導式對話】\n" +
  "1. 回答精簡有意思，2-3 個重點即可，不要長篇大論\n" +
  "2. 用繁體中文回答，不要混英文思考過程\n" +
  "3. 推薦相關知識庫文章，格式：[文章標題](/knowledge/slug)\n" +
  "4. 如果問題不在知識庫範圍，誠實說明但提供一般性建議\n" +
  "5. 引導使用者深入討論：追問他的階段、預算、團隊大小\n" +
  "6. 如果使用者表現出高度意願，引導預約諮詢或瀏覽知識庫\n" +
  "7. ⚠️ 連結只能使用上述 13 個 slug，絕對不要自己編造\n" +
  "8. 不要輸出任何英文思考過程或推理鏈";

// 建立帶知識庫 context 的 system prompt
export function buildSystemPrompt(): string {
  return SYSTEM_PROMPT;
}

// 呼叫 OpenRouter API
export async function callChatAPI(
  messages: ChatMessage[]
): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    return getFallbackResponse(messages[messages.length - 1]?.content || "");
  }

  const allMessages: ChatMessage[] = [
    { role: "system", content: buildSystemPrompt() },
    ...messages,
  ];

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: allMessages,
        max_tokens: 350,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("API error:", response.status, errText);
      return getFallbackResponse(messages[messages.length - 1]?.content || "");
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (content) {
      return content;
    }

    return getFallbackResponse(messages[messages.length - 1]?.content || "");
  } catch (error) {
    console.error("Chat API error:", error);
    return getFallbackResponse(messages[messages.length - 1]?.content || "");
  }
}

// 本地 fallback 回應（當 API 不可用時）
// 使用 String.fromCharCode 避免任何 < > 字元被當成 JSX 解析
function getFallbackResponse(input: string): string {
  const lower = input.toLowerCase();
  const LT = String.fromCharCode(60);
  const GT = String.fromCharCode(62);
  const strongOpen = LT + "strong" + GT;
  const strongClose = LT + "/strong" + GT;
  const aOpen = LT + 'a href="/about#contact" class="text-primary font-medium hover:underline"' + GT;
  const aClose = LT + "/a" + GT;
  const aOpenKnowledge = LT + 'a href="/knowledge" class="text-primary font-medium hover:underline"' + GT;

  if (lower.includes("ai") || lower.includes("人工智慧") || lower.includes("轉型")) {
    return "感謝您對 AI 轉型的興趣！\n\n" +
      "作為榕耀管顧的 AI 長小賀，我建議您從以下方向開始：\n\n" +
      "1️⃣ " + strongOpen + "評估現狀" + strongClose + "：盤點企業的數字基礎\n" +
      "2️⃣ " + strongOpen + "識別場景" + strongClose + "：找出最容易被 AI 改善的流程\n" +
      "3️⃣ " + strongOpen + "小規模試點" + strongClose + "：選擇可控範圍進行概念驗證\n\n" +
      "📚 推薦閱讀：[AI 轉型實戰營：從入門到企業落地](/knowledge/ai-transformation-bootcamp)\n\n" +
      "📅 如需更深入的討論，歡迎" + aOpen + "預約 C.J. Kuo 老師的一對一諮詢" + aClose + "！";
  }

  if (lower.includes("esg") || lower.includes("永續")) {
    return "ESG 對中小企業的好處非常多！\n\n" +
      "🌱 " + strongOpen + "商業價值" + strongClose + "：\n" +
      "• 滿足供應鏈大廠的 ESG 要求，爭取更多訂單\n" +
      "• 提升品牌形象，吸引重視永續的客戶與人才\n" +
      "• 提前因應法規，降低未來合規成本\n\n" +
      "📚 推薦閱讀：[中小企業 ESG 實務入門](/knowledge/sme-esg-guide)\n\n" +
      "📅 歡迎" + aOpen + "聯繫我們" + aClose + "了解更多！";
  }

  if (lower.includes("人才") || lower.includes("培訓") || lower.includes("hr")) {
    return "建立人才培訓體系是轉型成功的關鍵！\n\n" +
      "📋 核心框架包括：\n" +
      "1️⃣ 能力盤點\n" +
      "2️⃣ 落差分析\n" +
      "3️⃣ 路徑設計\n" +
      "4️⃣ 混成學習\n" +
      "5️⃣ 成效追蹤\n\n" +
      "📚 推薦閱讀：[HR×AI：從認識到落地課程設計](/knowledge/hr-ai-course-design)\n\n" +
      "📅 歡迎" + aOpen + "預約諮詢" + aClose + "，讓我們為您量身打造培訓方案！";
  }

  if (lower.includes("預算") || lower.includes("費用") || lower.includes("錢") || lower.includes("成本")) {
    return "轉型的預算因企業規模而異，但不一定要花大錢才能開始！\n\n" +
      "💰 " + strongOpen + "分階段投入策略" + strongClose + "：\n" +
      "• 第一階段（評估規劃）：主要為顧問費用\n" +
      "• 第二階段（試點導入）：控制投入範圍\n" +
      "• 第三階段（擴大推廣）：依成效調整\n\n" +
      "許多企業透過" + strongOpen + "政府補助" + strongClose + "大幅降低轉型成本！\n\n" +
      "📚 推薦閱讀：[2026 年政府 AI 補助資源整理](/knowledge/gov-ai-subsidy-guide)\n\n" +
      "📅 歡迎" + aOpen + "預約免費諮詢" + aClose + "！";
  }

  return "感謝您的提問！\n\n" +
    "我是榕耀管顧的 AI 長小賀，專注於協助企業在 AI 轉型、人才發展、ESG 永續等領域找到方向。\n\n" +
    "📅 如需更深入的討論，歡迎" + aOpen + "預約 C.J. Kuo 老師的一對一諮詢" + aClose + "\n\n" +
    "或到" + aOpenKnowledge + "知識庫" + aClose + "瀏覽更多專業文章！";
}
