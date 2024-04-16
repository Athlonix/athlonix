/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ['@repo/ui'],
  output: 'standalone',
  images: {
    minimumCacheTTL: 60,
    formats: ['image/avif', 'image/webp'],
  },
  env: {
    ATHLONIX_API_URL: process.env.ATHLONIX_API_URL,
  },
};
