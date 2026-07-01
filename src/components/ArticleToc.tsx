"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface ArticleTocProps {
  bodyRef?: React.RefObject<HTMLDivElement | null>;
}

export default function ArticleToc() {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [readProgress, setReadProgress] = useState(0);
  const [showToc, setShowToc] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);

  // 從文章內容提取 H2/H3 標題
  useEffect(() => {
    // 等待 DOM 渲染完成
    const timer = setTimeout(() => {
      const article = document.querySelector("article");
      if (!article) return;

      const headings = article.querySelectorAll("h2, h3");
      const items: TocItem[] = [];

      headings.forEach((heading, index) => {
        const id = `toc-${index}`;
        heading.id = id;
        items.push({
          id,
          text: heading.textContent || "",
          level: heading.tagName === "H3" ? 3 : 2,
        });
      });

      setTocItems(items);

      if (items.length >= 3) {
        setShowToc(true);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // 追蹤閱讀進度
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, Math.round((scrollTop / docHeight) * 100)) : 0;
      setReadProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 追蹤當前閱讀的標題
  useEffect(() => {
    if (tocItems.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    tocItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [tocItems]);

  const scrollToHeading = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  if (!showToc && readProgress === 0) return null;

  return (
    <>
      {/* 閱讀進度條（固定在頂部） */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-primary via-accent to-tertiary transition-all duration-150"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* 目錄（桌面版右側浮動） */}
      {showToc && (
        <div className="hidden xl:block fixed right-4 top-1/3 -translate-y-1/2 z-40">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-border p-4 shadow-lg max-w-[180px]">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border-light">
              <span className="text-sm font-semibold text-text-primary">📑 目錄</span>
              <span className="text-xs text-text-secondary ml-auto">{readProgress}%</span>
            </div>
            <nav className="space-y-1.5 max-h-[300px] overflow-y-auto">
              {tocItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToHeading(item.id)}
                  className={`block w-full text-left text-xs leading-tight py-1 transition-colors ${
                    item.level === 3 ? "pl-3" : ""
                  } ${
                    activeId === item.id
                      ? "text-primary font-medium"
                      : "text-text-secondary hover:text-primary"
                  }`}
                  title={item.text}
                >
                  {item.level === 2 ? "▸" : "·"} {item.text.length > 18 ? item.text.slice(0, 18) + "…" : item.text}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
