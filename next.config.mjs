import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,
  distDir: process.env.DIST_DIR || '.next',
  outputFileTracingRoot: rootDir,
  compress: true,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ['react-icons', 'lucide-react'],
  },
  async redirects() {
    return [
      {
        source: '/work',
        destination: '/works',
        permanent: true,
      },
      {
        source: '/contact',
        destination: '/contact-us',
        permanent: true,
      },
      {
        source: '/caseStudy',
        destination: '/works',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.samiinfotech.com',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  webpack(config, ctx) {
    if (!ctx.isServer && config.optimization?.splitChunks?.cacheGroups) {
      config.optimization.splitChunks.cacheGroups.vendor = {
        name: 'vendor',
        test: /[\\/]node_modules[\\/]/,
        priority: 10,
        reuseExistingChunk: true,
      };
    }
    config.module.rules.push({
      test: /\.(jsx|tsx)$/,
      exclude: [/node_modules/],
      use: [
        {
          loader: '@dhiwise/component-tagger/nextLoader',
        },
      ],
    });
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
