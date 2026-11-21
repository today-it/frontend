import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/1200x800',
      },
    ],
  },
  rewrites() {
    return [{ source: '/', destination: '/places' }];
  },
  allowedDevOrigins: ['127.0.0.1'],
};

export default nextConfig;
