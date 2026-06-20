import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Transformation Self-Assessment | RongRise Consulting",
  description: "Take a 3-minute AI transformation maturity assessment and get personalized recommendations. Free online tool for business leaders.",
  alternates: {
    canonical: "https://rongrise.com/ai-assessment",
    languages: {
      zh: "https://rongrise.com/ai-assessment",
    },
  },
  openGraph: {
    title: "AI Transformation Self-Assessment — RongRise Consulting",
    description: "Take a 3-minute AI transformation maturity assessment and get personalized recommendations.",
    images: [{ url: "https://rong-rise.com/images/og-image.jpg", width: 1200, height: 630, alt: "RongRise Consulting" }],
  },
};

export default function AiAssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
