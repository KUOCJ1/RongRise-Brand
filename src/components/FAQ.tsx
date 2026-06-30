"use client";

import { useState } from "react";
import faq from "@/data/faq.json";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggle = (key: string) => {
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <section className="section bg-white">
      <div className="section-inner">
        <div className="text-center mb-12">
          <span className="tag mb-4">常見問題</span>
          <h2 className="heading-section text-dark mt-4">您可能想知道的</h2>
          <div className="brand-divider brand-divider-center mt-4" />
          <p className="text-text-secondary text-body-lg mt-4 max-w-xl mx-auto">
            整理了最常被問到的問題。如果這裡沒有您的答案，隨時問問小幫手。
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          {faq.faq.map((cat) => (
            <div key={cat.category}>
              <h3 className="font-semibold text-dark text-sm mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {cat.category}
              </h3>
              <div className="space-y-3">
                {cat.items.map((item, i) => {
                  const key = `${cat.category}-${i}`;
                  const isOpen = openIndex === key;
                  return (
                    <div
                      key={key}
                      className="border border-border-light rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggle(key)}
                        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface-hover transition-colors"
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${key}`}
                        id={`faq-btn-${key}`}
                      >
                        <span className={`font-medium text-[15px] transition-colors ${isOpen ? 'text-primary' : 'text-dark'}`}>
                          {item.q}
                        </span>
                        <svg
                          className={`w-5 h-5 flex-shrink-0 transition-transform text-text-secondary ${isOpen ? 'rotate-180 text-primary' : ''}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                      {isOpen && (
                        <div
                          id={`faq-panel-${key}`}
                          role="region"
                          aria-labelledby={`faq-btn-${key}`}
                          className="px-5 pb-4 pt-0"
                        >
                          <p className="text-text-secondary text-body leading-relaxed">
                            {item.a}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
