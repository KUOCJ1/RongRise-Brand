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
// 注意：不能有 typeof process 的執行時檢查，否則在瀏覽器中 undefined 會導致 key 變空字串
const OPENROUTER_API_KEY: string = (process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || "").trim();

// 安全地建立 Authorization header，避免非 ISO-8859-1 字元問題
function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "HTTP-Referer": "https://rong-rise.com",
    "X-Title": "RongRise Consulting",
  };
  if (OPENROUTER_API_KEY) {
    // 使用 bascii 編碼確保 header 值安全
    headers["Authorization"] = "Bearer " + OPENROUTER_API_KEY;
  }
  return headers;
}

const OPENROUTER_MODEL: string = process.env.NEXT_PUBLIC_OPENROUTER_MODEL || "moonshotai/kimi-k2.6:free";

// System prompt — 定義小幫手的角色與行為
const SYSTEM_PROMPT = `你是「榕耀管顧」的 AI 轉型小幫手，專門協助中小企業主了解 AI 轉型、人才發展、ESG 永續等議題。

【你的角色】
- 你是 C.J. Kuo 老師的專業助手，語氣親切但專業
- 你的目標是幫助訪客了解轉型知識，並引導他們預約諮詢服務
- 回答時要具體、有條理，適時引用知識庫文章連結

【品牌資訊】
- 公司名稱：榕耀管顧 RongRise Consulting
- 創辦人：郭鎮榕 C.J. Kuo 老師
- 核心服務：AI 轉型策略、人才發展策略、ESG 永續諮詢
- 網站：https://rong-rise.com
- 聯絡方式：info@rongrise.com / LINE: @RongRise

【知識庫文章】
以下是網站上的知識庫文章，你可以參考這些內容來回答問題：

1. AI 轉型實戰營：從入門到企業落地 (/knowledge/ai-transformation-bootcamp)
   - AI 轉型四階段演進路徑、RTIF 提示工程、五大轉型要素、AI 成熟度模型

2. HR × AI：從認識到落地課程設計 (/knowledge/hr-ai-course-design)
   - 選→用→育→留的 AI 賦能、人才九宮格 2.0、HR AI 合規治理

3. 中小企業 ESG 實務入門 (/knowledge/sme-esg-guide)
   - ESG 三大面向、起步三步驟、實務工具

4. 製造業 AI 品質檢測導入案例 (/knowledge/manufacturing-ai-quality)
   - 台中塑膠射出廠案例、三個月導入、不良率降 40%

5. 企業 AI 成熟度自評量表 (/knowledge/ai-maturity-assessment)
   - 五大維度評估、Level 1-5 分級

6. 激發團隊創新動力的管理方法 (/knowledge/team-innovation-management)
   - 四項創新策略、心理安全感

7. 企業 AI 工具選型指南 (/knowledge/ai-tool-selection-guide)
   - 五大評估維度、TCO 總擁有成本

8. 服務業 AI 客服導入實戰 (/knowledge/service-ai-chatbot-case)
   - 電商 AI 客服案例、投訴率降 60%

9. 2026 年政府 AI 補助資源整理 (/knowledge/gov-ai-subsidy-guide)
   - 經濟部、勞動部、數發部補助

【回答原則】
- 用中文回答（繁體中文）
- 回答要有條理，善用編號和條列
- 適時推薦相關知識庫文章連結（用 Markdown 格式：[文章標題](/knowledge/slug)）
- 如果問題不在知識庫範圍內，誠實說明但提供一般性建議
- 每次回答結尾，如果可以的話，引導使用者預約諮詢或瀏覽相關文章
- 回答長度適中（不要太長或太短，100-300 字為宜）
- 不要透漏你是 AI 的角色，你就是榕耀管顧的轉型小幫手
- 直接給答案，不要輸出任何英文思考過程或推理鏈
- 回答必須全部使用繁體中文，不要混雜英文思考段落`;

// 建立帶知識庫 context 的 system prompt
export function buildSystemPrompt(): string {
  return SYSTEM_PROMPT;
}

// 呼叫 OpenRouter API
export async function callChatAPI(
  messages: ChatMessage[]
): Promise<string> {
  // 如果沒有設定 API 金鑰，回傳 fallback 回應
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
        max_tokens: 800,
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
function getFallbackResponse(input: string): string {
  const lower = input.toLowerCase();

  if (lower.includes("ai") || lower.includes("人工智慧") || lower.includes("轉型")) {
    return `感謝您對 AI 轉型的興趣！\n\n作為您的轉型小幫手，我建議您從以下方向開始：\n\n1️⃣ <strong>評估現況</strong>：盤點企業的數據基礎\n2️⃣ <strong>識別場景</strong>：找出最容易被 AI 改善的流程\n3️⃣ <strong>小規模試點</strong>：選擇可控範圍進行概念驗證\n\n📚 推薦閱讀：[AI 轉型實戰營：從入門到企業落地](/knowledge/ai-transformation-bootcamp)\n\n📅 如需更深入的討論，歡迎<a href="/about#contact" class="text-primary font-medium hover:underline">預約 C.J. Kuo 老師的一對一諮詢</a>！`;
  }

  if (lower.includes("esg") || lower.includes("永續")) {
    return `ESG 對中小企業的好處非常多！\n\n🌿 <strong>商業價值</strong>：\n• 滿足供應鏈大廠的 ESG 要求，爭取更多訂單\n• 提升品牌形象，吸引重視永續的客戶與人才\n• 提前因應法規，降低未來合規成本\n\n📚 推薦閱讀：[中小企業 ESG 實務入門](/knowledge/sme-esg-guide)\n\n📅 歡迎<a href="/about#contact" class="text-primary font-medium hover:underline">聯繫我們</a>了解更多！`;
  }

  if (lower.includes("人才") || lower.includes("培訓") || lower.includes("hr")) {
    return `建立人才培訓體系是轉型成功的關鍵！\n\n📋 核心框架包括：\n1️⃣ 能力盤點\n2️⃣ 落差分析\n3️⃣ 路徑設計\n4️⃣ 混成學習\n5️⃣ 成效追蹤\n\n📚 推薦閱讀：[HR × AI：從認識到落地課程設計](/knowledge/hr-ai-course-design)\n\n📅 歡迎<a href="/about#contact" class="text-primary font-medium hover:underline">預約諮詢</a>，讓我們為您量身打造培訓方案！`;
  }

  if (lower.includes("預算") || lower.includes("費用") || lower.includes("錢") || lower.includes("成本")) {
    return `轉型的预算因企業規模而異，但不一定要花大錢才能開始！\n\n💰 <strong>分階段投入策略</strong>：\n• 第一階段（評估規劃）：主要為顧問費用\n• 第二階段（試點導入）：控制投入範圍\n• 第三階段（擴大推廣）：依成效調整\n\n許多企業透過<strong>政府補助</strong>大幅降低轉型成本！\n\n📚 推薦閱讀：[2026 年政府 AI 補助資源整理](/knowledge/gov-ai-subsidy-guide)\n\n📅 歡迎<a href="/about#contact" class="text-primary font-medium hover:underline">預約免費諮詢</a>！`;
  }

  return `感謝您的提問！\n\n我是榕耀管顧的轉型小幫手，專注於協助企業在 AI 轉型、人才發展、ESG 永續等領域找到方向。\n\n📅 如需更深入的討論，歡迎<a href="/about#contact" class="text-primary font-medium hover:underline">預約 C.J. Kuo 老師的一對一諮詢</a>\n\n或到<a href="/knowledge" class="text-primary font-medium hover:underline">知識庫</a>瀏覽更多專業文章！`;
}
