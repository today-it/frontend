import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  rewrites() {
    return [{ source: '/', destination: '/places' }];
  },
};

export default nextConfig;
