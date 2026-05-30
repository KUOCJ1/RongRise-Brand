"use client";

import { useEffect } from "react";
import { trackScrollDepth } from "@/lib/ga4-events";

/**
 * 首頁滾動深度追蹤元件
 * 使用 IntersectionObserver 追蹤 50% / 75% / 100% 滾動深度
 */
export default function ScrollTracker() {
  useEffect(() => {
    const thresholds = [50, 75, 100];
    const fired = new Set<number>();
    const observers: IntersectionObserver[] = [];
    const sentinels: HTMLDivElement[] = [];

    thresholds.forEach((threshold) => {
      const px = (threshold / 100) * document.documentElement.scrollHeight;
      const sentinel = document.createElement("div");
      sentinel.setAttribute("aria-hidden", "true");
      sentinel.style.cssText =
        "position:absolute;width:1px;height:1px;pointer-events:none;visibility:hidden;";
      sentinel.style.top = `${Math.min(px, document.documentElement.scrollHeight - 1)}px`;
      document.body.appendChild(sentinel);
      sentinels.push(sentinel);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !fired.has(threshold)) {
              fired.add(threshold);
              trackScrollDepth(threshold);
              observer.disconnect();
              sentinel.remove();
            }
          });
        },
        { threshold: 0 }
      );
      observer.observe(sentinel);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
      sentinels.forEach((s) => s.remove());
    };
  }, []);

  return null;
}
