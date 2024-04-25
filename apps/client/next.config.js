/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ['@repo/ui'],
  output: 'standalone',
  images: {
    domains: [process.env.SUPABASE_DOMAIN],
    minimumCacheTTL: 60,
    formats: ['image/avif', 'image/webp'],
  },
  env: {
    ATHLONIX_API_URL: process.env.NEXT_PUBLIC_ATHLONIX_API_URL,
    ATHLONIX_STORAGE_URL: process.env.NEXT_PUBLIC_ATHLONIX_STORAGE_URL,
  },
};
