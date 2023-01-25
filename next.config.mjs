/** @type {import('next').NextConfig} */
import withBundleAnalyzer from '@next/bundle-analyzer'

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/articles',
        destination: '/home',
        permanent: true,
      },
    ]
  },
  reactStrictMode: true
}

export const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})

export default nextConfig
