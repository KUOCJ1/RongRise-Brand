"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export const NAVY = "#0D2B4E";
export const GOLD = "#E8912A";
export const TEAL = "#2EC4B6";

export function useOps<T>() {
  const [data, setData] = useState<T | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    fetch("/ops-overview.json")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(setData)
      .catch(() => setErr(true));
  }, []);
  return { data, err };
}

export function Shell({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <main className="bg-[#FBF8F3]">
      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
        <div className="mb-6 flex items-center gap-3 text-xs text-[#6B655D]">
          <Link href="/ops" className="rounded-full border border-[#D9D2C6] px-3 py-1 transition hover:border-[#E8912A]">
            ← 營運總覽
          </Link>
          <span className="text-[#A9611A]">明細</span>
        </div>
        <h1 className="text-3xl font-bold text-[#0D2B4E] sm:text-4xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#4A4540]">{sub}</p>
        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}

export function Panel({ title, meta, children }: { title: string; meta?: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 rounded-2xl border border-[#E4DDD0] bg-white p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-[#0D2B4E]">{title}</h2>
        {meta && <span className="text-[11px] text-[#6B655D]">{meta}</span>}
      </div>
      {children}
    </section>
  );
}

export function Empty() {
  return <div className="py-16 text-center text-sm text-[#6B655D]">載入中…</div>;
}
