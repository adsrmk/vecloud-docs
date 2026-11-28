import { createMDX } from 'fumadocs-mdx/next';
import { fileURLToPath } from 'node:url';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'standalone',
  poweredByHeader: false,
  devIndicators: false,
  adapterPath: fileURLToPath(new URL('./next-adapter.mjs', import.meta.url)),
  images: {
    qualities: [75, 92],
    localPatterns: [
      { pathname: '/**', search: '' },
      { pathname: '/screenshots/**', search: '?v=20261127-1' },
      { pathname: '/screenshots/**', search: '?v=20261127-2' },
    ],
  },
  outputFileTracingRoot: import.meta.dirname,
  turbopack: { root: import.meta.dirname },
  async headers() {
    return [{
      source: '/:lang(nl|es|fr|de)?/docs/:path*',
      headers: [{ key: 'Vary', value: 'Accept' }],
    }];
  },
  async redirects() {
    return [
      { source: '/', destination: '/docs', permanent: false },
      { source: '/en', destination: '/docs', permanent: true },
      { source: '/en/docs.md', destination: '/docs.md', permanent: true },
      {
        source: '/en/docs/:path*',
        destination: '/docs/:path*',
        permanent: true,
      },
      {
        source: '/llms.mdx/en/:path*',
        destination: '/llms.mdx/:path*',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    const exports = ['/docs.md', '/docs/:path*.md', '/docs/:path*.txt'];
    return [
      ...exports.flatMap((path) => [
        { source: path, destination: `/llms.mdx${path}` },
        {
          source: `/:lang(nl|es|fr|de)${path}`,
          destination: `/llms.mdx/:lang${path}`,
        },
      ]),
      { source: '/docs/:path*', destination: '/en/docs/:path*' },
    ];
  },
};

export default withMDX(config);
