import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // ESLint 설정 - 빌드 시 경고 무시
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 클라이언트 사이드 JavaScript 최적화
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // 외부 이미지 호스트 허용
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
