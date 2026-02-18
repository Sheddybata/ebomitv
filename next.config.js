/** @type {import('next').NextConfig} */
const nextConfig = {
  // PWA Configuration
  // Note: For full PWA support, consider using next-pwa package
  // npm install next-pwa
  
  // Optimize for TV devices
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Enable static export if needed for TV apps
  // output: 'export', // Uncomment if deploying as static site
  
  // Headers for TV compatibility
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig


