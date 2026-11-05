"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Brain,
  ExternalLink,
  Globe,
  LayoutDashboard,
  LineChart,
  Mail,
  Search,
  Smartphone,
  Youtube,
} from "lucide-react";

const NAV = [
  { href: "/", label: "儀表板", icon: LayoutDashboard },
  { href: "/analytics", label: "健康分析", icon: LineChart },
  { href: "/brain", label: "第二大腦", icon: Brain },
  { href: "/newsletter", label: "電子報", icon: Mail },
  { href: "/website", label: "官網服務", icon: Globe },
  { href: "/youtube", label: "YouTube", icon: Youtube },
  { href: "/search", label: "跨來源搜尋", icon: Search },
];

const EXTERNAL = [
  { href: "https://rong-rise.com/ops", label: "營運總覽 /ops", icon: Activity },
  { href: "https://launch.rong-rise.com", label: "行動工作台", icon: Smartphone },
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
          <Link key={href} href={href} className={pathname === href ? "nav-link active" : "nav-link"}>
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
        <div className="nav-sep" />
        {EXTERNAL.map(({ href, label, icon: Icon }) => (
          <a key={href} href={href} target="_blank" rel="noreferrer" className="nav-link">
            <Icon size={18} />
            <span>{label}</span>
            <ExternalLink size={12} className="nav-ext" />
          </a>
        ))}
      </nav>
      <div className="sidebar-foot">RongRise Internal · 內部使用</div>
    </aside>
  );
}
