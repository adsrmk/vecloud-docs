import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'standalone',
  poweredByHeader: false,
  devIndicators: false,
  outputFileTracingRoot: import.meta.dirname,
  turbopack: { root: import.meta.dirname },
  async redirects() {
    return [
      { source: '/', destination: '/nl/docs', permanent: false },
      {
        source: '/docs/:path*',
        destination: '/nl/docs/:path*',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/:lang(nl|en|es|fr|de)/docs/:path*.md',
        destination: '/llms.mdx/:lang/docs/:path*.md',
      },
      {
        source: '/:lang(nl|en|es|fr|de)/docs/:path*.txt',
        destination: '/llms.mdx/:lang/docs/:path*.txt',
      },
    ];
  },
};

export default withMDX(config);
