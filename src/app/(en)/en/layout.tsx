import type { Metadata } from "next";
import "@/app/globals.css";

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
  keywords: [
    "AI Transformation",
    "Talent Strategy",
    "ESG",
    "Business Consulting",
    "Management Consulting",
    "RongRise",
    "C.J. Kuo",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: `${SITE_URL}/en`,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${SITE_URL}/en`,
    languages: {
      "zh-TW": SITE_URL,
      "en": `${SITE_URL}/en`,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "RongRise Consulting",
  alternateName: "榕耀管顧",
  description:
    "Helping businesses from talent strategy to AI implementation. Driving sustainable growth through smart transformation.",
  url: `${SITE_URL}/en`,
  logo: `${SITE_URL}/images/cj-portrait-full.jpg`,
  founder: {
    "@type": "Person",
    name: "C.J. Kuo",
    jobTitle: "Founder / Business Transformation Consultant",
    url: `${SITE_URL}/en/about`,
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "info@rongrise.com",
    areaServed: "TW",
    availableLanguage: ["English", "Chinese"],
  },
  serviceType: [
    "AI Transformation Strategy",
    "Talent Development Strategy",
    "ESG Sustainability Consulting",
  ],
  sameAs: [
    "https://www.linkedin.com/in/c-j-kuo-5629b97b/",
    "https://www.facebook.com/cj.kuo1",
    "https://www.youtube.com/@RongRiseConsulting",
  ],
};


export default function EnLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
