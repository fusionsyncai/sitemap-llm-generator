import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@geosuite/sitemap-builder",
    "@geosuite/llms-txt-generator",
  ],
};

export default nextConfig;
