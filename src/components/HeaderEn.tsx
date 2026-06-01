"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/en", label: "Home" },
  { href: "/en/services", label: "Services" },
  { href: "/en/courses", label: "Courses" },
  { href: "/en/about", label: "About" },
  { href: "/en/knowledge", label: "Knowledge" },
  { href: "/en/downloads", label: "Downloads" },
  { href: "/en/news", label: "News" },
  { href: "/en/assistant", label: "Assistant" },
];

export default function HeaderEn() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/en" className="flex items-center gap-2 no-underline">
          <div className="w-9 h-9 rounded-lg bg-gradient-hero flex items-center justify-center">
            <span className="text-white font-bold text-lg">榕</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[15px] font-bold text-primary">RongRise</span>
            <span className="text-[10px] text-text-secondary tracking-wider">Consulting</span>
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
          {/* Language Switcher */}
          <div className="flex items-center gap-0.5 ml-2 pl-2 border-l border-border">
            <Link
              href="/"
              className="text-[11px] font-medium px-2 py-1 rounded text-text-secondary hover:text-primary hover:bg-primary/5 transition-colors"
            >
              中
            </Link>
            <Link
              href="/en"
              className="text-[11px] font-medium px-2 py-1 rounded text-primary bg-primary/5"
            >
              EN
            </Link>
          </div>
        </nav>

        {/* CTA + Language (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/"
            className="text-[13px] font-medium text-text-secondary hover:text-primary transition-colors"
          >
            中文
          </Link>
          <Link
            href="/en/about#contact"
            className="btn-primary text-sm py-2 px-5"
          >
            Book a Consultation
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-md hover:bg-surface-hover transition-colors"
          aria-label="Menu"
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
                className="text-[13px] font-medium px-3 py-1.5 rounded text-text-secondary hover:bg-surface-hover"
              >
                中文
              </Link>
              <Link
                href="/en"
                onClick={() => setMobileOpen(false)}
                className="text-[13px] font-medium px-3 py-1.5 rounded bg-primary/5 text-primary"
              >
                English
              </Link>
            </div>
            <Link
              href="/en/about#contact"
              onClick={() => setMobileOpen(false)}
              className="btn-primary text-sm text-center mt-2"
            >
              Book a Consultation
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
