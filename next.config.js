/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "static.vecteezy.com",
      },
    ],
  },
};

module.exports = nextConfig;
