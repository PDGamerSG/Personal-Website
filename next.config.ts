import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['gray-matter', 'reading-time'],
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
