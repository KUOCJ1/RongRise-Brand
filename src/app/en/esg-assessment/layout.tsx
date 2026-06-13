import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ESG + AI Transformation Self-Assessment | Interactive Tool | RongRise Consulting",
  description: "25 quick questions to assess your organization's maturity in ESG sustainability and AI transformation, with personalized recommendations. Free online tool.",
  alternates: {
    canonical: "https://rongrise.com/en/esg-assessment",
    languages: {
      zh: "https://rongrise.com/esg-assessment",
    },
  },
  openGraph: {
    title: "ESG + AI Transformation Self-Assessment | Interactive Tool — RongRise",
    description: "25 quick questions to assess your organization's maturity in ESG sustainability and AI transformation.",
    images: [{ url: "https://rong-rise.com/images/og-image.jpg", width: 1200, height: 630, alt: "RongRise Consulting" }],
  },
};

export default function EnEsgAssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
