import React from 'react'
import {renderToString} from 'react-dom/server'
import {StaticRouter} from 'react-router-dom/server'
import getHtml from './html/html.js'
import path from 'path'
import App from '../client/App/App.js'
import {ChunkExtractor, ChunkExtractorManager} from '@loadable/server'
import {ServerStyleSheet} from 'styled-components'

export default (req) => {
  const sheet = new ServerStyleSheet()
  const loadableJson = path.resolve(__dirname, './loadable-stats.json')

  const extractor = new ChunkExtractor({
    statsFile: loadableJson,
    entrypoints: ['index'],
  })

  const content = renderToString(
    sheet.collectStyles(
      <ChunkExtractorManager extractor={extractor}>
        <StaticRouter location={req.path}>
          <App />
        </StaticRouter>
      </ChunkExtractorManager>
    )
  )

  const styles = sheet.getStyleTags()

  const htmlData = {
    styles,
    children: content,
    extractor,
  }

  const html = getHtml(htmlData)

  return html
}
