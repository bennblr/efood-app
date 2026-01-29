import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // SPA: отключаем статическую оптимизацию для страниц, чтобы всё рендерилось на клиенте
  experimental: {
    optimizePackageImports: ["antd"],
  },
};

export default nextConfig;
