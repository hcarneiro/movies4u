const path = require('path')
const _ = require('lodash')
const express = require('express')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const casual = require('casual')
const bcrypt = require('bcrypt')
const saltRounds = 10
const md5 = require('md5')
const { checkSchema, validationResult } = require('express-validator')
const userSignupSchema = require(path.resolve(__dirname, './validators/userSignup'))

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

// Models
const User = require('../models/user')

// Configs
const cookie = require('../../config/cookie')
const database = require('../../config/database')
const config = require('../../config/local-config.json')
const email = require('../../config/email')
const bruteforce = require('../../config/bruteforce')

const isDev = process.env.NODE_ENV !== 'production'

// Strategies
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  (email, password, done) => {
    return User.findOne({
      attributes: ['id', 'password', 'email', 'auth_token', 'preferences', 'createdAt'],
      where: {
        email: email.toLowerCase()
      }
    })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: 'Email/password combination does not match' })
        }

        if (!user.isValidPassword(password)) {
          return done(null, false, { message: 'Email/password combination does not match' })
        }

        return done(null, user)
      })
      .catch((err) => {
        return done(err)
      })
  }
))

const router = express.Router()

router.post('/login', bruteforce.prevent, (req, res) => {
  passport.authenticate('local', (err, user, info) => {
    const errorMessage = 'Email/password combination does not match'

    if (err) { 
      console.error(err)
    }

    if (!user) {
      return res.status(401).format({
        'application/json': () => {
          res.send({
            message: info || errorMessage,
            error: err
          })
        },
        'text/html': () => {
          req.body.error = errorMessage
          res.render('login', req.body)
        }
      })
    }

    user.lastAuthenticatedAt = Sequelize.literal('CURRENT_TIMESTAMP')
    let tokenPromise

    if (user.auth_token) {
      tokenPromise = user.save()
    } else {
      tokenPromise = user.generateAuthToken()
    }

    tokenPromise
      .then(() => {
        if (req.body.remember === false) {
          // @TODO:
          // What to do if Remember Me is not checked
        }

        const data = _.pick(user, ['id', 'email', 'auth_token', 'createdAt'])
        data.host = !isDev ? 'https://geekdev-movies4u.herokuapp.com/' : config.host

        if (req.body.redirect) {
          return res.redirect(req.body.redirect)
        }
        cookie.set(res, user.auth_token)

        return res.send(data)
      })
      .catch((err) => {
        console.error(err)
        return res.status(400).send({
          message: err.description || err.message || err
        })
      })
  })(req, res)
})

router.post('/logout', (req, res) => {
  req.logout()
  req.auth_token = undefined
  cookie.set(res, '')

  res.send({
    message: 'User logged out!'
  })
})

router.post('/signup', checkSchema(userSignupSchema), (req, res) => {
  req.db = database.db

  if (!req.db) {
    return res.status(400).send({
      message: `There seems to be a connection problem, please try again later.`
    })
  }

  const errors = validationResult(req).array()

  if (errors && errors.length) {
    return res.status(400).send({
      message: 'Validation failed',
      errors
    })
  }

  const user = database.db.models.user.build(_.pick(req.body, [
    'firstName', 'lastName', 'email'
  ]))

  user.setPassword(req.body.password)
  const hash = md5(casual.unix_time + user.id)
  const token = `${hash}-${casual.unix_time}`
  user.verificationToken = token
  user.verificationTokenExpires = Date.now() + 60 * 60 * 24 * 1000

  // Verification email for the user
  function sendEmail() {
    const verificationUrl = `${isDev ? 'https://geekdev-movies4u.herokuapp.com/' : config.host}verify/${token}`
    const emailData = {
      template_id: 'd-7ad0ef3677244f97a4fa8004ae7cd45f',
      message: {
        to: {
          email: req.body.email,
          name: user.fullName
        },
        dynamicData: {
          firstName: user.firstName || '',
          verificationUrl: verificationUrl,
          subject: 'Welcome! Confirm Your Email'
        }
      }
    }

    return email.sendTemplate(emailData)
      .then(function onEmailSendError(response) {
        if (!res.headersSent) {
          res.send()
        }
      })
      .catch(function onEmailSendError() {
        if (!res.headersSent) {
          res.error(400, `Could not send the email to ${req.body.email}.`)
        }
      })
  }

  user.save().then(() => {
    res.status(201).send({
      user: _.pick(user.get({ plain: true }), [
        'id', 'firstName', 'lastName', 'fullName', 'email'
      ])
    })

    sendEmail().catch(console.error)

    // clear cache on users and organisations admin lists
    req.cache.clear({ key: 'users', global: true })
  }).catch((error) => {
    res.status(400)

    if (Array.isArray(error.errors) && error.errors.length && error.errors[0].path === 'email') {
      database.db.models.user.findAll({ where: { email: req.body.email } })
        .then((users) => {
          const existingUser = users[0]

          // User already verified
          if (!existingUser.verificationToken) {
            return res.send({
              message: 'Email address already in use'
            })
          }

          // Expired token
          if (existingUser.verificationTokenExpires < new Date(Date.now())) {
            existingUser.verificationToken = token
          }

          // Extend verification token expiring date
          existingUser.verificationTokenExpires = Date.now() + 60 * 60 * 24 * 1000

          // Save it
          res.status(201).send({
            user: _.pick(user.get({ plain: true }), [
              'id', 'firstName', 'lastName', 'fullName', 'email'
            ])
          })
          existingUser.save()
          sendEmail()
        })
    } else {
      res.send({
        message: 'We couldn\'t create your account. Please contact us at hello@thegeekdeveloper.com to get more assistance.'
      })
    }
  })
})

router.post('/verify/:token', (req, res) => {
  database.db.models.user.findOne({
    attributes: ['id', 'firstName', 'lastName', 'email', 'auth_token'],
    where: {
      verificationToken: req.params.token,
      verificationTokenExpires: {
        [Op.gt]: new Date(Date.now())
      }
    }
  }).then((user) => {
    if (!user) {
      return Promise.reject('Invalid or expired token')
    }

    user.verificationToken = null
    user.verificationTokenExpires = null
    return user.save().then(() => {
      return user.generateAuthToken()
    }).then(function () {
      cookie.set(res, user.auth_token)
      res.send(user)
    })
  }).catch((err) => {
    res.status(400).send({
      message: err.message || err.description || err
    })
  })
})

router.post('/forgot', bruteforce.prevent, (req, res) => {
  const userEmail = req.body.email
  let user

  if (!userEmail) {
    return res.status(400).send({ message: 'Email is required' })
  }

  return database.db.models.user.findOne({
    attributes: ['id', 'firstName', 'lastName'],
    where: { email: userEmail.toLowerCase() }
  })
    .then((dbUser) => {
      if (!dbUser) {
        return res.status(400).send({
          message: 'Email does not exist'
        })
      }

      user = dbUser

      const hash = md5(casual.unix_time + user.id)
      const token = `${hash}-${casual.unix_time}`
      const resetUrl = `${isDev ? 'https://geekdev-movies4u.herokuapp.com/' : config.host}reset-password/${token}`

      const emailData = {
        template_id: 'd-6a025f0c48984467a97a69c5f3201cac',
        message: {
          to: {
            email: userEmail,
            name: user.fullName
          },
          dynamicData: {
            firstName: user.firstName || '',
            token: token,
            resetUrl: resetUrl,
            subject: 'Reset account password'
          }
        }
      }

      user.resetPasswordToken = token
      user.resetPasswordTokenExpires = Date.now() + 60 * 60 * 1000
      user.save()

      return email.sendTemplate(emailData)
        .then(() => {
          return res.send()
        })
        .catch(() => {
          return res.status(400).send()
        })
    })
})

router.get('/reset/:token', (req, res) => {
  return database.db.models.user.findOne({
    attributes: ['id'],
    where: {
      resetPasswordToken: req.params.token,
      resetPasswordTokenExpires: {
        [Op.gt]: new Date(Date.now())
      }
    }
  })
    .then(function onGetUser(user) {
      if (!user) {
        return res.status(400).send({
          message: 'Invalid or expired token'
        })
      }

      return res.status(200).send()
    })
})

router.post('/reset/:token', (req, res) => {
  const { password } = req.body

  if (!password) {
    return res.status(400).send({ message: 'Password is required' })
  }

  const salt = bcrypt.genSaltSync(saltRounds)
  const newPassword = bcrypt.hashSync(password, salt)
  return database.db.models.user.findOne({
    attributes: ['id'],
    where: {
      resetPasswordToken: req.params.token,
      resetPasswordTokenExpires: {
        [Op.gt]: new Date(Date.now())
      }
    }
  })
    .then((results) => {
      const user = results
      if (!user) {
        return res.status(400).send({
          message: 'Invalid or expired token'
        })
      }

      user.password = newPassword
      user.resetPasswordToken = null
      user.resetPasswordTokenExpires = null

      return user.save()
    })
    .then(() => {
      res.send()
    }).catch(res.error(500))
})

module.exports = router
