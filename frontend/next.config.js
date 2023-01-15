/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    // all these domains are temporary, for testing purposes.
    domains: [
      "images.unsplash.com",
      "martinfowler.com",
      "localhost",
      "variety.com",
      "cdn.intra.42.fr",
      "img.freepik.com",
      "miro.medium.com",
      "encrypted-tbn0.gstatic.com",
    ],
  },
  // TEMPORARY - for testing purposes
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // END TEMPORARY
};

module.exports = nextConfig;
