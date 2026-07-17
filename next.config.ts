import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d2k9t6tbw9hja4.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
