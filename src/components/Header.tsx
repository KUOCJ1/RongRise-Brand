"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/", label: "首頁" },
  { href: "/services", label: "服務項目" },
  { href: "/courses", label: "課程" },
  { href: "/about", label: "關於我們" },
  { href: "/knowledge", label: "知識庫" },
  { href: "/newsletter", label: "電子報" },
  { href: "/news", label: "最新消息" },
  { href: "/downloads", label: "下載區" },
  { href: "/assistant", label: "小幫手" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <img
            src="/images/logo.svg"
            alt="榕耀管顧 RongRise Consulting"
            width={36}
            height={36}
            className="flex-shrink-0"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-[15px] font-bold text-primary">榕耀管顧</span>
            <span className="text-[10px] text-text-secondary tracking-wider">RongRise Consulting</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link text-[15px] px-3 py-2 relative after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:bg-primary after:scale-x-0 after:origin-left after:transition-transform hover:after:scale-x-100"
            >
              {item.label}
            </Link>
          ))}
          {/* Language Switcher */}
          <div className="flex items-center gap-0.5 ml-3 pl-3 border-l border-border">
            <Link
              href="/"
              className="text-[12px] font-medium px-2 py-1 rounded text-primary bg-primary/5"
            >
              中
            </Link>
            <Link
              href="/en"
              className="text-[12px] font-medium px-2 py-1 rounded text-text-secondary hover:text-primary hover:bg-primary/5 transition-colors"
            >
              EN
            </Link>
          </div>
        </nav>

        {/* CTA + Language (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/newsletter"
            className="text-[14px] font-medium text-text-secondary hover:text-primary transition-colors"
          >
            📬 訂閱電子報
          </Link>
          <Link
            href="/en"
            className="text-[14px] font-medium text-text-secondary hover:text-primary transition-colors hidden lg:inline"
          >
            English
          </Link>
          <Link
            href="/about#contact"
            className="btn-primary text-sm py-2 px-5"
          >
            預約諮詢
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-md hover:bg-surface-hover transition-colors"
          aria-label="選單"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-[15px] font-medium py-2.5 px-3 rounded-md hover:bg-surface-hover text-text-primary no-underline transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {/* Mobile Language Switcher */}
            <div className="flex items-center gap-2 pt-2 mt-2 border-t border-border">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="text-[13px] font-medium px-3 py-1.5 rounded bg-primary/5 text-primary"
              >
                中文
              </Link>
              <Link
                href="/en"
                onClick={() => setMobileOpen(false)}
                className="text-[13px] font-medium px-3 py-1.5 rounded text-text-secondary hover:bg-surface-hover"
              >
                English
              </Link>
            </div>
            <Link
              href="/about#contact"
              onClick={() => setMobileOpen(false)}
              className="btn-primary text-sm text-center mt-2"
            >
              預約諮詢
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
