/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
      {
        source: '/articles',
        destination: '/home',
        permanent: true,
      },
    ]
  },
  reactStrictMode: true,
}

export default nextConfig