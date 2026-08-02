import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['gray-matter', 'reading-time'],
  /**
   * The OG image routes read `public/pfp.jpg` off disk at render time. Tracing
   * can't follow a `process.cwd()` join, so the file is pinned into the bundle
   * here — without it the avatar 500s in serverless output but works locally.
   */
  outputFileTracingIncludes: {
    '/opengraph-image': ['./public/pfp.jpg'],
    '/twitter-image': ['./public/pfp.jpg'],
  },
  async redirects() {
    return [
      { source: '/posts', destination: '/writing', permanent: true },
      { source: '/posts/:slug', destination: '/writing/:slug', permanent: true },
      { source: '/uses', destination: '/about', permanent: true },
      { source: '/now', destination: '/writing', permanent: true },
      { source: '/resume', destination: '/Pallab-Das-Resume.pdf', permanent: true },
      { source: '/cv', destination: '/Pallab-Das-Resume.pdf', permanent: true },
    ]
  },
};

export default nextConfig;
