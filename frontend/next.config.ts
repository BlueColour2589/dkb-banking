import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./next-intl.config.ts');

const nextConfig = {
  reactStrictMode: true
};

export default withNextIntl(nextConfig);