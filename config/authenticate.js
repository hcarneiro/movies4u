const path = require('path')
const _ = require('lodash')
const User = require('../api/models/user')
const cookie = require(path.resolve(__dirname, './cookie'))

const userAttributes = ['id', 'email', 'auth_token', 'firstName', 'lastName', 'preferences', 'userBio', 'userCountry', 'userCity', 'profilePicture', 'createdAt', 'facebookId', 'googleId']

function authenticate(req, res, next) {
  loadUser(req, res, () => {
    if (!req.auth_token) {
      return res.status(401).send({
        error: 'auth_token not provided',
        message: 'Please include a valid auth_token when accessing this resource.'
      })
    }

    if (!req.user) {
      const errorMessage = req.authenticationError || 'The auth_token provided doesn\'t belong to any user'

      return res.status(401).send({
        error: 'not authorised',
        message: errorMessage
      })
    }

    next()
  })
};

module.exports = authenticate

function loadUser(req, res, next) {
  req.auth_token = req.query.auth_token ||
    req.body.auth_token ||
    req.headers['auth-token'] ||
    req.cookies.auth_token

  if (req.isAuthenticated()) {
    return next()
  }

  if (req.user) {
    return next()
  }

  if (!req.session) {
    return next()
  }

  if (Array.isArray(req.auth_token)) {
    req.auth_token = _.last(req.auth_token)
  }

  if (!req.auth_token) {
    return next()
  }

  User.findOne({
    attributes: userAttributes,
    where: {
      auth_token: req.auth_token
    }
  }).then((user) => {
    if (!user) {
      return next()
    }

    req.login(user, function(err) {
      if (err) {
        return next(err)
      }

      // Renew cookie when forced to be set
      if (req.query.setCookie) {
        cookie.set(res, req.auth_token)
      }

      next()
    })
  }, next)
}

module.exports.loadUser = loadUser
