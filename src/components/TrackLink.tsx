"use client";

import { trackCTALabel } from "@/lib/ga4-events";
import Link from "next/link";

interface TrackLinkProps {
  href: string;
  className?: string;
  trackLabel: string;
  trackLocation: string;
  children: React.ReactNode;
}

export default function TrackLink({ href, className, trackLabel, trackLocation, children }: TrackLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackCTALabel(trackLabel, trackLocation)}
    >
      {children}
    </Link>
  );
}
