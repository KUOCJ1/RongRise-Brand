import type { Metadata } from "next";
import "@/app/globals.css";
import HeaderEn from "@/components/HeaderEn";
import FooterEn from "@/components/FooterEn";
import LangEn from "@/components/LangEn";

const SITE_URL = "https://rong-rise.com";
const SITE_NAME = "RongRise Consulting";
const SITE_DESCRIPTION =
  "Helping businesses drive sustainable growth. AI Transformation, Talent Strategy, ESG Sustainability. Founded by C.J. Kuo.";
const OG_IMAGE = `${SITE_URL}/images/og-image-ai.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — AI Transformation × Talent Strategy × ESG Sustainability`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/en`,
    languages: {
      zh: SITE_URL,
      en: `${SITE_URL}/en`,
    },
  },
  openGraph: {
    title: `${SITE_NAME} — AI Transformation × Talent Strategy × ESG Sustainability`,
    description: SITE_DESCRIPTION,
    url: `${SITE_URL}/en`,
    siteName: SITE_NAME,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
    locale: "en_US",
    type: "website",
  },
};

export default function EnLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div lang="en" className="min-h-full flex flex-col">
      <LangEn />
      <HeaderEn />
      <main className="flex-1">{children}</main>
      <FooterEn />
    </div>
  );
}
