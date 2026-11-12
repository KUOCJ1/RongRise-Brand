"use client";

import { useEffect, useState } from "react";
import { trackCTALabel } from "@/lib/ga4-events";
import { appendUtmToUrl } from "@/lib/utm";
import Link from "next/link";

interface TrackLinkProps {
  href: string;
  className?: string;
  trackLabel: string;
  trackLocation: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
}

export default function TrackLink({ href, className, trackLabel, trackLocation, target, rel, children }: TrackLinkProps) {
  const shouldAppend = href.startsWith("http") || href.includes("n8n.rong-rise.com");
  const [finalHref, setFinalHref] = useState(href);

  useEffect(() => {
    if (shouldAppend) setFinalHref(appendUtmToUrl(href));
  }, [href, shouldAppend]);

  return (
    <Link
      href={finalHref}
      className={className}
      target={target}
      rel={rel}
      onClick={() => trackCTALabel(trackLabel, trackLocation)}
    >
      {children}
    </Link>
  );
}
