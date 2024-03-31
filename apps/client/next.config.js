/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ['@repo/ui'],
  output: 'standalone',
  images: {
    minimumCacheTTL: 60,
    formats: ['image/avif', 'image/webp'],
  },
};
