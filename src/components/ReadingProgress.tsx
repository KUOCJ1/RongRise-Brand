"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const handleScroll = () => {
      const articleRect = article.getBoundingClientRect();
      const articleTop = articleRect.top + window.scrollY;
      const articleHeight = articleRect.height;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;

      const p = Math.min(
        Math.max(0, (scrollY - articleTop + windowHeight * 0.5) / articleHeight),
        1
      );
      setProgress(p * 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-16 left-0 right-0 z-40 h-1 bg-bg-alt" aria-hidden="true">
      <div
        className="h-full bg-gradient-to-r from-tertiary to-accent transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
