import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["gnzjxzsvdqmqvonlncpw.supabase.co"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
