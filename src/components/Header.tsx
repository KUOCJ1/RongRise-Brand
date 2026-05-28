"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/", label: "首頁" },
  { href: "/about", label: "關於我" },
  { href: "/knowledge", label: "知識庫" },
  { href: "/downloads", label: "下載區" },
  { href: "/assistant", label: "小幫手" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div className="w-9 h-9 rounded-lg bg-gradient-hero flex items-center justify-center">
            <span className="text-white font-bold text-lg">榕</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[15px] font-bold text-primary">榕耀管顧</span>
            <span className="text-[10px] text-text-secondary tracking-wider">RongRise Consulting</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link text-[14px] px-3 py-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA Button (Desktop) */}
        <Link
          href="/about#contact"
          className="hidden md:inline-flex btn-primary text-sm py-2 px-5"
        >
          預約諮詢
        </Link>

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
