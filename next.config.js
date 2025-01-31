const withTM = require('next-transpile-modules')([
  'react-select',
  '@radix-ui/react-checkbox',
  '@radix-ui/react-collapsible',
  '@radix-ui/react-accordion',
]);

const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    scrollRestoration: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },
  webpack(config) {
    // Add a rule to ensure Babel loader processes JS and JSX files in node_modules/react-select
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      include: /node_modules\/react-select\/src/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
          plugins: ['@babel/plugin-transform-flow-strip-types'],
        },
        env: {
          NEXT_PUBLIC_GRAPHQL_API_URL: process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
        },
      },
    });

    config.resolve.extensions.push('.js', '.jsx');

    return config;
  },
};

module.exports = withTM(nextConfig);
