const webpack = require('webpack')
const {merge} = require('webpack-merge')
const path = require('path')
const baseConfig = require('../webpack.base.js')
const LoadablePlugin = require('@loadable/webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// import path from 'path'
// import webpack from 'webpack'
// import {merge} from 'webpack-merge'
// import baseConfig from '../webpack.base.js'
// import LoadablePlugin from '@loadable/webpack-plugin'
// import MiniCssExtractPlugin from 'mini-css-extract-plugin'

// const __dirname = path.resolve()
// const ROOT_DIR = path.resolve(__dirname, './')
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
    index: ['webpack-hot-middleware/client?reload=true&noInfo=true', './src/client/index.js'],
  },
  devtool: 'inline-cheap-module-source-map',
  devServer: {
    contentBase: './dist',
    compress: true,
    historyApiFallback: true,
    hot: true,
    open: true,
  },
  output: {
    path: resolvePath(BUILD_DIR, 'client'),
    publicPath: '/client/',
    filename: '[name].js',
    chunkFilename: '[name].js',
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: (info) => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
    assetModuleFilename: 'assets/[name].[hash][ext][query]',
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
          {
            loader: 'style-loader',
          },
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
              modules: {
                mode: 'local',
                auto: true,
                exportGlobals: true,
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
                localIdentContext: resolvePath(ROOT_DIR, 'src'),
                localIdentHashSalt: 'octagon',
                namedExport: true,
                exportLocalsConvention: 'camelCaseOnly',
                exportOnlyLocals: false,
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
    new webpack.CleanPlugin(),
    new MiniCssExtractPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    //loadable plugin will create all the chunks
    new LoadablePlugin({
      outputAsset: false, // to avoid writing loadable-stats in the same output as client
      writeToDisk: true,
      filename: `${BUILD_DIR}/loadable-stats.json`,
    }),
    // you can add additional plugins here like BundleAnalyzerPlugin, Copy Plugin etc.
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
    minimize: false,
    minimizer: [],
  },
}

module.exports = merge(baseConfig, clientConfig)
// export default merge(baseConfig, clientConfig)
