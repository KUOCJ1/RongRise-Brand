import Link from "next/link";

export default function FooterEn() {
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
                <span className="text-sm font-bold">RongRise</span>
                <span className="text-[10px] text-gray-400 tracking-wider">Consulting</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Helping businesses from talent strategy to AI implementation.
              Driving sustainable growth through smart transformation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-gray-300">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { href: "/en", label: "Home" },
                { href: "/en/services", label: "Services" },
                { href: "/en/courses", label: "Courses" },
                { href: "/en/about", label: "About" },
                { href: "/en/knowledge", label: "Knowledge" },
                { href: "/en/downloads", label: "Downloads" },
                { href: "/en/news", label: "News" },
                { href: "/en/assistant", label: "Assistant" },
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
            <h4 className="font-semibold text-sm mb-4 text-gray-300">Core Services</h4>
            <div className="flex flex-wrap gap-2">
              {["AI Transformation", "Talent Strategy", "ESG Sustainability", "Smart Transformation", "Innovation Consulting"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full bg-white/10 text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-6">
              <p className="text-gray-400 text-sm mb-2">🌐 Language</p>
              <div className="flex gap-2">
                <Link href="/" className="text-xs px-3 py-1 rounded-full bg-white/10 text-gray-300 hover:text-white transition-colors">
                  中文
                </Link>
                <Link href="/en" className="text-xs px-3 py-1 rounded-full bg-primary/20 text-tertiary">
                  English
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} RongRise Consulting. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs">
            Designed with ❤️ by C.J. Kuo
          </p>
        </div>
      </div>
    </footer>
  );
}
