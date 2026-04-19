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
      //{ protocol: 'https', hostname: 'cdn.shopify.com', pathname: '/**' }
   { protocol: 'https', hostname: '**.public.blob.vercel-storage.com', port: '' },
    ]
  },
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "expert-couscous-wp6x74q4w5pfgg7x-3000.app.github.dev",
        "localhost:3000"
      ],
    },
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);