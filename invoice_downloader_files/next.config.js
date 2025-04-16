/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['puppeteer-core', 'chrome-aws-lambda'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('puppeteer-core', 'chrome-aws-lambda');
    }
    return config;
  },
}

module.exports = nextConfig
