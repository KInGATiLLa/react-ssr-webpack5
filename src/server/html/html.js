export default ({styles, children, extractor}) => {
  return `<html lang="en" class="h-100">
  <head>
  <base href="/" />
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="static/assets/favicon.png" rel="shortcut icon" />
    <title>React BoilerPlate</title>
    ${styles}
    ${extractor.getStyleTags()}
  </head>
  <body class="h-100">
    <div id="root">${children}</div>
    ${extractor.getScriptTags()}
  </body>
</html>`
}
