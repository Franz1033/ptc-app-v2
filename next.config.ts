import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: false,
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
