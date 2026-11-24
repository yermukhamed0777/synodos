import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Static export so the site can be hosted directly from GitHub Pages.
  output: 'export',
  // GitHub Pages project sites are served from /<repo-name>/; without this,
  // every /_next/* asset URL 404s and the page renders unstyled.
  basePath: '/synodos',
  trailingSlash: true,
};

export default nextConfig;
