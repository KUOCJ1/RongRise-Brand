import type { Metadata } from "next";
import CaseNotesPageClient from "@/components/CaseNotesPageClient";
import { meta } from "@/lib/case-notes";

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: "https://rong-rise.com/case-notes" },
  openGraph: {
    type: "website",
    title: meta.title,
    description: meta.description,
    url: "https://rong-rise.com/case-notes",
    images: [{ url: "https://rong-rise.com/images/og-image-ai.jpg" }],
  },
};

export default function CaseNotesPage() {
  return <CaseNotesPageClient />;
}
