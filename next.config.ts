import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },

  async redirects() {
    return [
      {
        source: "/team",
        destination: "/about/#team",
        permanent: true,
      },
      {
        source: "/about/xiaoha",
        destination: "/about/#xiaoha",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
