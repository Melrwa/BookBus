/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
      return [
        {
          source: "/api/:path*", // Proxy all requests starting with /api
          destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*`, // Replace with your Flask API base URL
        },
      ];
    },
  };
  
  export default nextConfig;
  