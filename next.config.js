// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fal.media',
        pathname: '/**',  // Match all paths
      },
    ],
  },
};