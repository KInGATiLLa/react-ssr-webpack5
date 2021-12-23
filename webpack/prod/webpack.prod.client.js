const {merge} = require('webpack-merge')
const baseConfig = require('../webpack.base.js')
const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin') // This plugin is used to minify your JavaScript/Typescript files.
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin') // A Webpack plugin to optimize \ minimize CSS assets.
const LoadablePlugin = require('@loadable/webpack-plugin')
const ROOT_DIR = path.resolve(__dirname, '../../')
const resolvePath = (...args) => path.resolve(ROOT_DIR, ...args)
const BUILD_DIR = resolvePath('dist')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const clientConfig = {
  target: 'web',
  mode: 'production',
  entry: {
    index: './src/client/index.js',
  },
  devtool: false,
  resolve: {
    ...baseConfig.resolve,
  },
  module: {
    ...baseConfig.module,
    rules: [
      {
        test: /\.(css|less)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              // modules: 'global',
              // modules: {
              //   mode: 'local',
              //   auto: true,
              // },
              // modules: {
              //   mode: 'icss',
              // },
              modules: {
                // mode: 'local',
                // auto: true,
                // exportGlobals: true,
                // localIdentName: '[path][name]__[local]--[hash:base64:5]',
                // localIdentContext: resolvePath(ROOT_DIR, 'src'),
                // localIdentHashSalt: 'octagon',
                // namedExport: true,
                // exportLocalsConvention: 'camelCase',
                // exportOnlyLocals: false,
                // getLocalIdent: (loaderContext, localIdentName, localName, options) => {
                //   if (loaderContext.resourcePath.includes('node_modules')) {
                //     return localName
                //   } else {
                //     const fileName = path.basename(loaderContext.resourcePath)
                //     const name = fileName.replace(/\.[^/.]+$/, '')
                //     if (name === 'global') {
                //       return localName
                //     }
                //     return `${name}__${localName}`
                //   }
                // },
              },
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
                modifyVars: {
                  'primary-color': '#ff0000',
                },
              },
            },
          },
        ],
      },
    ],
  },
  output: {
    path: resolvePath(BUILD_DIR, 'client'),
    publicPath: '/client/',
    // Chunkhash is based on webpack entry point Each entry defined will have it’s own hash.
    // If anything changes for that particular entry point than only corresponding hash will change.
    // :8 is used to done slicing of hashes (eg: 8c4cbfdb instead of 8c4cbfdb91ff93f3f3c5).
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[name].[chunkhash:8].js',
    assetModuleFilename: 'assets/[name].[hash][ext][query]',
  },
  plugins: [
    new webpack.CleanPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash:8].css',
      ignoreOrder: true,
    }),
    new LoadablePlugin({
      outputAsset: false,
      writeToDisk: true,
      filename: `${BUILD_DIR}/loadable-stats.json`,
    }),
    // Add any plugins required here for example: Bundle Analyzer, Copy Plugin etc
  ],
  optimization: {
    runtimeChunk: 'single', // creates a runtime file to be shared for all generated chunks.
    splitChunks: {
      chunks: 'all', // This indicates which chunks will be selected for optimization.
      automaticNameDelimiter: '-',
      cacheGroups: {
        vendor: {
          // to convert long vendor generated large name into vendor.js
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin({}), // minify the css
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false, // It will drop all the console.log statements from the final production build
          },
          compress: {
            // It will stop showing any console.log statement in dev tools. Make it false if you want to see consoles in production mode.
            drop_console: true,
          },
        },
        extractComments: false,
        exclude: [], // If you want to exclude any files so that it doesn't get minified.
      }),
    ],
  },
}

module.exports = merge(baseConfig, clientConfig)
