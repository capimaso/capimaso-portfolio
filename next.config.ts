import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    '/': ['./public/assets/win7/sounds/*.wav', './public/assets/win7/sounds/*.mp3'],
  },
  async redirects() {
    return ['/xp', '/win7'].map(source => ({ source, destination: '/', permanent: true }));
  },
};
export default nextConfig;
