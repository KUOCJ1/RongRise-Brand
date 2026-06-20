import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Knowledge Base | AI Transformation & ESG | RongRise",
  description: "Practical insights on AI transformation, talent strategy, and ESG sustainability to help you navigate the transformation journey. By C.J. Kuo.",
  alternates: {
    canonical: "https://rongrise.com/en/knowledge",
    languages: {
      zh: "https://rongrise.com/knowledge",
    },
  },
  openGraph: {
    title: "Knowledge Base | AI Transformation, Talent Strategy, ESG — RongRise",
    description: "Practical insights on AI transformation, talent strategy, and ESG sustainability by C.J. Kuo.",
    images: [{ url: "https://rong-rise.com/images/og-image.jpg", width: 1200, height: 630, alt: "RongRise Consulting" }],
  },
};

export default function EnKnowledgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
