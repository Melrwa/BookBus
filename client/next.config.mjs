/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
      return [
        {
          source: "/api/:path*", // Proxy all requests starting with /api
          destination: "https://bookbus-backend.onrender.com/:path*", // Replace with your Flask API base URL
        },
      ];
    },
  };

  export default nextConfig;
