/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ['@repo/ui'],
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
    ],
    minimumCacheTTL: 60,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};
