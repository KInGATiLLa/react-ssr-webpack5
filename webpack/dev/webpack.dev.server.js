const path = require('path')
const {merge} = require('webpack-merge')
const baseConfig = require('../webpack.base.js')
const webpackNodeExternals = require('webpack-node-externals')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ROOT_DIR = path.resolve(__dirname, '../../')
const resolvePath = (...args) => path.resolve(ROOT_DIR, ...args)
const BUILD_DIR = resolvePath('dist')
const SRC_DIR = resolvePath('src')

const NODE_MODULES_DIR = resolvePath(ROOT_DIR, 'node_modules')
const CLIENT_DIR = resolvePath(SRC_DIR, 'client')

/** @type {import('webpack').Configuration} */

const serverConfig = {
  target: 'node',
  mode: 'development',
  name: 'server',
  entry: {
    server: './src/server/index.js',
  },
  devtool: false,
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
                  'primary-color': '#ff00ff',
                },
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
  output: {
    path: BUILD_DIR,
    filename: '[name].js',
    // libraryTarget: 'commonjs2',
    chunkFilename: 'chunks/[name].js',
    devtoolModuleFilenameTemplate: (info) => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
    assetModuleFilename: 'static/assets/[name].[hash][ext][query]',
    clean: true,
  },
  externals: [webpackNodeExternals()],
}

module.exports = merge(baseConfig, serverConfig)
