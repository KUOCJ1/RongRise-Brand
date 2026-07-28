"use client";

import { useState, useCallback } from "react";

export default function ArticleActions({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const url = `https://rong-rise.com/knowledge/${slug}`;

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleShare = useCallback(async () => {
    // Web Share API (mobile) or clipboard fallback
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {}
    }
    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [slug, title, url]);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 print-hidden">
        {/* Print button */}
        <button
          onClick={handlePrint}
          className="w-12 h-12 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center"
          aria-label="列印 / 轉 PDF"
          title="列印 / 儲存為 PDF"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
        </button>

        {/* Share button */}
        <button
          onClick={handleShare}
          className="w-12 h-12 rounded-full bg-tertiary text-white shadow-lg hover:bg-tertiary/90 transition-all flex items-center justify-center"
          aria-label="分享連結"
          title="複製文章連結"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>
      </div>

      {/* Copied toast */}
      {copied && (
        <div className="fixed bottom-24 right-6 z-50 bg-text-primary text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-fade-in print-hidden">
          ✅ 連結已複製
        </div>
      )}
    </>
  );
}
