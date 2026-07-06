"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { callChatAPI, type ChatMessage } from "@/lib/chat-api";

/* ============================================
   浮動式 QuickChat — 漂浮小賀頭像
   所有頁面右下角固定，點開可對話
   ============================================ */

interface Message {
  role: "user" | "assistant";
  content: string;
}

// 引導式開場問題
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
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-text-primary">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
  return html;
}

export default function QuickChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatHistoryRef = useRef<{ role: string; content: string }[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // 自動滾到最新訊息
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // 展開後自動 focus input
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // 點擊面板外部關閉
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        const btn = document.getElementById("quickchat-fab");
        if (btn && btn.contains(e.target as Node)) return;
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isTyping) return;
      setMessages((prev) => [...prev, { role: "user", content: text }]);
      chatHistoryRef.current.push({ role: "user", content: text });
      setInput("");
      setIsTyping(true);

      try {
        const chatHistory: ChatMessage[] = chatHistoryRef.current.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }));
        const reply = await callChatAPI(chatHistory);
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
        chatHistoryRef.current.push({ role: "assistant", content: reply });
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "抱歉，我現在有點卡住，請稍後再試，或直接聯絡 CJ哥：" },
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
    if (!isOpen) setIsOpen(true);
    setIsExpanded(true);
    sendMessage(prompt);
  };

  const handleFabClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsExpanded(false);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* 漂浮頭像按鈕 */}
      <button
        id="quickchat-fab"
        onClick={handleFabClick}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 group"
        aria-label="問問小賀"
      >
        <div className="relative w-full h-full">
          <img
            src="https://i.imgur.com/Rs3O3Iv.jpeg"
            alt="小賀"
            width={56}
            height={56}
            className="w-full h-full rounded-full object-cover border-2 border-accent"
            style={{ borderColor: "#E8912A" }}
          />
          {/* 在線提示點 */}
          <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-white">
            <span className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-60" />
          </span>
        </div>
      </button>

      {/* 浮動對話面板 */}
      {isOpen && (
        <div
          ref={panelRef}
          className="fixed bottom-20 right-5 z-50 w-[360px] max-w-[calc(100vw-40px)] animate-fade-in-up"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-border overflow-hidden">
            {/* 未展開 — 引導卡片 */}
            {!isExpanded && (
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src="https://i.imgur.com/Rs3O3Iv.jpeg"
                    alt="小賀"
                    width={36}
                    height={36}
                    className="rounded-full border-2 border-accent flex-shrink-0"
                    style={{ borderColor: "#E8912A" }}
                  />
                  <div>
                    <p className="font-semibold text-text-primary text-sm">問問小賀 ✨</p>
                    <p className="text-text-secondary text-xs">AI 轉型、人才、ESG — 即時為你解答</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="ml-auto text-text-secondary hover:text-text-primary transition-colors"
                    aria-label="關閉"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {guidedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickQuestion(q.prompt)}
                      className="text-xs px-3 py-1.5 rounded-full bg-primary/5 text-primary font-medium hover:bg-primary/10 transition-colors border border-primary/10"
                    >
                      {q.emoji} {q.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setIsExpanded(true)}
                  className="text-xs text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"
                >
                  或輸入你的問題
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            {/* 已展開 — 對話介面 */}
            {isExpanded && (
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-gradient-hero">
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
                    onClick={() => { setIsOpen(false); setIsExpanded(false); setMessages([]); chatHistoryRef.current = []; }}
                    className="text-xs text-white/70 hover:text-white transition-colors"
                  >
                    ✕ 關閉
                  </button>
                </div>

                {/* Messages */}
                <div ref={messagesContainerRef} className="max-h-[320px] overflow-y-auto p-4 space-y-3 bg-white">
                  {messages.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-text-primary text-sm mb-3">👋 我是小賀，CJ哥的 AI 助手！</p>
                      <p className="text-text-secondary text-xs mb-4">點擊下方問題開始，或直接輸入你的需求</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {guidedQuestions.map((q, i) => (
                          <button
                            key={i}
                            onClick={() => handleQuickQuestion(q.prompt)}
                            className="text-xs px-3 py-1.5 rounded-full bg-primary/5 text-primary font-medium hover:bg-primary/10 transition-colors border border-primary/10"
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
                            : "bg-bg-alt text-text-primary border border-border"
                        }`}
                        style={msg.role === "user" ? { backgroundColor: "#E8912A" } : {}}
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
                      <div className="bg-bg-alt border border-border rounded-2xl px-3 py-2">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-text-secondary/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-text-secondary/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-text-secondary/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA */}
                {messages.length >= 4 && (
                  <div className="px-4 py-2 border-t border-border bg-bg-alt">
                    <p className="text-xs text-text-secondary mb-2">想更深入討論？</p>
                    <div className="flex gap-2">
                      <Link
                        href="/assistant"
                        className="text-xs px-3 py-1.5 rounded-full bg-accent text-white font-medium hover:bg-primary transition-all"
                        style={{ backgroundColor: "#E8912A" }}
                        onClick={() => { setIsOpen(false); setIsExpanded(false); }}
                      >
                        繼續跟小賀聊 →
                      </Link>
                      <Link
                        href="/about#contact"
                        className="text-xs px-3 py-1.5 rounded-full bg-primary/5 text-primary font-medium hover:bg-primary/10 transition-colors border border-primary/10"
                        onClick={() => { setIsOpen(false); setIsExpanded(false); }}
                      >
                        預約 CJ哥諮詢
                      </Link>
                    </div>
                  </div>
                )}

                {/* Input */}
                <form onSubmit={handleSubmit} className="border-t border-border p-3 bg-white">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="輸入你的問題..."
                      disabled={isTyping}
                      className="flex-1 px-3 py-2 rounded-xl border border-border bg-bg-alt text-text-primary text-sm placeholder-text-secondary/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isTyping}
                      className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: "#E8912A" }}
                    >
                      {isTyping ? "..." : "發送"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}