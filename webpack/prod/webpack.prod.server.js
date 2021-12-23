const {merge} = require('webpack-merge')
const baseConfig = require('../webpack.base.js')
const webpackNodeExternals = require('webpack-node-externals')
const path = require('path')
const ROOT_DIR = path.resolve(__dirname, '../../')
const resolvePath = (...args) => path.resolve(ROOT_DIR, ...args)
const BUILD_DIR = resolvePath('dist')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const serverConfig = {
  target: 'node',
  mode: 'production',
  name: 'server',
  entry: {
    server: './src/server/index.js',
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
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash:8].css',
      ignoreOrder: true,
    }),
  ],
  output: {
    path: BUILD_DIR,
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    chunkFilename: 'chunks/[name].js',
    assetModuleFilename: 'assets/[name].[hash][ext][query]',
  },
  externals: [webpackNodeExternals()],
}

module.exports = merge(baseConfig, serverConfig)
