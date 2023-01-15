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
  // this temporary, for testing purposes.
  typescript: {
    ignoreBuildErrors: process.env.TS_IGNORE_BUILD_ERRORS === "true",
  },
};

module.exports = nextConfig;
