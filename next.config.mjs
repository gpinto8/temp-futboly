/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    path: '/',
    domains: ['cdn.sportmonks.com'],
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'cdn.sportmonks.com',
    //   },
    // ],
  },
  reactStrictMode: false,
};

export default nextConfig;
