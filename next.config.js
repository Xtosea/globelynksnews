/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "via.placeholder.com",   // placeholder
      "example.com",           // add your article sources
      "cdn.example.com"        // any other external sources
    ],
  },
};

module.exports = nextConfig;