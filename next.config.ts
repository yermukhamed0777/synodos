import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Static export so the site can be hosted directly from GitHub Pages.
  output: 'export',
};

export default nextConfig;
