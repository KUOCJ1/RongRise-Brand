import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "內容監控 | 榕耀管顧",
  description: "榕耀管顧內容產出監控頁。",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MonitorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
