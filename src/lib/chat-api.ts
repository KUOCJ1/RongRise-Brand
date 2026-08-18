// src/lib/chat-api.ts
// 小幫手 API 呼叫模組 — P0-3 升級：改走榕耀管顧自家 RAG 知識庫問答 API
//
// 舊版直接從前端呼叫 OpenRouter（NEXT_PUBLIC_OPENROUTER_API_KEY 會暴露在 bundle 中），
// 新版改為呼叫 https://rong-rise.com/api/assistant/ask（Traefik → VPS public-assistant :3009）：
//   - 後端做中文 bigram TF-IDF 檢索（56 篇文章 + 電子報 + 工具頁）
//   - DeepSeek 生成回答並標 [n] 引用來源
//   - 前端不再持有任何 API key
//   - API 不可用時退回本地 fallback 回應

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatSource {
  index: number;
  title: string;
  url: string;
  snippet?: string;
}

export interface ChatReply {
  content: string;
  sources: ChatSource[];
}

const API_URL = "/api/assistant/ask";

// 呼叫 RAG 知識庫問答 API
export async function callChatAPI(messages: ChatMessage[]): Promise<ChatReply> {
  const last = messages[messages.length - 1];
  const question = last?.role === "user" ? (last.content || "").trim() : "";
  if (!question) {
    return { content: getFallbackResponse(""), sources: [] };
  }

  // 傳送完整歷史（後端會自行取用脈絡），問題放最後一則
  const history = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ role: m.role, content: m.content }));

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, history }),
    });

    if (!response.ok) {
      console.error("Assistant API error:", response.status);
      return { content: getFallbackResponse(question), sources: [] };
    }

    const data = await response.json();
    if (data?.answer) {
      return { content: data.answer, sources: data.sources || [] };
    }
    if (data?.error) {
      console.error("Assistant API error:", data.error);
    }
    return { content: getFallbackResponse(question), sources: [] };
  } catch (error) {
    console.error("Chat API error:", error);
    return { content: getFallbackResponse(question), sources: [] };
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
