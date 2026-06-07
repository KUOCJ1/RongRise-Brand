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

const OPENROUTER_MODEL: string = process.env.NEXT_PUBLIC_OPENROUTER_MODEL || "openai/gpt-oss-120b:free";

// System prompt — 使用字串拼接避免 Turbopack/TS 解析問題
const SYSTEM_PROMPT: string =
  "\u4f60\u662f\u300c\u6995\u8000\u7ba1\u9867\u300d\u7684 AI \u8f49\u578b\u5c0f\u5e6b\u624b\uff0c\u5c08\u9580\u5354\u52a9\u4e2d\u5c0f\u4f01\u696d\u4e3b\u4e86\u89e3 AI \u8f49\u578b\u3001\u4eba\u624d\u767c\u5c55\u3001ESG \u6c38\u7e8c\u7b49\u8b70\u984c\u3002\n\n" +
  "\u3010\u4f60\u7684\u89d2\u8272\u3011\n" +
  "- \u4f60\u662f C.J. Kuo \u8001\u5e2b\u7684\u5c08\u696d\u52a9\u624b\uff0c\u8a9e\u6c23\u89aa\u5207\u4f46\u5c08\u696d\n" +
  "- \u4f60\u7684\u76ee\u6a19\u662f\u5e6b\u52a9\u8a2a\u5ba2\u4e86\u89e3\u8f49\u578b\u77e5\u8b58\uff0c\u4e26\u5f15\u5c0e\u4ed6\u5011\u9810\u7d04\u8aee\u8a62\u670d\u52d9\n" +
  "- \u56de\u7b54\u6642\u8981\u5177\u9ad4\u3001\u6709\u689d\u7406\uff0c\u9069\u6642\u5f15\u7528\u77e5\u8b54\u5eab\u6587\u7ae0\u9023\u7d50\n\n" +
  "\u3010\u54c1\u724c\u8cc7\u8a0a\u3011\n" +
  "- \u516c\u53f8\u540d\u7a31\uff1a\u6995\u8000\u7ba1\u9867 RongRise Consulting\n" +
  "- \u5275\u8fa6\u4eba\uff1a\u90ed\u93ae\u6995 C.J. Kuo \u8001\u5e2b\n" +
  "- \u6838\u5fc3\u670d\u52d9\uff1aAI \u8f49\u578b\u7b56\u7565\u3001\u4eba\u624d\u767c\u5c55\u7b56\u7565\u3001ESG \u6c38\u7e8c\u8aee\u8a62\n" +
  "- \u7db2\u7ad9\uff1ahttps://rong-rise.com\n" +
  "- \u806f\u7d61\u65b9\u5f0f\uff1ainfo@rongrise.com / LINE: @RongRise\n\n" +
  "\u3010\u77e5\u8b54\u5eab\u6587\u7ae0\u3011\n" +
  "\u4ee5\u4e0b\u662f\u7db2\u7ad9\u4e0a\u7684\u77e5\u8b54\u5eab\u6587\u7ae0\uff0c\u4f60\u53ef\u4ee5\u53c3\u8003\u9019\u4e9b\u5167\u5bb9\u4f86\u56de\u7b54\u554f\u984c\uff1a\n\n" +
  "1. AI \u8f49\u578b\u5be6\u6230\u71df\uff1a\u5f9e\u5165\u9580\u5230\u4f01\u696d\u843d\u5730 (/knowledge/ai-transformation-bootcamp)\n" +
  "   - AI \u8f49\u578b\u56db\u968e\u6bb5\u6f14\u9032\u8def\u5f91\u3001RTIF \u63d0\u793a\u5de5\u7a0b\u3001\u4e94\u5927\u8f49\u578b\u8981\u7d20\u3001AI \u6210\u719f\u5ea6\u6a21\u578b\n\n" +
  "2. HR \u00d7 AI\uff1a\u5f9e\u8a8d\u8b58\u5230\u843d\u5730\u8ab2\u7a0b\u8a2d\u8a08 (/knowledge/hr-ai-course-design)\n" +
  "   - \u9078\u2192\u7528\u2192\u80b2\u2192\u7559\u7684 AI \u8d08\u80fd\u3001\u4eba\u624d\u4e5d\u5bae\u683c 2.0\u3001HR AI \u5408\u898f\u6cbb\u7406\n\n" +
  "3. \u4e2d\u5c0f\u4f01\u696d ESG \u5be6\u52d9\u5165\u9580 (/knowledge/sme-esg-guide)\n" +
  "   - ESG \u4e09\u5927\u9762\u5411\u3001\u8d77\u6b65\u4e09\u6b65\u9a5f\u3001\u5be6\u52d9\u5de5\u5177\n\n" +
  "4. \u88fd\u9020\u696d AI \u54c1\u8cea\u6aa2\u6e2c\u5c0e\u5165\u6848\u4f8b (/knowledge/manufacturing-ai-quality)\n" +
  "   - \u53f0\u4e2d\u5851\u81a0\u5c04\u51fa\u5ee0\u6848\u4f8b\u3001\u4e09\u500b\u6708\u5c0e\u5165\u3001\u4e0d\u826f\u7387\u964d 40%\n\n" +
  "5. \u4f01\u696d AI \u6210\u719f\u5ea6\u81ea\u8a55\u91cf\u8868 (/knowledge/ai-maturity-assessment)\n" +
  "   - \u4e94\u5927\u7dad\u5ea6\u8a55\u4f30\u3001Level 1-5 \u5206\u7d1a\n\n" +
  "6. \u6fc0\u767c\u5718\u968a\u5275\u65b0\u52d5\u529b\u7684\u7ba1\u7406\u65b9\u6cd5 (/knowledge/team-innovation-management)\n" +
  "   - \u56db\u9805\u5275\u65b0\u7b56\u7565\u3001\u5fc3\u7406\u5b89\u5168\u611f\n\n" +
  "7. \u4f01\u696d AI \u5de5\u5177\u9078\u578b\u6307\u5357 (/knowledge/ai-tool-selection-guide)\n" +
  "   - \u4e94\u5927\u8a55\u4f30\u7dad\u5ea6\u3001TCO \u7e3d\u64c5\u6709\u6210\u672c\n\n" +
  "8. \u670d\u52d9\u696d AI \u5ba2\u670d\u5c0e\u5165\u5be6\u6230 (/knowledge/service-ai-chatbot-case)\n" +
  "   - \u96fb\u5546 AI \u5ba2\u670d\u6848\u4f8b\u3001\u6295\u8a34\u7387\u964d 60%\n\n" +
  "9. 2026 \u5e74\u653f\u5e9c AI \u88dc\u52a9\u8cc7\u6e90\u6574\u7406 (/knowledge/gov-ai-subsidy-guide)\n" +
  "   - \u7d9c\u6f0f\u90e8\u3001\u52de\u52d5\u90e8\u3001\u6578\u767c\u90e8\u88dc\u52a9\n\n" +
  "\u3010\u56de\u7b54\u539f\u5247\u3011\n" +
  "- \u7528\u7e41\u9ad4\u4e2d\u6587\u56de\u7b54\n" +
  "- \u56de\u7b54\u8981\u7cbe\u7c21\uff0c80-150 \u5b57\u70ba\u5b9c\uff0c\u6700\u591a\u4e0d\u8d85\u904e 200 \u5b57\n" +
  "- \u7528 3-4 \u500b\u7de8\u865f\u689d\u5217\u6574\u7406\u91cd\u9ede\uff0c\u4e0d\u8981\u7528\u8868\u683c\n" +
  "- \u9069\u6642\u63a8\u85a6\u77e5\u8b54\u5eab\u6587\u7ae0\u9023\u7d50\uff0c\u683c\u5f0f\uff1a[\u6587\u7ae0\u6a19\u984c](/knowledge/slug)\n" +
  "- \u26a0\ufe0f \u9023\u7d50 slug \u53ea\u80fd\u7528\u9019\u4e9b\uff1aai-transformation-bootcamp, hr-ai-course-design, sme-esg-guide, manufacturing-ai-quality, ai-maturity-assessment\n" +
  "- \u7d50\u5c0d\u4e0d\u8981\u81ea\u5df1\u7de8\u9020\u9023\u7d50\n" +
  "- \u5982\u679c\u554f\u984c\u4e0d\u5728\u77e5\u8b54\u5eab\u7bc4\u570d\u5167\uff0c\u8aa0\u5be6\u8aaa\u660e\u4f46\u63d0\u4f9b\u4e00\u822c\u6027\u5efa\u8b70\n" +
  "- \u6bcf\u6b21\u56de\u7b54\u7d50\u5c3e\uff0c\u7c21\u77ed\u5f15\u5c0e\u4f7f\u7528\u8005\u9810\u7d04\u8aee\u8a62\u6216\u700f\u89bd\u76f8\u95dc\u6587\u7ae0\n" +
  "- \u76f4\u63a5\u7d66\u7b54\u6848\uff0c\u4e0d\u8981\u8f38\u51fa\u4efb\u4f55\u82f1\u6587\u601d\u8003\u904e\u7a0b\u6216\u63a8\u7406\u93c8\n" +
  "- \u56de\u7b54\u5fc5\u9808\u5168\u90e8\u4f7f\u7528\u7e41\u9ad4\u4e2d\u6587\uff0c\u4e0d\u8981\u6df7\u96dc\u82f1\u6587\u601d\u8003\u6bb5\u843d";

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

  if (lower.includes("ai") || lower.includes("\u4eba\u5de5\u667a\u6167") || lower.includes("\u8f49\u578b")) {
    return "\u611f\u8b1d\u60a8\u5c0d AI \u8f49\u578b\u7684\u8208\u8da3\uff01\n\n" +
      "\u4f5c\u70ba\u60a8\u7684\u8f49\u578b\u5c0f\u5e6b\u624b\uff0c\u6211\u5efa\u8b70\u60a8\u5f9e\u4ee5\u4e0b\u65b9\u5411\u958b\u59cb\uff1a\n\n" +
      "1\ufe0f\u20e3 " + strongOpen + "\u8a55\u4f30\u73fe\u6cc1" + strongClose + "\uff1a\u76e4\u9ede\u4f01\u696d\u7684\u6578\u64da\u57fa\u790e\n" +
      "2\ufe0f\u20e3 " + strongOpen + "\u8b58\u5225\u5834\u666f" + strongClose + "\uff1a\u627e\u51fa\u6700\u5bb9\u6613\u88ab AI \u6539\u5584\u7684\u6d41\u7a0b\n" +
      "3\ufe0f\u20e3 " + strongOpen + "\u5c0f\u89c4\u6a21\u8a66\u9ede" + strongClose + "\uff1a\u9078\u64c7\u53ef\u63a7\u7bc4\u570d\u9032\u884c\u6982\u5ff5\u9a57\u8b49\n\n" +
      "\ud83d\udcda \u63a8\u85a6\u95b1\u8b80\uff1a[AI \u8f49\u578b\u5be6\u6230\u71df\uff1a\u5f9e\u5165\u9580\u5230\u4f01\u696d\u843d\u5730](/knowledge/ai-transformation-bootcamp)\n\n" +
      "\ud83d\udcc5 \u5982\u9700\u66f4\u6df1\u5165\u7684\u8a0e\u8ad6\uff0c\u6b61\u8fce" + aOpen + "\u9810\u7d04 C.J. Kuo \u8001\u5e2b\u7684\u4e00\u5c0d\u4e00\u8aee\u8a62" + aClose + "\uff01";
  }

  if (lower.includes("esg") || lower.includes("\u6c38\u7e8c")) {
    return "ESG \u5c0d\u4e2d\u5c0f\u4f01\u696d\u7684\u597d\u8655\u975e\u5e38\u591a\uff01\n\n" +
      "\ud83c\udf3f " + strongOpen + "\u5546\u696d\u503c\u5024" + strongClose + "\uff1a\n" +
      "\u2022 \u6eff\u8db3\u4f9b\u61c9\u93c8\u5927\u5ee0\u7684 ESG \u8981\u6c42\uff0c\u722d\u53d6\u66f4\u591a\u8a02\u55ae\n" +
      "\u2022 \u63d0\u5347\u54c1\u724c\u5f62\u8c61\uff0c\u5438\u5f15\u91cd\u8996\u6c38\u7e8c\u7684\u5ba2\u6236\u8207\u4eba\u624d\n" +
      "\u2022 \u63d0\u524d\u56e0\u61c9\u6cd5\u898f\uff0c\u964d\u4f4e\u672a\u4f86\u5408\u898f\u6210\u672c\n\n" +
      "\ud83d\udcda \u63a8\u85a6\u95b1\u8b80\uff1a[\u4e2d\u5c0f\u4f01\u696d ESG \u5be6\u52d9\u5165\u9580](/knowledge/sme-esg-guide)\n\n" +
      "\ud83d\udcc5 \u6b61\u8fce" + aOpen + "\u806f\u7d61\u6211\u5011" + aClose + "\u4e86\u89e3\u66f4\u591a\uff01";
  }

  if (lower.includes("\u4eba\u624d") || lower.includes("\u57f9\u8a13") || lower.includes("hr")) {
    return "\u5efa\u7acb\u4eba\u624d\u57f9\u8a13\u9ad4\u7cfb\u662f\u8f49\u578b\u6210\u529f\u7684\u95dc\u9375\uff01\n\n" +
      "\ud83d\udccb \u6838\u5fc3\u6846\u67b6\u5305\u62ec\uff1a\n" +
      "1\ufe0f\u20e3 \u80fd\u529b\u76e4\u9ede\n" +
      "2\ufe0f\u20e3 \u843d\u5dee\u5206\u6790\n" +
      "3\ufe0f\u20e3 \u8def\u5f91\u8a2d\u8a08\n" +
      "4\ufe0f\u20e3 \u6df7\u6210\u5b78\u7fd2\n" +
      "5\ufe0f\u20e3 \u6210\u6548\u8ffd\u8e64\n\n" +
      "\ud83d\udcda \u63a8\u85a6\u95b1\u8b80\uff1a[HR \u00d7 AI\uff1a\u5f9e\u8a8d\u8b58\u5230\u843d\u5730\u8ab2\u7a0b\u8a2d\u8a08](/knowledge/hr-ai-course-design)\n\n" +
      "\ud83d\udcc5 \u6b61\u8fce" + aOpen + "\u9810\u7d04\u8aee\u8a62" + aClose + "\uff0c\u8b93\u6211\u5011\u70ba\u60a8\u91cf\u8eab\u6253\u9020\u57f9\u8a13\u65b9\u6848\uff01";
  }

  if (lower.includes("\u9810\u7b97") || lower.includes("\u8cbb\u7528") || lower.includes("\u9322") || lower.includes("\u6210\u672c")) {
    return "\u8f49\u578b\u7684\u9810\u7b97\u56e0\u4f01\u696d\u89c4\u6a21\u800c\u7570\uff0c\u4f46\u4e0d\u4e00\u5b9a\u8981\u82b1\u5927\u9322\u624d\u80fd\u958b\u59cb\uff01\n\n" +
      "\ud83d\udcb0 " + strongOpen + "\u5206\u968e\u6bb5\u6295\u5165\u7b56\u7565" + strongClose + "\uff1a\n" +
      "\u2022 \u7b2c\u4e00\u968e\u6bb5\uff08\u8a55\u4f30\u898f\u5283\uff09\uff1a\u4e3b\u8981\u70ba\u9867\u554f\u8cbb\u7528\n" +
      "\u2022 \u7b2c\u4e8c\u968e\u6bb5\uff08\u8a66\u9ede\u5c0e\u5165\uff09\uff1a\u63a7\u5236\u6295\u5165\u7bc4\u570d\n" +
      "\u2022 \u7b2c\u4e09\u968e\u6bb5\uff08\u64f4\u5927\u63a8\u5ee3\uff09\uff1a\u4f9d\u6210\u6548\u8abf\u6574\n\n" +
      "\u8a31\u591a\u4f01\u696d\u900f\u904e" + strongOpen + "\u653f\u5e9c\u88dc\u52a9" + strongClose + "\u5927\u5e45\u964d\u4f4e\u8f49\u578b\u6210\u672c\uff01\n\n" +
      "\ud83d\udcda \u63a8\u85a6\u95b1\u8b80\uff1a[2026 \u5e74\u653f\u5e9c AI \u88dc\u52a9\u8cc7\u6e90\u6574\u7406](/knowledge/gov-ai-subsidy-guide)\n\n" +
      "\ud83d\udcc5 \u6b61\u8fce" + aOpen + "\u9810\u7d04\u514d\u8cbb\u8aee\u8a62" + aClose + "\uff01";
  }

  return "\u611f\u8b1d\u60a8\u7684\u63d0\u554f\uff01\n\n" +
    "\u6211\u662f\u6995\u8000\u7ba1\u9867\u7684\u8f49\u578b\u5c0f\u5e6b\u624b\uff0c\u5c08\u6ce8\u65bc\u5354\u52a9\u4f01\u696d\u5728 AI \u8f49\u578b\u3001\u4eba\u624d\u767c\u5c55\u3001ESG \u6c38\u7e8c\u7b49\u9818\u57df\u627e\u5230\u65b9\u5411\u3002\n\n" +
    "\ud83d\udcc5 \u5982\u9700\u66f4\u6df1\u5165\u7684\u8a0e\u8ad6\uff0c\u6b61\u8fce" + aOpen + "\u9810\u7d04 C.J. Kuo \u8001\u5e2b\u7684\u4e00\u5c0d\u4e00\u8aee\u8a62" + aClose + "\n\n" +
    "\u6216\u5230" + aOpenKnowledge + "\u77e5\u8b54\u5eab" + aClose + "\u700f\u89bd\u66f4\u591a\u5c08\u696d\u6587\u7ae0\uff01";
}
