"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/", label: "首頁" },
  { href: "/services", label: "服務項目" },
  { href: "/courses", label: "課程" },
  { href: "/about", label: "關於我們" },
  { href: "/knowledge", label: "知識庫" },
  { href: "/roi-calculator", label: "ROI 估算" },
  { href: "/amoeba-scan", label: "任務盤點" },
  { href: "/trend-radar", label: "趨勢雷達" },
  { href: "/newsletter", label: "電子報" },
  { href: "/news", label: "最新消息" },
  { href: "/downloads", label: "下載區" },
  { href: "/assistant", label: "小幫手" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline" aria-label="榕耀管顧首頁">
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
        <nav className="hidden md:flex items-center gap-2">
          {navItems.slice(0, 10).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link text-[14px] px-2 py-2 relative after:absolute after:bottom-0 after:left-2 after:right-2 after:h-[2px] after:bg-primary after:scale-x-0 after:origin-left after:transition-transform hover:after:scale-x-100"
            >
              {item.label}
            </Link>
          ))}
          {/* Language Switcher */}
          <div className="flex items-center gap-0.5 ml-2 pl-2 border-l border-border">
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

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-surface-hover transition-colors"
          aria-label="選單"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* CTA - Desktop only */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/about/#contact" className="btn-primary text-sm py-2 px-5">
            預約諮詢
          </Link>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div id="mobile-nav" className="md:hidden border-t border-border bg-surface">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="mobile-nav-link block px-3 py-2 rounded-lg text-sm"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 px-3 pt-3 mt-3 border-t border-border">
              <Link href="/" className="text-xs px-2 py-1 rounded text-primary bg-primary/5">中</Link>
              <Link href="/en" className="text-xs px-2 py-1 rounded text-text-secondary hover:text-primary">EN</Link>
            </div>
            <div className="px-3 pt-3">
              <Link href="/about/#contact" className="btn-primary text-sm block text-center py-2.5" onClick={() => setMobileOpen(false)}>
                預約諮詢
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
