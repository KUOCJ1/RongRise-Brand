import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Knowledge Base | AI Transformation, Talent Strategy, ESG | RongRise Consulting",
  description: "Practical insights on AI transformation, talent strategy, and ESG sustainability to help you navigate the transformation journey. By C.J. Kuo.",
  alternates: {
    canonical: "https://rongrise.com/en/knowledge",
    languages: {
      zh: "https://rongrise.com/knowledge",
    },
  },
};

export default function EnKnowledgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
