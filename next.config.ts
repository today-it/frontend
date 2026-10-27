import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  rewrites() {
    return [{ source: '/', destination: '/places' }];
  },
  allowedDevOrigins: ['127.0.0.1'],
};

export default nextConfig;
