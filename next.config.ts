import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d1a5t62t7naa0p.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
