import path from 'path'
import express from 'express'
import compression from 'compression'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
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
      publicPath: compiler.options.output.publicPath,
      serverSideRender: true,
    })
  )
  app.use(WebpackHotMiddleware(compiler))
}

// Gzip
app.use(compression())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('/', express.static(path.join('dist/client', '/')))

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
