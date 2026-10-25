import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "營運總覽",
  description: "內部營運台：內容產出、系統健康、排程事故、管理成本與成果。",
  robots: { index: false, follow: false },
};

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
