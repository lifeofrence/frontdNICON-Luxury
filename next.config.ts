import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "niconluxury.jubileesystem.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
