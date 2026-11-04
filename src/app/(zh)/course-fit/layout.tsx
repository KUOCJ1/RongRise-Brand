import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 課程適配度自評｜六題判斷你該上初階還是進階班｜榕耀管顧",
  description:
    "六個問題、五分鐘，判斷你現階段適合 Agentic AI 初階班還是進階班，並產出課前預習清單。適合 HR 主管、部門主管與企業內訓承辦人。",
  alternates: {
    canonical: "https://rong-rise.com/course-fit",
  },
  openGraph: {
    title: "AI 課程適配度自評｜榕耀管顧",
    description: "六題判斷你該上初階還是進階班，附課前預習清單。",
    url: "https://rong-rise.com/course-fit",
    type: "website",
    images: [{ url: "https://rong-rise.com/images/og-image.jpg", width: 1200, height: 630, alt: "榕耀管顧 RongRise Consulting" }],
  },
};

export default function CourseFitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
