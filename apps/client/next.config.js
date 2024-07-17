/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ['@repo/ui'],
  output: 'standalone',
  images: {
    domains: [process.env.SUPABASE_DOMAIN, '127.0.0.1', '*.supabase.co'],
    minimumCacheTTL: 60,
  },
  env: {
    ATHLONIX_STORAGE_URL: process.env.NEXT_PUBLIC_ATHLONIX_STORAGE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SOCKET_ENDPOINT: process.env.NEXT_PUBLIC_SOCKET_ENDPOINT,
  },
};
