/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone", // Enable standalone output for Docker
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
      {
        protocol: "http",
        hostname: "159.198.37.52",
        port: "3010",
      },
    ],
    unoptimized: true, // تعطيل التحسين للصور المحلية
  },
};

export default nextConfig;
