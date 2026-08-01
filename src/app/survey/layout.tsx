import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 轉型問卷 | 榕耀管顧",
  description: "榕耀管顧 AI 轉型評估問卷。",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SurveyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
