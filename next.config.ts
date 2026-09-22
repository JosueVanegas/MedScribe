import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No backend: `next build` emits a static site in `out/` that can be hosted
  // for free (Cloudflare Pages, Netlify, GitHub Pages…) or wrapped as a
  // desktop/mobile app. AI calls go from the device to the clinic's provider.
  output: "export",
};

export default nextConfig;
