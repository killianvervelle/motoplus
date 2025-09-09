import createNextIntlPlugin from 'next-intl/plugin';
import cfg from './src/config/config.json' with { type: 'json' };

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: !!(cfg.site?.trailing_slash),
  transpilePackages: ['next-mdx-remote'],
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com', pathname: '/**' }
    ]
  },
  eslint: { ignoreDuringBuilds: true }
};


const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);