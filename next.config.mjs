/** @type {import('next').NextConfig} */

// The backend now serves its own uploaded images (see §5/§7 of the fix
// prompt — POST /admin/uploads/tour-image and friends), so we can let
// Next's image optimizer point at it directly instead of skipping
// optimization altogether. Guarded with try/catch: if the env var is ever
// missing or malformed at build time, we fall back to `unoptimized` rather
// than failing the whole build.
function buildImagesConfig() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return { unoptimized: true };

  try {
    const { protocol, hostname, port } = new URL(apiUrl);
    return {
      remotePatterns: [
        {
          protocol: protocol.replace(":", ""),
          hostname,
          port: port || undefined,
        },
      ],
    };
  } catch {
    return { unoptimized: true };
  }
}

const nextConfig = {
  images: buildImagesConfig(),
};

export default nextConfig;
