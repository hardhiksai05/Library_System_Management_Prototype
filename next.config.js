/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'covers.openlibrary.org'],
    unoptimized: true,
  },
};

module.exports = nextConfig;
