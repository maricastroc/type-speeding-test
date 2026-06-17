import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ['page.tsx', 'api.ts', 'api.tsx'],
  devIndicators: false,
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
  },
};

export default nextConfig;
