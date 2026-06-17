import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@posefix/shared', '@posefix/db', '@posefix/scoring'],
  serverExternalPackages: ['@mediapipe/tasks-vision'],
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
