const express = require('express')
const session = require('express-session')
const cors = require('cors')
const helmet = require('helmet')
const busboy = require('connect-busboy')
const bodyParser = require('body-parser')
const busboyBodyParser = require('busboy-body-parser')
const cookieParser = require('cookie-parser')
const consola = require('consola')
const uuid = require('uuid/v4')
const passport = require('passport')
const { Nuxt, Builder } = require('nuxt')
const _ = require('lodash')
const userAttributes = require('../config/user-attributes')
const authenticate = require('../config/authenticate')
const User = require('../api/models/user')
const app = express()

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

require('../api/models/index')

app.use(helmet({
  hidePoweredBy: { setTo: 'The Geek Developers' }
}))

app.use(cors())

app.set('etag', false)
app.use(busboy())
app.use(bodyParser.json({ limit: '1000mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '1000mb', parameterLimit: 50000 }))
app.use(bodyParser.text())
app.use(busboyBodyParser())
app.use(cookieParser())

// Express Session
app.use(session({
  genid: () => {
    return uuid()
  },
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}))

// Passport init
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      const userData = _.pick(user, userAttributes)
      done(null, userData)
    })
    .catch((err) => {
      done(err)
    })
})

app.use(authenticate.loadUser)

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

/* ROUTES */
app.use('/api', require('../api/index'))
app.use('/api/v1/users', require('../api/v1/users'))
app.use('/api/v1/auth', require('../api/v1/auth'))

start()
