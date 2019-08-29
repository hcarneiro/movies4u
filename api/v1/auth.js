const path = require('path')
const _ = require('lodash')
const express = require('express')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const request = require('request')
const gm = require('gm')
const async = require('async')
const sizeOf = require('image-size')
const aws = require('aws-sdk')
const casual = require('casual')
const bcrypt = require('bcrypt')
const saltRounds = 10
const md5 = require('md5')
const {
  checkSchema,
  validationResult
} = require('express-validator')
const userSignupSchema = require(path.resolve(__dirname, './validators/userSignup'))

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth2').Strategy

// Configs
const cookie = require('../../config/cookie')
const database = require('../../config/database')
const config = require('../../config/local-config.json')
const email = require('../../config/email')
const bruteforce = require('../../config/bruteforce')

let privateConfig
try {
  privateConfig = require('../../config/private-config.json')
} catch {
  privateConfig = undefined
}

const isDev = process.env.NODE_ENV !== 'production'

function uploadImage(url, id) {
  const createMediaFileData = {}
  let bucket

  return new Promise((resolve, reject) => {
    async.parallel([
      function setupAWS(done) {
        bucket = new aws.S3({
          params: {
            Bucket: isDev && privateConfig ? privateConfig.S3.BUCKET_NAME : process.env.S3_BUCKET_NAME,
            Region: isDev && privateConfig ? privateConfig.S3.BUCKET_REGION : process.env.S3_BUCKET_REGION
          }
        })

        bucket.name = isDev && privateConfig ? privateConfig.S3.BUCKET_NAME : process.env.S3_BUCKET_NAME

        done()
      },
      function uploadOriginalFile(done) {
        gm(request(url))
          .setFormat('jpeg')
          .stream((err, stdout, stderr) => {
            if (err) {
              return done()
            }

            const chunks = []
            stdout.on('data', (chunk) => {
              chunks.push(chunk)
            })

            stdout.on('end', () => {
              const buffer = Buffer.concat(chunks)
              const params = {
                ACL: 'public-read',
                ContentType: 'image/jpeg',
                Key: `${id}.jpeg`,
                Body: buffer
              }

              const dimensions = sizeOf(buffer)
              createMediaFileData.originalDimensions = _.pick(dimensions, ['width', 'height'])

              bucket.upload(params, (err, data) => {
                if (err) {
                  done()
                }

                createMediaFileData.url = `${isDev ? config.cdn_host : process.env.CDN_HOST}/${params.Key}`
                createMediaFileData.link = `${isDev ? config.cdn_host : process.env.CDN_HOST}/${params.Key}`
                done()
              })
            })

            stderr.on('data', (data) => {
              done()
            })
          })
      },
      function uploadThumbnail(done) {
        gm(request(url))
          .setFormat('jpeg')
          .stream((err, stdout, stderr) => {
            if (err) {
              return done()
            }

            const chunks = []
            stdout.on('data', (chunk) => {
              chunks.push(chunk)
            })

            stdout.on('end', () => {
              const buffer = Buffer.concat(chunks)
              const params = {
                ACL: 'public-read',
                ContentType: 'image/jpeg',
                Key: `thumb-${id}.jpeg`,
                Body: buffer
              }

              const dimensions = sizeOf(buffer)
              createMediaFileData.resizedDimensions = _.pick(dimensions, ['width', 'height'])

              bucket.upload(params, (err, data) => {
                if (err) {
                  done()
                }

                createMediaFileData.thumbnail = `${isDev ? config.cdn_host : process.env.CDN_HOST}/${params.Key}`
                done()
              })
            })

            stderr.on('data', (data) => {
              done()
            })
          })
      }
    ], function onEndUpload(err, results) {
      if (err) {
        return reject(err)
      }

      resolve(createMediaFileData)
    })
  })
}

// Strategies
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (email, password, done) => {
  return database.db.models.user.findOne({
    attributes: ['id', 'password', 'email', 'auth_token', 'preferences', 'createdAt'],
    where: {
      email: email.toLowerCase()
    }
  })
    .then((user) => {
      if (!user) {
        return done(null, false, {
          message: 'Email/password combination does not match'
        })
      }

      if (!user.isValidPassword(password)) {
        return done(null, false, {
          message: 'Email/password combination does not match'
        })
      }

      return done(null, user)
    })
    .catch((err) => {
      return done(err)
    })
}))

passport.use(new FacebookStrategy({
  clientID: !isDev ? process.env.FACEBOOK_CLIENT_ID : privateConfig.FACEBOOK.CLIENT_ID,
  clientSecret: !isDev ? process.env.FACEBOOK_CLIENT_SECRET : privateConfig.FACEBOOK.CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/api/v1/auth/facebook/callback',
  enableProof: true,
  profileFields: ['id', 'displayName', 'first_name', 'last_name', 'email', 'picture']
}, (accessToken, refreshToken, profile, done) => {
  database.db.models.user.findOne({
    where: {
      facebookId: profile.id
    }
  })
    .then((user) => {
      if (user) {
        return done(null, user)
      }

      uploadImage(profile.photos[0].value, profile.id)
        .then((data) => {
          const newUser = database.db.models.user.build({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            profilePicture: data.url,
            profilePictureThumb: data.thumbnail
          })

          newUser.facebookId = profile.id
          newUser.auth_token = accessToken

          return newUser.save()
        })
        .then((user) => {
          return done(null, user)
        })
        .catch((err) => {
          done(null, false, err)
        })
    })
    .catch((err) => {
      return done(err)
    })
}))

passport.use(new GoogleStrategy({
  clientID: !isDev ? process.env.GOOGLE_CLIENT_ID : privateConfig.GOOGLE.CLIENT_ID,
  clientSecret: !isDev ? process.env.GOOGLE_CLIENT_SECRET : privateConfig.GOOGLE.CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/api/v1/auth/google/callback',
  profileFields: ['id', 'displayName', 'first_name', 'last_name', 'email', 'picture']
}, (accessToken, refreshToken, profile, done) => {
  console.log()
  database.db.models.user.findOne({
    where: {
      googleId: profile.id
    }
  })
    .then((user) => {
      console.log()
      if (user) {
        return done(null, user)
      }

      uploadImage(profile.picture, profile.id)
        .then((data) => {
          const newUser = database.db.models.user.build({
            firstName: profile.given_name,
            lastName: profile.family_name,
            email: profile.email,
            profilePicture: data.url,
            profilePictureThumb: data.thumbnail
          })

          newUser.googleId = profile.id
          newUser.auth_token = accessToken

          return newUser.save()
        })
        .then((user) => {
          return done(null, user)
        })
        .catch((err) => {
          done(null, false, err)
        })
    })
    .catch((err) => {
      return done(err)
    })
}))

const router = express.Router()

router.post('/login', bruteforce.prevent, (req, res) => {
  passport.authenticate('local', (err, user, info) => {
    const errorMessage = 'Email/password combination does not match'

    if (err) {
      console.error(err)
    }

    if (!user) {
      return res.status(401).send({
        message: info || errorMessage,
        error: err
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
        const cookieOptions = {}

        if (req.body.remember === false) {
          cookieOptions.expires = 0;
        }

        const data = _.pick(user, ['id', 'email', 'auth_token', 'createdAt'])
        data.host = !isDev ? 'https://geekdev-movies4u.herokuapp.com/' : config.host

        if (req.body.redirect) {
          return res.redirect(req.body.redirect)
        }
        cookie.set(res, user.auth_token, cookieOptions)

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

router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email']
}))

router.get('/facebook/callback', (req, res) => {
  passport.authenticate('facebook', (err, user, info) => {
    if (err) {
      console.error(err)
    }

    if (!user) {
      return res.status(401).send({
        message: info,
        error: err
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
        cookie.set(res, user.auth_token)
        return res.redirect('/')
      })
      .catch((err) => {
        console.error(err)
        return res.status(400).send({
          message: err.description || err.message || err
        })
      })
  })(req, res)
})

router.get('/google', passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
}))

router.get('/google/callback', (req, res) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) {
      console.error(err)
    }

    if (!user) {
      return res.status(401).send({
        message: info,
        error: err
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
        cookie.set(res, user.auth_token)
        return res.redirect('/')
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
  req.session.destroy()
  delete req.user
  delete req.auth_token
  cookie.set(res, '')

  res.redirect('/')
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
          verificationUrl,
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
      user: _.pick(user.get({
        plain: true
      }), [
        'id', 'firstName', 'lastName', 'fullName', 'email'
      ])
    })

    sendEmail().catch(console.error)

    // clear cache on users and organisations admin lists
    req.cache.clear({
      key: 'users',
      global: true
    })
  }).catch((error) => {
    res.status(400)

    if (Array.isArray(error.errors) && error.errors.length && error.errors[0].path === 'email') {
      database.db.models.user.findAll({
        where: {
          email: req.body.email
        }
      })
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
            user: _.pick(user.get({
              plain: true
            }), [
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
    return res.status(400).send({
      message: 'Email is required'
    })
  }

  return database.db.models.user.findOne({
    attributes: ['id', 'firstName', 'lastName'],
    where: {
      email: userEmail.toLowerCase()
    }
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
            token,
            resetUrl,
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
    .then((user) => {
      if (!user) {
        return res.status(400).send({
          message: 'Invalid or expired token'
        })
      }

      return res.status(200).send()
    })
})

router.post('/reset/:token', (req, res) => {
  const {
    password
  } = req.body

  if (!password) {
    return res.status(400).send({
      message: 'Password is required'
    })
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
    .then((user) => {
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
    })
    .catch(() => {
      return res.status(500).send()
    })
})

module.exports = router
