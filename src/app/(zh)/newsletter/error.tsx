"use client";

import Link from "next/link";

/* ============================================
   電子報典藏頁錯誤邊界（防護網）
   檢索索引載入或渲染若意外失敗，仍要讓訪客能瀏覽期數，
   不可出現整頁空白。任何單一前端錯誤都在此被接住。
   ============================================ */

export default function NewsletterArchiveError({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="section">
      <div className="section-inner">
        <div className="max-w-2xl mx-auto text-center bg-gradient-subtle rounded-2xl p-10">
          <div className="text-3xl mb-3">🦞</div>
          <h1 className="heading-section text-text-primary mb-3">典藏庫暫時無法載入</h1>
          <p className="text-body text-text-secondary mb-6">
            電子報典藏頁剛剛遇到一點狀況。你可以重新載入頁面，或直接訂閱最新一期。
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button type="button" onClick={() => reset()} className="btn-primary">
              重新載入
            </button>
            <Link href="/#newsletter" className="btn-secondary">
              📬 訂閱電子報
            </Link>
            <Link href="/" className="btn-secondary">
              返回首頁
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
