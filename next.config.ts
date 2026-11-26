import type { NextConfig } from 'next';

// GitHub Pages project sites are served from /<repo-name>/; a root-path build
// is also supported for custom domains by setting NEXT_PUBLIC_BASE_PATH empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/synodos';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Static export so the site can be hosted directly from GitHub Pages.
  output: 'export',
  basePath,
  trailingSlash: true,
};

export default nextConfig;
