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
  images: {
    domains: ['lh3.googleusercontent.com', 'qgaqvfqcyjcewjnntzci.supabase.co'],
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
      },
    });

    config.resolve.extensions.push('.js', '.jsx');

    config.module.rules.push({
      test: /\.graphql$/,
      exclude: /node_modules/,
      use: {
        loader: 'graphql-tag/loader',
      },
    });

    return config;
  },
};

module.exports = withTM(nextConfig);
