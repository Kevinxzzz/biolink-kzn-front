import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/categorias",
        destination: "/dashboard/categories",
        permanent: false,
      },
      {
        source: "/dashboard/categorias",
        destination: "/dashboard/categories",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
