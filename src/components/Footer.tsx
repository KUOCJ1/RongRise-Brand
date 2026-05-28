import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-bg-dark text-white mt-auto">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                <span className="text-white font-bold text-base">榕</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-bold">榕耀管顧</span>
                <span className="text-[10px] text-gray-400 tracking-wider">RongRise Consulting</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              協助企業從人才策略到 AI 落地，驅動永續成長。<br />
              智慧轉型，創新未來。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-gray-300">快速連結</h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "首頁" },
                { href: "/services", label: "服務項目" },
                { href: "/about", label: "關於我" },
                { href: "/knowledge", label: "知識庫" },
                { href: "/downloads", label: "下載區" },
                { href: "/assistant", label: "小幫手" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-white transition-colors no-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Focus Areas */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-gray-300">核心服務</h4>
            <div className="flex flex-wrap gap-2">
              {["AI 轉型", "人才策略", "ESG 永續", "智慧轉型", "創新顧問"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full bg-white/10 text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} 榕耀管顧 RongRise Consulting. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs">
            Designed with ❤️ by C.J. Kuo
          </p>
        </div>
      </div>
    </footer>
  );
}
