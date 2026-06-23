import { NextRequest, NextResponse } from "next/server";

/* ============================================
   Newsletter Subscribe API
   POST /api/newsletter/subscribe
   
   Body: {
     name, email, company, industry,
     ai_stage, challenges[], message, source
   }
   ============================================ */

// In-memory store (replace with DB in production)
// For now, append to a JSON file on the server
import { promises as fs } from "fs";
import path from "path";

const SUBSCRIBERS_FILE = path.join(
  process.cwd(),
  "..",
  "content-engine",
  "newsletter-subscribers.json"
);

// Email sequence content (5 emails over 10 days)
const EMAIL_SEQUENCE = [
  {
    day: 0,
    subject: "歡迎！這是你的 AI 轉型評估報告 📊",
    template: "welcome",
  },
  {
    day: 3,
    subject: "你的同行夥伴已經開始做了",
    template: "case_study",
  },
  {
    day: 5,
    subject: "AI 轉型的 3 個最常見地雷",
    template: "pitfalls",
  },
  {
    day: 7,
    subject: "選擇 AI 顧問前必問的 5 個問題",
    template: "choose_consultant",
  },
  {
    day: 10,
    subject: "準備好踏出下一步了嗎？",
    template: "cta",
  },
];

async function loadSubscribers(): Promise<any[]> {
  try {
    const data = await fs.readFile(SUBSCRIBERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveSubscribers(subs: any[]) {
  await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(subs, null, 2));
}

// Generate personalized assessment report based on form data
function generateReport(data: any): string {
  const stageMap: Record<string, string> = {
    not_started: "觀望期",
    exploring: "探索期",
    piloting: "試用期",
    scaling: "擴展期",
    mature: "成熟期",
  };

  const stage = stageMap[data.ai_stage] || data.ai_stage;
  const challenges = data.challenges || [];

  let stageAdvice = "";
  switch (data.ai_stage) {
    case "not_started":
      stageAdvice = `你目前處於「${stage}」，這是很多企業主的起點。建議先從一個小問題開始，不要想著一步登天。找一個部門、一個痛點，設定 30 天的試行計劃。`;
      break;
    case "exploring":
      stageAdvice = `你目前處於「${stage}」，已經開始關注 AI 工具了。下一步是選定 1-2 個工具，讓團隊開始實際操作。建議從「不需要寫程式的工具」開始，降低門檻。`;
      break;
    case "piloting":
      stageAdvice = `你目前處於「${stage}」，已經有人開始用了！這是很好的進展。下一步是記錄成效、建立 SOP，讓成功經驗可以複製到其他部門。`;
      break;
    case "scaling":
      stageAdvice = `你目前處於「${stage}」，已經看到成效了。這個階段最重要的是建立「AI 治理框架」——誰可以用什麼工具、資料怎麼保護、成效怎麼衡量。`;
      break;
    case "mature":
      stageAdvice = `你目前處於「${stage}」，AI 已經是日常運作了。下一步是探索更高階的應用：AI Agent 自動化流程、跨部門數據整合、甚至是建立自己的 AI 模型。`;
      break;
    default:
      stageAdvice = `你的 AI 階段：${stage}。`;
  }

  const challengeAdvice: Record<string, string> = {
    "不知道從哪裡開始":
      "💡 建議：先做一次「流程盤點」，找出最耗時的前 3 個工作流程，這就是你的 AI 切入點。",
    "預算有限":
      "💡 建議：很多 AI 工具都有免費方案。ChatGPT、Gemini、Claude 的免費版就夠你開始實驗了。重點不是花錢，而是先做。",
    "缺乏技術人才":
      "💡 建議：不需要雇用 AI 工程師。現在有很多「No-Code AI 工具」，讓一般員工也能上手。先培養內部種子選手。",
    "擔心員工反彈":
      "💡 建議：把 AI 定位為「幫手」而不是「取代者」。讓員工參與選擇工具，給他們時間學習，成效會更好。",
    "不確定 ROI 怎麼算":
      "💡 建議：先追蹤「時間節省」就好。如果一個工具每週幫團隊省 5 小時，乘上時薪，ROI 就出來了。",
    "資料品質不夠好":
      "💡 建議：資料清理是 AI 專案最花時間的部分。建議先從「不需要大量資料」的工具開始，例如 AI 寫作、AI 客服。",
    "太多工具不知道選哪個":
      "💡 建議：不要追逐最新工具。選一個最多人用、教學資源最豐富的，先做到熟練再說。",
    "主管不支持":
      "💡 建議：用數據說話。找一個競爭對手或同業的案例，讓主管看到「別人都已經在做了」。",
  };

  const challengeText =
    challenges.length > 0
      ? challenges
          .map((c: string) => challengeAdvice[c] || `- ${c}`)
          .join("\n")
      : "你目前沒有勾選特定挑戰，這代表你還在探索階段。";

  return `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>你的 AI 轉型評估報告</title>
<style>
  body { font-family: 'Noto Sans TC', system-ui, sans-serif; background: #0D1B2A; color: #e2e8f0; margin: 0; padding: 0; }
  .container { max-width: 640px; margin: 0 auto; padding: 40px 20px; }
  .header { text-align: center; padding: 30px 0; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 30px; }
  .header h1 { color: #E8912A; font-size: 24px; margin: 0 0 8px; }
  .header p { color: #94a3b8; font-size: 14px; margin: 0; }
  .section { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; margin-bottom: 20px; }
  .section h2 { color: #2EC4B6; font-size: 18px; margin: 0 0 12px; }
  .section p, .section li { line-height: 1.8; font-size: 15px; }
  .stage-badge { display: inline-block; background: rgba(26,109,181,0.2); border: 1px solid rgba(26,109,181,0.4); color: #1A6DB5; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; }
  .challenge-item { background: rgba(232,145,42,0.08); border-left: 3px solid #E8912A; padding: 12px 16px; margin: 8px 0; border-radius: 0 8px 8px 0; font-size: 14px; }
  .cta-box { background: linear-gradient(135deg, rgba(232,145,42,0.15), rgba(46,196,182,0.1)); border: 1px solid rgba(232,145,42,0.3); border-radius: 16px; padding: 24px; text-align: center; margin-top: 30px; }
  .cta-box h3 { color: #E8912A; margin: 0 0 12px; }
  .cta-box p { margin: 0 0 16px; }
  .cta-button { display: inline-block; background: #E8912A; color: #0D1B2A; padding: 12px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px; }
  .footer { text-align: center; padding: 30px 0; color: #475569; font-size: 12px; }
  .footer a { color: #64748b; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>🎯 AI 轉型評估報告</h1>
    <p>為 ${data.name}（${data.company}）客製化</p>
  </div>

  <div class="section">
    <h2>你的現況</h2>
    <p>產業：${data.industry}</p>
    <p>AI 階段：<span class="stage-badge">${stage}</span></p>
  </div>

  <div class="section">
    <h2>📋 專屬建議</h2>
    <p>${stageAdvice}</p>
  </div>

  <div class="section">
    <h2>🚧 根據你的挑戰</h2>
    ${challenges
      .map(
        (c: string) =>
          `<div class="challenge-item">${challengeAdvice[c] || c}</div>`
      )
      .join("")}
  </div>

  <div class="section">
    <h2>📅 接下來的培育計畫</h2>
    <p>在接下來的 10 天，你會收到 5 封精心設計的 Email，帶你一步步了解 AI 轉型：</p>
    <ul>
      <li><strong>Day 3：</strong>你的同行夥伴已經開始做了（案例分享）</li>
      <li><strong>Day 5：</strong>AI 轉型的 3 個最常見地雷</li>
      <li><strong>Day 7：</strong>選擇 AI 顧問前必問的 5 個問題</li>
      <li><strong>Day 10：</strong>準備好踏出下一步了嗎？</li>
    </ul>
  </div>

  <div class="cta-box">
    <h3>想要更深入的諮詢？</h3>
    <p>如果你覺得這份報告有幫助，歡迎預約 CJ 哥的免費 30 分鐘諮詢。</p>
    <a href="https://calendly.com/rongrise/consult" class="cta-button">預約免費諮詢 →</a>
  </div>

  <div class="footer">
    <p>榕耀管顧 RongRise Consulting</p>
    <p><a href="https://rong-rise.com">rong-rise.com</a></p>
    <p>如果不想再收到信件，<a href="https://rong-rise.com/unsubscribe?email=${encodeURIComponent(data.email)}">點此取消訂閱</a></p>
  </div>
</div>
</body>
</html>
`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, industry, ai_stage, challenges, message, source } = body;

    if (!name || !email || !company || !industry || !ai_stage) {
      return NextResponse.json(
        { error: "請填寫所有必填欄位" },
        { status: 400 }
      );
    }

    // Load existing subscribers
    const subscribers = await loadSubscribers();

    // Check if already subscribed
    const existing = subscribers.find((s: any) => s.email === email);
    if (existing) {
      // Update existing
      existing.name = name;
      existing.company = company;
      existing.industry = industry;
      existing.ai_stage = ai_stage;
      existing.challenges = challenges;
      existing.message = message;
      existing.source = source;
      existing.updated_at = new Date().toISOString();
    } else {
      // Add new
      subscribers.push({
        name,
        email,
        company,
        industry,
        ai_stage,
        challenges: challenges || [],
        message: message || "",
        source: source || "unknown",
        subscribed_at: new Date().toISOString(),
        sequence_day: 0,
        emails_sent: [],
      });
    }

    await saveSubscribers(subscribers);

    // TODO: Trigger welcome email with assessment report
    // This would integrate with your email service (SendGrid, Resend, etc.)

    return NextResponse.json({
      success: true,
      message: "訂閱成功",
    });
  } catch (error: any) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "伺服器錯誤，請稍後再試" },
      { status: 500 }
    );
  }
}
