import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  output: 'standalone',
  // Perf: don't reveal the framework in response headers (smaller headers,
  // no fingerprinting). Compression itself is always on at the Vercel edge.
  poweredByHeader: false,
};

export default nextConfig;
