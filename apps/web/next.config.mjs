import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/shadverse"],
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  basePath: "",
  images: { unoptimized: true },
  reactStrictMode: true,
  experimental: {
    viewTransition: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: [
    "ts-morph",
    "typescript",
    "oxc-transform",
    "twoslash",
  ],
};

export default withMDX(nextConfig);
