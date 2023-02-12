/** @type {import('next').NextConfig} */
import withBundleAnalyzer from '@next/bundle-analyzer'

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/about',
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
  env: {
    NEXT_PUBLIC_BASEURL: process.env['http://localhost:3000/'],
  }
}

export const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})

export default nextConfig
