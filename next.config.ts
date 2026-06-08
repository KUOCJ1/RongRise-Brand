import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  // NOTE: NEXT_PUBLIC_ env vars are automatically injected by Next.js from process.env at build time.
  // Do NOT add them to the env block here — that does NOT work with static export.
};

export default nextConfig;
