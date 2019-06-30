const express = require('express')
const helmet = require('helmet')
const busboy = require('connect-busboy')
const bodyParser = require('body-parser')
const busboyBodyParser = require('busboy-body-parser')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const appPackage = require('../package')
const app = express()

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

require('../api/models/index')

app.use(helmet({
  hidePoweredBy: { setTo: 'The Geek Developers' }
}))

app.use(busboy())
app.use(bodyParser.json({ limit: '1000mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '1000mb', parameterLimit: 50000 }))
app.use(bodyParser.text())
app.use(busboyBodyParser())

app.get('/api', (req, res) => {
  res.send({
    status: 'ok',
    environment: process.env.NODE_ENV,
    version: appPackage.version
  })
})

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
