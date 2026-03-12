import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.api-sports.io",
        pathname: "/football/**",
      },
      {
        protocol: "https",
        hostname: "api.sofascore.com",
        pathname: "/api/v1/**",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
      {
        protocol: "https",
        hostname: "a.espncdn.com",
        pathname: "/i/headshots/soccer/players/**",
      },
    ],
  },
};

export default nextConfig;
