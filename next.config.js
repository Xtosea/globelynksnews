/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "via.placeholder.com", // placeholders
      "cdn.techcrunch.com",  // TechCrunch images
      "static.bbc.com",      // BBC images
      "res.cloudinary.com"   // Cloudinary (your uploaded images)
      // add any other domains you fetch images from
    ],
  },
};

export default nextConfig;