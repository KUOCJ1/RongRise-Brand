"use client";

import { useEffect } from "react";

/**
 * Static export 下無法在 nested layout 覆寫 <html lang>，
 * 因此在 client 端把 root layout 寫死的 zh-TW 改回 en。
 */
export default function LangEn() {
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = "en";
    }
  }, []);
  return null;
}
