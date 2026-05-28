"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

/* ============================================
   小幫手 Assistant Page (Enhanced)
   ============================================ */

interface Message {
  role: "user" | "assistant";
  content: string;
}

const quickQuestions = [
  "AI 轉型該從哪裡開始？",
  "如何建立人才培訓體系？",
  "ESG 對中小企業有什麼好處？",
  "轉型需要多少預算？",
  "你們提供哪些服務？",
  "如何評估 AI 成熟度？",
  "製造業如何導入 AI？",
  "什麼是 ESG？",
];

interface QA {
  keywords: string[];
  response: string;
  slug?: string;
}

const knowledgeBase: QA[] = [
  {
    keywords: ["ai 轉型", "ai轉型", "人工智慧轉型", "ai 導入", "ai導入"],
    slug: "ai-transformation-bootcamp",
    response:
      "很棒的問題！AI 轉型的起點通常是<strong>評估現況</strong>。建議您從以下三個步驟開始：\n\n1️⃣ <strong>盤點數據基礎</strong>：檢視企業目前的數據收集與管理狀況\n2️⃣ <strong>識別應用場景</strong>：找出最容易被 AI 改善的流程環節\n3️⃣ <strong>小規模試點</strong>：選擇一個可控的範圍進行概念驗證\n\n📚 推薦閱讀：<a href=\"/knowledge/ai-transformation-bootcamp\" class=\"text-primary font-medium hover:underline\">AI 轉型實戰營：從入門到企業落地</a>\n💡 也可以到<a href=\"/downloads\" class=\"text-primary font-medium hover:underline\">下載區</a>免費取得「AI 成熟度自評量表」！",
  },
  {
    keywords: ["人才", "培訓", "學習", "hr", "課程"],
    slug: "hr-ai-course-design",
    response:
      "建立有效的人才培訓體系需要<strong>系統性的規劃</strong>。以下是核心框架：\n\n1️⃣ <strong>能力盤點</strong>：建立各職位所需的能力地圖\n2️⃣ <strong>落差分析</strong>：對照現況找出培訓需求\n3️⃣ <strong>路徑設計</strong>：設計從基礎到進階的學習路徑\n4️⃣ <strong>混成學習</strong>：結合線上課程、實作演練與導師制度\n5️⃣ <strong>成效追蹤</strong>：建立可衡量的學習成效指標\n\n📚 推薦閱讀：<a href=\"/knowledge/hr-ai-course-design\" class=\"text-primary font-medium hover:underline\">HR × AI：從認識到落地課程設計</a>\n📚 延伸閱讀：<a href=\"/knowledge/team-innovation-management\" class=\"text-primary font-medium hover:underline\">激發團隊創新動力的管理方法</a>",
  },
  {
    keywords: ["esg", "永續", "環保", "綠色", "csr"],
    slug: "sme-esg-guide",
    response:
      "ESG 對中小企業的好處遠超想像！\n\n🌿 <strong>商業價值</strong>：\n• 滿足供應鏈大廠的 ESG 要求，爭取更多訂單\n• 提升品牌形象，吸引重視永續的客戶與人才\n• 提前因應法規，降低未來合規成本\n\n📊 <strong>財務效益</strong>：\n• 節能減碳直接降低營運成本\n• 越來越多投資機構將 ESG 納入評估\n• 政府補助與優惠政策多傾向 ESG 達標企業\n\n📚 推薦閱讀：<a href=\"/knowledge/sme-esg-guide\" class=\"text-primary font-medium hover:underline\">中小企業 ESG 實務入門</a>\n📋 也可以到<a href=\"/downloads\" class=\"text-primary font-medium hover:underline\">下載區</a>取得「ESG 現況盤點清單」！",
  },
  {
    keywords: ["預算", "費用", "錢", "成本", "投資", "花費"],
    response:
      "轉型預算因企業規模與目標而異，但好消息是——<strong>不一定要花大錢才能開始</strong>！\n\n💰 <strong>分階段投入策略</strong>：\n• 第一階段（評估規劃）：主要為顧問費用，相對低\n• 第二階段（試點導入）：選擇特定流程，控制投入\n• 第三階段（擴大推廣）：依試點成效調整投入規模\n\n許多企業透過<strong>政府補助</strong>大幅降低轉型成本，我們可以協助您評估適合的方案。\n\n📅 建議預約一次免費諮詢，讓我們了解您的狀況後提供更具體的建議！",
  },
    {
    keywords: ["服務", "做什麼", "提供", "項目", "方案"],
    response:
      "榕耀管顧專注於三大核心服務：\n\n🤖 <strong>AI 轉型策略</strong>\nAI 成熟度評估、導入策略規劃、自動化流程設計、AI 人才培訓\n\n👥 <strong>人才發展策略</strong>\n組織能力建構、數位人才培訓、接班人計畫、績效管理優化\n\n🌱 <strong>ESG 永續諮詢</strong>\nESG 現況評估、永續策略規劃、指標體系建立、社會影響力報告\n\n我們的服務方式是<strong>諮詢顧問 + 實務落地</strong>，不只是給方案，更陪伴企業走完轉型的每一步。\n\n📧 歡迎<a href=\"/about#contact\" class=\"text-primary font-medium hover:underline\">聯繫我們</a>安排會談！",
  },
  {
    keywords: ["ai 成熟度", "ai成熟度", "評估", "自評", "成熟度"],
    slug: "ai-maturity-assessment",
    response:
      "評估 AI 成熟度是制定轉型策略的第一步！\n\n📊 我們從<strong>五個維度</strong>來評估：\n1️⃣ 基礎設施 — 運算資源與 IT 架構\n2️⃣ 數據品質 — 數據治理與可存取性\n3️⃣ 人才能力 — AI 素養與專業人才\n4️⃣ 組織文化 — 創新與實驗精神\n5️⃣ 應用場景 — 目標明確度與商業價值\n\n📚 推薦閱讀：<a href=\"/knowledge/ai-maturity-assessment\" class=\"text-primary font-medium hover:underline\">企業 AI 成熟度自評量表</a>\n📋 到<a href=\"/downloads\" class=\"text-primary font-medium hover:underline\">下載區</a>免費取得完整量表！",
  },
  {
    keywords: ["製造", "工廠", "產線", "品質", "檢測", "品管"],
    slug: "manufacturing-ai-quality",
    response:
      "製造業導入 AI 最常見的切入點是<strong>品質檢測</strong>！\n\n🏭 以中部一家塑膠射出廠為例：\n• 在三個月內成功導入 AI 視覺檢測\n• 不良率從 5% 降至 3%（降低 40%）\n• 檢測速度提升 3 倍\n• 每月節省人力成本約 15 萬元\n\n🔑 關鍵成功因素：\n1. 最高主管支持\n2. 大量高品質訓練數據\n3. 漸進式導入（人機協作）\n4. 持續優化模型\n\n📚 推薦閱讀：<a href=\"/knowledge/manufacturing-ai-quality\" class=\"text-primary font-medium hover:underline\">製造業 AI 品質檢測導入案例</a>",
  },
  {
    keywords: ["創新", "團隊", "管理", "領導", "激勵"],
    slug: "team-innovation-management",
    response:
      "創新不只是口號，而是可以透過<strong>系統性方法</strong>培養的組織能力！\n\n🛠️ 打造創新型組織的四個策略：\n1️⃣ 建立心理安全感 — 容許試錯、鼓勵嘗試\n2️⃣ 釋放創新時間 — 參考 Google 20% 時間政策\n3️⃣ 設計創新激勵 — 將創新納入績效評估\n4️⃣ 跨域協作機制 — 打破部門藩籬\n\n📚 推薦閱讀：<a href=\"/knowledge/team-innovation-management\" class=\"text-primary font-medium hover:underline\">激發團隊創新動力的管理方法</a>",
  },
];

function getResponse(input: string): string {
  const lower = input.toLowerCase().trim();

  for (const qa of knowledgeBase) {
    for (const keyword of qa.keywords) {
      if (lower.includes(keyword) || keyword.includes(lower)) {
        return qa.response;
      }
    }
  }

  return `感謝您的提問！這是一個很好的議題。\n\n作為您的轉型小幫手，我目前可以協助您了解：\n\n• 🤖 AI 轉型策略與導入方法\n• 👥 人才發展與培訓體系\n• 🌱 ESG 永續發展實務\n• 💰 轉型預算規劃\n• 📊 AI 成熟度評估\n• 🏭 製造業 AI 應用\n\n📅 如需更深入的討論，歡迎<a href=\"/about#contact\" class=\"text-primary font-medium hover:underline\">預約 C.J. Kuo 老師的一對一諮詢</a>，\n或到<a href=\"/knowledge\" class=\"text-primary font-medium hover:underline\">知識庫</a>瀏覽更多專業文章！`;
}

function formatMessage(content: string) {
  return content
    .replace(/\n/g, "<br/>")
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-dark">$1</strong>');
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content:
          "您好！我是榕耀管顧的<strong>轉型小幫手</strong> 🤖✨\n\n我可以為您解答關於 AI 轉型、人才發展、ESG 永續的任何問題。\n\n也可以直接點擊下方熱門問題，或描述您的需求讓我來協助！",
      },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const reply = getResponse(text);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-hero text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <span className="tag bg-white/15 text-white mb-4">小幫手</span>
          <h1 className="heading-hero mt-4 mb-4">轉型小幫手</h1>
          <p className="text-body-lg text-white/85 max-w-2xl">
            有任何關於 AI 轉型、人才發展、ESG 永續的問題？
            讓我來為您解答。
          </p>
        </div>
      </section>

      {/* Chat Interface */}
      <section className="section bg-bg-alt flex-1">
        <div className="max-w-[800px] mx-auto">
          {/* Chat Card */}
          <div
            className="bg-white rounded-2xl border border-border shadow-lg overflow-hidden flex flex-col"
            style={{ height: "600px" }}
          >
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-white"
                        : "bg-bg-alt text-text-primary border border-border-light"
                    }`}
                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                  />
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-bg-alt border border-border-light rounded-2xl px-4 py-3">
                    <div className="flex gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length <= 1 && (
              <div className="px-4 sm:px-6 pb-3">
                <p className="text-xs text-text-secondary mb-2">熱門問題：</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t border-border p-3 sm:p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="輸入您的問題..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-bg-alt text-[15px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="btn-primary px-5 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  發送
                </button>
              </div>
            </form>
          </div>

          {/* Disclaimer */}
          <p className="text-center text-xs text-text-secondary mt-4">
            小幫手提供的資訊僅供參考，如需專業建議請
            <Link href="/about#contact" className="text-primary hover:underline">
              聯繫我們
            </Link>
            安排正式諮詢。
          </p>
        </div>
      </section>
    </>
  );
}
