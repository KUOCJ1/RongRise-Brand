"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { callChatAPI, type ChatMessage } from "@/lib/chat-api";
import { trackAssistantSend, trackAssistantQuickQuestion } from "@/lib/ga4-events";

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
  let html = content
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-primary font-medium hover:underline" target="_blank" rel="noopener">$1</a>'
    )
    .replace(/\n/g, "<br/>")
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-dark">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^###\s+(.+)$/gm, '<h4 class="font-semibold text-dark mt-2 mb-1">$1</h4>')
    .replace(/^##\s+(.+)$/gm, '<h3 class="font-semibold text-dark mt-3 mb-2">$1</h3>');

  return html;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");
  const [isRestored, setIsRestored] = useState(false);
  const chatHistoryRef = useRef<ChatMessage[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // 從 localStorage 載入歷史對話
  useEffect(() => {
    try {
      const saved = localStorage.getItem("assistant_history");
      if (saved) {
        const parsed = JSON.parse(saved) as Message[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          chatHistoryRef.current = parsed
            .filter((m) => m.role === "assistant" || m.role === "user")
            .map((m) => ({ role: m.role, content: m.content }));
        } else {
          throw new Error("empty");
        }
      } else {
        throw new Error("no saved");
      }
    } catch {
      const welcomeMsg: Message = {
        role: "assistant",
        content:
          "您好！我是榕耀管顧的<strong>AI 長小賀</strong> 🤖✨\n\n我可以為您解答關於 AI 轉型、人才發展、ESG 永續的任何問題。\n\n也可以直接點擊下方熱門問題，或描述您的需求讓我來協助！",
      };
      setMessages([welcomeMsg]);
    }
    setIsRestored(true);
  }, []);

  // 對話更新時儲存到 localStorage
  useEffect(() => {
    if (isRestored && messages.length > 0) {
      localStorage.setItem("assistant_history", JSON.stringify(messages));
      chatHistoryRef.current = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role, content: m.content }));
    }
  }, [messages, isRestored]);

  // 清除對話
  const clearChat = useCallback(() => {
    localStorage.removeItem("assistant_history");
    const welcomeMsg: Message = {
      role: "assistant",
      content: "對話已清除！有什麼我可以幫您的嗎？😊",
    };
    setMessages([welcomeMsg]);
    chatHistoryRef.current = [];
  }, []);

  // 新訊息時只在容器內滾動到底部，不影響外層頁面
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
      });
    }
  }, [messages, isTyping]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isTyping) return;

      trackAssistantSend(text.length);

      const userMsg: Message = { role: "user", content: text };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);
      setError("");

      chatHistoryRef.current.push({ role: "user", content: text });

      try {
        const reply = await callChatAPI(chatHistoryRef.current);
        chatHistoryRef.current.push({ role: "assistant", content: reply });

        if (chatHistoryRef.current.length > 20) {
          chatHistoryRef.current = chatHistoryRef.current.slice(-20);
        }

        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      } catch (err) {
        console.error("Chat error:", err);
        setError("抱歉，目前無法連線到 AI 服務，請稍後再試。");
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
      <h1 className="sr-only">AI 長小賀 — 問答助手</h1>
      <section className="min-h-[calc(100vh-64px)] bg-bg-alt flex flex-col">
      <div className="max-w-[800px] w-full mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col min-h-0">
        {/* Chat Card — 固定高度，內部滾動 */}
        <div
          className="bg-white rounded-2xl border border-border shadow-lg overflow-hidden flex flex-col flex-1 min-h-0"
          style={{ maxHeight: "calc(100vh - 160px)" }}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-light bg-bg-alt flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-medium text-dark">AI 長小賀</span>
              <span className="text-xs text-text-secondary">● 記憶已啟用</span>
            </div>
            <button
              onClick={clearChat}
              className="text-xs text-text-secondary hover:text-red-500 transition-colors px-2 py-1 rounded hover:bg-red-50"
              title="清除對話歷史"
            >
              🗑️ 清除對話
            </button>
          </div>

          {/* Messages — 可滾動區域 */}
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 min-h-0">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
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
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="px-4 sm:px-6 pb-3 flex-shrink-0">
              <p className="text-xs text-text-secondary mb-2">熱門問題：</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => { trackAssistantQuickQuestion(q); sendMessage(q); }}
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
            className="border-t border-border p-3 sm:p-4 flex-shrink-0"
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
        <p className="text-center text-xs text-text-secondary mt-4 flex-shrink-0">
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
