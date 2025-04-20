// new‑frontend/next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // (for example) allow TMDB image host
  images: {
    domains: ["image.tmdb.org"],
  },
  // any other Next.js config you need…
};

module.exports = nextConfig;
