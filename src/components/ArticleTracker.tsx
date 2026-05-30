"use client";

import { useEffect } from "react";
import { trackKnowledgeRead, trackCTALabel } from "@/lib/ga4-events";

interface ArticleTrackerProps {
  slug: string;
  title: string;
  category: string;
}

export default function ArticleTracker({
  slug,
  title,
  category,
}: ArticleTrackerProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      trackKnowledgeRead(slug, title, category);
    }, 30000);

    return () => clearTimeout(timer);
  }, [slug, title, category]);

  return null;
}

export function trackArticleCTA(label: string, location: string) {
  trackCTALabel(label, location);
}
