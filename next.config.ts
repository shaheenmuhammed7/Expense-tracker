import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Expense-tracker",
  assetPrefix: "/Expense-tracker/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;