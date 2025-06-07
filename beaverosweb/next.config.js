/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**', // Allows any path on placehold.co
      },
    ],
    dangerouslyAllowSVG: true, // TEMPORARY: This allows loading SVG images from remote hosts.
  },
};

module.exports = nextConfig;
