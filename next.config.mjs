/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Backend/CDN image domain is not known yet (backend is a separate,
    // not-yet-built project) — skip Next's optimizer instead of guessing
    // an allowlist. Revisit once the real image host is known.
    unoptimized: true,
  },
};

export default nextConfig;
