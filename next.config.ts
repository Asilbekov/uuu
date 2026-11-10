import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production builds must fail on type errors instead of shipping them.
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  output: "standalone",
  compress: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts", "date-fns"],
    // Keep CI / small Vercel builders deterministic: extra workers can exceed
    // a 2 GiB memory limit even though the source compiles correctly.
    webpackBuildWorker: false,
    cpus: 1,
  },
  // Perf: don't reveal the framework in response headers (smaller headers,
  // no fingerprinting). Compression itself is always on at the Vercel edge.
  poweredByHeader: false,
  // Baseline hardening headers on every route (HSTS is added by the Vercel
  // edge automatically; CSP needs a nonce rollout and is deliberately not
  // switched on blind).
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
