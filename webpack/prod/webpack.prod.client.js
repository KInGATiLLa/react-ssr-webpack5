const {merge} = require('webpack-merge')
const baseConfig = require('../webpack.base.js')
const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
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
  ],
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      automaticNameDelimiter: '-',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin({}),
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
          compress: {
            drop_console: true,
          },
        },
        extractComments: false,
        exclude: [],
      }),
    ],
  },
}

module.exports = merge(baseConfig, clientConfig)
