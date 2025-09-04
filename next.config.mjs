import cfg from "./src/config/config.json" with { type: "json" };

/** @type {import('next').NextConfig} */
/**const siteBasePath = cfg.site?.base_path;
const basePath =
  typeof siteBasePath === "string" && siteBasePath !== "/"
    ? siteBasePath
    : undefined;**/

export default {
  reactStrictMode: true,
  //...(basePath ? { basePath } : {}),
  trailingSlash: !!cfg.site?.trailing_slash,
  transpilePackages: ["next-mdx-remote"],
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com", pathname: "/**" },
    ],
  },
  eslint: { ignoreDuringBuilds: true },
};