import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";
import { fileURLToPath } from "node:url";

const isDev = process.env.NODE_ENV === "development";
const projectRoot = fileURLToPath(new URL(".", import.meta.url));

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    root: projectRoot,
  },
};

export default withPWA({
  dest: "public",
  disable: isDev,
  register: true,
})(nextConfig);
