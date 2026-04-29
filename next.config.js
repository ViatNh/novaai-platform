/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  // [INTERNAL] Health check endpoint — keep private
  async headers() {
    return [
      {
        source: "/api/health",
        headers: [{ key: "X-Internal-Service", value: "novaai-api-gateway" }],
      },
    ];
  },
};

module.exports = nextConfig;
