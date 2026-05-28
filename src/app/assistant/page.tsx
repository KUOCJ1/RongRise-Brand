"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { callChatAPI, type ChatMessage } from "@/lib/chat-api";

/* ============================================
   小幫手 Assistant Page — LLM 升級版
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
  "有哪些政府補助可以申請？",
  "AI 工具怎麼選？",
];

function formatMessage(content: string): string {
  // 處理 Markdown 格式的連結 [text](url) → <a href="url">text</a>
  let html = content
    // 處理 Markdown 連結
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-primary font-medium hover:underline" target="_blank" rel="noopener">$1</a>'
    )
    // 處理換行
    .replace(/\n/g, "<br/>")
    // 處理 Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-dark">$1</strong>')
    // 處理 Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // 處理標題
    .replace(/^###\s+(.+)$/gm, '<h4 class="font-semibold text-dark mt-2 mb-1">$1</h4>')
    .replace(/^##\s+(.+)$/gm, '<h3 class="font-semibold text-dark mt-3 mb-2">$1</h3>');

  return html;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatHistoryRef = useRef<ChatMessage[]>([]);

  useEffect(() => {
    const welcomeMsg: Message = {
      role: "assistant",
      content:
        "您好！我是榕耀管顧的<strong>轉型小幫手</strong> 🤖✨\n\n我可以為您解答關於 AI 轉型、人才發展、ESG 永續的任何問題。\n\n也可以直接點擊下方熱門問題，或描述您的需求讓我來協助！",
    };
    setMessages([welcomeMsg]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isTyping) return;

      const userMsg: Message = { role: "user", content: text };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);
      setError("");

      // 更新 chat history（給 API 的上下文）
      chatHistoryRef.current.push({ role: "user", content: text });

      try {
        // 呼叫 OpenRouter API
        const reply = await callChatAPI(chatHistoryRef.current);

        // 更新 chat history
        chatHistoryRef.current.push({ role: "assistant", content: reply });

        // 只保留最近 10 輪對話（避免 token 過長）
        if (chatHistoryRef.current.length > 20) {
          chatHistoryRef.current = chatHistoryRef.current.slice(-20);
        }

        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      } catch (err) {
        console.error("Chat error:", err);
        setError("抱歉，目前無法連線到 AI 服務，請稍後再試。");
        // 移除失敗的 user message from history
        chatHistoryRef.current.pop();
      } finally {
        setIsTyping(false);
      }
    },
    [isTyping]
  );

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
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* Avatar */}
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                      <span className="text-white text-xs font-bold">AI</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-white"
                        : "bg-bg-alt text-text-primary border border-border-light"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: formatMessage(msg.content),
                    }}
                  />
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 ml-2 mt-1">
                      <span className="text-gray-500 text-xs">您</span>
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
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

              {error && (
                <div className="flex justify-center">
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-red-600 text-sm">
                    {error}
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
                      disabled={isTyping}
                      className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-border p-3 sm:p-4"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="輸入您的問題..."
                  disabled={isTyping}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-bg-alt text-[15px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="btn-primary px-5 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTyping ? "..." : "發送"}
                </button>
              </div>
            </form>
          </div>

          {/* Disclaimer */}
          <p className="text-center text-xs text-text-secondary mt-4">
            小幫手由 AI 驅動，提供的資訊僅供參考，如需專業建議請
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
