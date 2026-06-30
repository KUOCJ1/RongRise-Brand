import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="heading-section text-dark mb-4">找不到頁面</h1>
        <p className="text-text-secondary text-body-lg mb-8">
          您要找的頁面可能已被移除、暫時不存在，或網址有誤。
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn-primary">
            返回首頁
          </Link>
          <Link href="/knowledge" className="btn-secondary">
            瀏覽知識庫
          </Link>
        </div>
      </div>
    </section>
  );
}
