"use client";

import { trackCTALabel } from "@/lib/ga4-events";
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
  return (
    <Link
      href={href}
      className={className}
      target={target}
      rel={rel}
      onClick={() => trackCTALabel(trackLabel, trackLocation)}
    >
      {children}
    </Link>
  );
}
