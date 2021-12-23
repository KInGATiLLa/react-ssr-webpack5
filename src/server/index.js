import express from 'express'
import compression from 'compression'
import dotenv from 'dotenv'
import webpack from 'webpack'
import WebpackDevMiddleware from 'webpack-dev-middleware'
import WebpackHotMiddleware from 'webpack-hot-middleware'
import renderer from './renderer.js'
import webpackConfig from '../../webpack/dev/webpack.dev.client.js'

dotenv.config()

const app = express()

if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(webpackConfig)

  app.use(
    WebpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
      serverSideRender: true,
    })
  )

  app.use(WebpackHotMiddleware(compiler))
}

// Gzip
app.use(compression())
app.use(express.static('dist'))

app.get('*', (req, res) => {
  try {
    res.send(renderer(req))
  } catch (err) {
    console.log('error in rendering server side:', err)
  }
})

app.listen(3000, () => {
  console.log('Listening on port 3000')
})
