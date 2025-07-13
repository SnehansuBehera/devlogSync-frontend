import type { NextConfig } from "next";
import type { Configuration as WebpackConfig } from "webpack";

const nextConfig: NextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'res.cloudinary.com', 'avatars.githubusercontent.com'],
  },

  // Add the custom Webpack config
  webpack(config: WebpackConfig) {
    config.cache = {
      type: 'filesystem',
      maxMemoryGenerations: 1, // 🔧 Limits in-memory cache to reduce RAM use
    };
    return config;
  },
};

export default nextConfig;
