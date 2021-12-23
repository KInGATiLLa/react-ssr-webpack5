const scriptExtensions = /\.(tsx|ts|js|jsx|mjs)$/
const imageExtensions = /\.(bmp|gif|jpg|jpeg|png)$/
const fontsExtension = /\.(eot|otf|ttf|woff|woff2)$/

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: scriptExtensions,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: fontsExtension,
        type: 'asset',
      },
      {
        test: /\.svg/,
        type: 'asset/inline',
      },
      {
        test: imageExtensions,
        type: 'asset/resource',
      },
    ],
  },
}
