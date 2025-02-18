const withMDX = require('@next/mdx')({
  extension: /\.(md|mdx)$/,
  options: {
    providerImportSource: '@mdx-js/react',
  },
})
const withPWA = require('next-pwa')
const TerserPlugin = require('terser-webpack-plugin')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')
const { i18n } = require('./next-i18next.config')
const { withSentryConfig } = require('@sentry/nextjs')

const isProduction = process.env.NODE_ENV === 'production'
const basePath = ''

const conf = withBundleAnalyzer(
  withPWA(
    withMDX({
      basePath,
      typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // We do ythis for now to allow for staging deployments during the
        // active development phase and are planning to remove this later
        // !! WARN !!
        ignoreBuildErrors: isProduction,
      },
      productionBrowserSourceMaps: true,
      cssModules: true,
      pageExtensions: ['mdx', 'tsx'],
      publicRuntimeConfig: {
        // Will be available on both server and client
        buildHash: process.env.COMMIT_SHA,
        buildDate: Date.now(),
        apiHost: process.env.API_HOST,
        basePath,
        mixpanelEnv: process.env.MIXPANEL_ENV,
        mixpanelAPIKey: process.env.MIXPANEL_KEY,
        adRollAdvId: process.env.ADROLL_ADV_ID,
        adRollPixId: process.env.ADROLL_PIX_ID,
        useTermsOfService: process.env.USE_TERMS_OF_SERVICE === '1',
        showBuildInfo: process.env.SHOW_BUILD_INFO === '1',
        infuraProjectId: process.env.INFURA_PROJECT_ID,
        etherscanAPIKey: process.env.ETHERSCAN_API_KEY,
        sentryRelease: process.env.SENTRY_RELEASE,
        exchangeAddress:
          process.env.USE_DUMMY === '1' ? process.env.DUMMY_EXCHANGE : process.env.EXCHANGE,
        multiplyProxyActions: process.env.MULTIPLY_PROXY_ACTIONS,
        mainnetCacheURL: process.env.MAINNET_CACHE_URL,
      },
      webpack: function (config, { isServer }) {
        config.module.rules.push({
          test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 100000,
              name: '[name].[ext]',
            },
          },
        })

        if (isProduction) {
        }

        config.optimization = {
          minimize: true,
          minimizer: [
            new TerserPlugin({
              // TODO: Figure out how to disable mangling partially without breaking the aplication.
              // To test if your changes break the app or no - go to /owner/<address> page for an account that has some vaults and see if they are displayed.
              terserOptions: {
                mangle: false,
              },
            }),
          ],
        }
        // Moment.js locales take up a lot of space, so it's good to remove unused ones. "en" is there by default and can not be removed
        // config.plugins.push(new MomentLocalesPlugin({ localesToKeep: ['es', 'pt'] }))

        if (!isServer) {
          config.resolve = {
            ...config.resolve,
            fallback: {
              fs: false,
            },
          }
          config.plugins.push(new NodePolyfillPlugin())
        }

        if (!isProduction) {
          config.watch = true
          // Don't ignore all node modules.
          // config.watchOptions.ignored = config.watchOptions.ignored.filter(
          //   (ignore) => !ignore.toString().includes('node_modules'),
          // )
          // Ignore all node modules except those here.
          config.watchOptions = {
            ignored: ['node_modules/**'],
          }
        }

        return config
      },
      pwa: {
        disable: process.env.NODE_ENV !== 'production',
        register: process.env.NODE_ENV === 'production',
        dest: 'public',
      },
      i18n,
      async redirects() {
        return [
          {
            source: '/borrow/:slug(.{1,})', // wildcard redirect `:slug*` was causing an infinite redirect loop
            destination: '/:slug',
            permanent: true,
          },
          {
            source: '/dashboard',
            destination: '/daiwallet/dashboard',
            permanent: true,
          },
          {
            source: '/(0x[a-fA-F0-9]{40}.*)',
            destination: '/daiwallet/dashboard',
            permanent: true,
          },
        ]
      },
      async headers() {
        return [
          {
            source: '/:path*',
            headers: [
              {
                key: 'Strict-Transport-Security',
                value: 'max-age=63072000; includeSubdomains; preload',
              },
              { key: 'X-Content-Type-Options', value: 'nosniff' },
              { key: 'X-Frame-Options', value: 'ALLOW' },
              { key: 'X-XSS-Protection', value: '1; mode=block' },
              { key: 'Referrer-Policy', value: 'same-origin' },
              { key: 'Access-Control-Allow-Origin', value: 'https://gnosis-safe.io' },
            ],
          },
        ]
      },
    }),
  ),
)

// sentry needs to be last for accurate sourcemaps
module.exports = withSentryConfig(conf, {
  org: 'oazo-apps',
  project: 'oazo-apps',
  url: 'https://sentry.io/',
})
