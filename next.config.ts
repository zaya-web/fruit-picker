import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard/fruits",
        destination: "/dashboard/crops",
        permanent: true,
      },
      {
        source: "/dashboard/fruits/:path*",
        destination: "/dashboard/crops/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
