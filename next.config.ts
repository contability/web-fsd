import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https" as const,
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
