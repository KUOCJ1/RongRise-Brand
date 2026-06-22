"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { callChatAPI, type ChatMessage } from "@/lib/chat-api";

/* ============================================
   首頁快速問小賀 — QuickChat 元件
   ============================================ */

interface Message {
  role: "user" | "assistant";
  content: string;
}

// 引導式開場問題 — 依照 CJ 哥服務場景設計
const guidedQuestions = [
  { emoji: "🤖", label: "AI 轉型該從哪開始？", prompt: "我們的產品主要是 B2B 製造業，員工約 50 人，目前完全沒有 AI 應用，我該從哪裡開始？" },
  { emoji: "👥", label: "人才培訓怎麼做？", prompt: "我們公司想要建立人才培訓體系，但不知道怎麼開始，有什麼建議？" },
  { emoji: "🌱", label: "ESG 對我們有什麼好處？", prompt: "我們是中小型製造業，客戶開始要求 ESG 報告，這對我們有什麼具體好處？該怎麼開始？" },
  { emoji: "💰", label: "轉型需要多少預算？", prompt: "我們公司規模不大，想開始 AI 轉型，大概需要準備多少預算？有什麼低成本的方案嗎？" },
];

function formatMessage(content: string): string {
  let html = content
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary font-medium hover:underline" target="_blank" rel="noopener">$1</a>')
    .replace(/\n/g, "<br/>")
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-dark">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
  return html;
}

export default function QuickChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const chatHistoryRef = useRef<ChatMessage[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

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

      const userMsg: Message = { role: "user", content: text };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      chatHistoryRef.current.push({ role: "user", content: text });

      try {
        const reply = await callChatAPI(chatHistoryRef.current);
        chatHistoryRef.current.push({ role: "assistant", content: reply });
        if (chatHistoryRef.current.length > 10) {
          chatHistoryRef.current = chatHistoryRef.current.slice(-10);
        }
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "抱歉，目前 AI 服務暫時無法連線，請稍後再試。或直接 <a href=\"/about#contact\" class=\"text-primary font-medium hover:underline\">預約 CJ哥的一對一諮詢</a>！" },
        ]);
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

  const handleQuickQuestion = (prompt: string) => {
    if (!isExpanded) setIsExpanded(true);
    sendMessage(prompt);
  };

  // 未展開 — 顯示精簡引導卡片
  if (!isExpanded) {
    return (
      <div className="mt-10 animate-fade-in-up animation-delay-500">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-5 max-w-xl">
          <div className="flex items-center gap-3 mb-3">
            <img
              src="https://i.imgur.com/Rs3O3Iv.jpeg"
              alt="小賀"
              width={36}
              height={36}
              className="rounded-full border-2 border-accent"
              style={{ borderColor: "#E8912A" }}
            />
            <div>
              <p className="text-white font-semibold text-sm">問問小賀 ✨</p>
              <p className="text-white/60 text-xs">AI 轉型、人才、ESG — 即時為你解答</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {guidedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleQuickQuestion(q.prompt)}
                className="text-xs px-3 py-1.5 rounded-full bg-white/10 text-white/90 font-medium hover:bg-white/20 transition-colors border border-white/10 hover:border-white/30"
              >
                {q.emoji} {q.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsExpanded(true)}
            className="text-xs text-white/50 hover:text-white/80 transition-colors flex items-center gap-1"
          >
            或輸入你的問題
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    );
  }

  // 已展開 — 顯示對話介面
  return (
    <div className="mt-10 animate-fade-in-up">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 max-w-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2">
            <img
              src="https://i.imgur.com/Rs3O3Iv.jpeg"
              alt="小賀"
              width={28}
              height={28}
              className="rounded-full border-2 border-accent"
              style={{ borderColor: "#E8912A" }}
            />
            <span className="text-sm font-medium text-white">AI 長小賀</span>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </div>
          <button
            onClick={() => { setIsExpanded(false); setMessages([]); chatHistoryRef.current = []; }}
            className="text-xs text-white/50 hover:text-white/80 transition-colors"
          >
            ✕ 收合
          </button>
        </div>

        {/* Messages */}
        <div ref={messagesContainerRef} className="max-h-[300px] overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-4">
              <p className="text-white/70 text-sm mb-3">👋 我是小賀，CJ哥的 AI 助手！</p>
              <p className="text-white/50 text-xs mb-4">點擊下方問題開始，或直接輸入你的需求</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {guidedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickQuestion(q.prompt)}
                    className="text-xs px-3 py-1.5 rounded-full bg-white/10 text-white/90 font-medium hover:bg-white/20 transition-colors border border-white/10"
                  >
                    {q.emoji} {q.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <img
                  src="https://i.imgur.com/Rs3O3Iv.jpeg"
                  alt="小賀"
                  width={24}
                  height={24}
                  className="rounded-full flex-shrink-0 mr-2 mt-1"
                />
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-accent text-white"
                    : "bg-white/15 text-white/90 border border-white/10"
                }`}
                dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
              />
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <img
                src="https://i.imgur.com/Rs3O3Iv.jpeg"
                alt="小賀"
                width={24}
                height={24}
                className="rounded-full flex-shrink-0 mr-2 mt-1"
              />
              <div className="bg-white/15 border border-white/10 rounded-2xl px-3 py-2">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CTA — 對話超過 2 輪後顯示 */}
        {messages.length >= 4 && (
          <div className="px-4 py-2 border-t border-white/10 bg-white/5">
            <p className="text-xs text-white/50 mb-2">想更深入討論？</p>
            <div className="flex gap-2">
              <Link
                href="/assistant"
                className="text-xs px-3 py-1.5 rounded-full bg-accent text-white font-medium hover:bg-white hover:text-primary transition-all"
              >
                繼續跟小賀聊 →
              </Link>
              <Link
                href="/about#contact"
                className="text-xs px-3 py-1.5 rounded-full bg-white/10 text-white/80 font-medium hover:bg-white/20 transition-colors border border-white/10"
              >
                預約 CJ哥諮詢
              </Link>
            </div>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t border-white/10 p-3">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="輸入你的問題..."
              disabled={isTyping}
              className="flex-1 px-3 py-2 rounded-xl border border-white/20 bg-white/10 text-white text-sm placeholder-white/40 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-white hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTyping ? "..." : "發送"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
