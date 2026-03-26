/** @type {import('next').NextConfig} */
const nextConfig = {
 images: {
  remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  formats: ["image/avif", "image/webp"],
},
  api: {
    bodyParser: false,
  },
};

module.exports = nextConfig;
