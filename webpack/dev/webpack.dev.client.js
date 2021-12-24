const webpack = require('webpack')
const {merge} = require('webpack-merge')
const path = require('path')
const baseConfig = require('../webpack.base.js')
const LoadablePlugin = require('@loadable/webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ROOT_DIR = path.resolve(__dirname, '../../')
const resolvePath = (...args) => path.resolve(ROOT_DIR, ...args)
const BUILD_DIR = resolvePath('dist')
const SRC_DIR = resolvePath('src')

const NODE_MODULES_DIR = resolvePath(ROOT_DIR, 'node_modules')
const CLIENT_DIR = resolvePath(SRC_DIR, 'client')

/** @type {import('webpack').Configuration} */

const clientConfig = {
  target: 'web',
  mode: 'development',
  entry: {
    index: ['webpack-hot-middleware/client?reload=true&noInfo=false&overlay=true', './src/client/index.js'],
    // index: './src/client/index.js',
  },
  // devtool: 'inline-cheap-module-source-map',
  devtool: false,
  // devServer: {
  //   contentBase: './dist',
  //   compress: true,
  //   historyApiFallback: true,
  //   hot: true,
  //   open: true,
  // },
  stats: {
    cached: false,
    cachedAssets: false,
    chunks: false,
    chunkModules: false,
    children: false,
    colors: true,
    hash: false,
    modules: true,
    reasons: false,
    timings: true,
    version: false,
  },
  resolve: {
    ...baseConfig.resolve,
  },
  module: {
    ...baseConfig.module,
    rules: [
      {
        test: /\.(css|less)$/,
        use: [
          // {
          //   loader: 'style-loader',
          // },
          'style-loader',
          // MiniCssExtractPlugin.loader,
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
              // modules: {
              //   // mode: 'local',
              //   // auto: true,
              //   // exportGlobals: true,
              //   // localIdentName: '[path][name]__[local]--[hash:base64:5]',
              //   // localIdentContext: resolvePath(ROOT_DIR, 'src'),
              //   // localIdentHashSalt: 'octagon',
              //   // namedExport: true,
              //   // exportLocalsConvention: 'camelCaseOnly',
              //   // exportOnlyLocals: false,
              //   // getLocalIdent: (loaderContext, localIdentName, localName, options) => {
              //   //   if (loaderContext.resourcePath.includes('node_modules')) {
              //   //     return localName
              //   //   } else {
              //   //     const fileName = path.basename(loaderContext.resourcePath)
              //   //     const name = fileName.replace(/\.[^/.]+$/, '')
              //   //     if (name === 'global') {
              //   //       return localName
              //   //     }
              //   //     return `${name}__${localName}`
              //   //   }
              //   // },
              // },
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
                paths: [NODE_MODULES_DIR, CLIENT_DIR],
                modifyVars: {
                  'root-entry-name': 'default',
                  'primary-color': '#ff0000',
                },
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{from: 'src/client/assets', to: './static/assets'}],
    }),
    new webpack.CleanPlugin(),
    new MiniCssExtractPlugin(),
    new webpack.HotModuleReplacementPlugin(),
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
    minimize: false,
    minimizer: [],
  },
  output: {
    path: resolvePath(BUILD_DIR, 'client'),
    publicPath: '/static/',
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[name].[chunkhash:8].js',
    devtoolModuleFilenameTemplate: (info) => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
    assetModuleFilename: 'static/assets/[name].[hash][ext][query]',
    clean: true,
  },
}

module.exports = merge(baseConfig, clientConfig)
