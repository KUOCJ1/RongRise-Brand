"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Brain, Globe, Youtube, Mail, Search, LineChart } from "lucide-react";

const NAV = [
  { href: "/", label: "儀表板", icon: LayoutDashboard },
  { href: "/brain", label: "第二大腦", icon: Brain },
  { href: "/website", label: "官網服務", icon: Globe },
  { href: "/youtube", label: "YouTube", icon: Youtube },
  { href: "/newsletter", label: "電子報", icon: Mail },
  { href: "/search", label: "跨來源搜尋", icon: Search },
  { href: "/analytics", label: "健康分析", icon: LineChart },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-dot" />
        榕耀 Admin
      </div>
      <nav>
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={pathname === href ? "nav-link active" : "nav-link"}
          >
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      <div className="sidebar-foot">RongRise Internal</div>
    </aside>
  );
}
