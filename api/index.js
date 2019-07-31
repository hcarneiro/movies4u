const _ = require('lodash')
const express = require('express')
const router = express.Router()
const appPackage = require('../package')

const userAttributes = ['id', 'email', 'auth_token', 'firstName', 'lastName', 'preferences', 'userBio', 'userCountry', 'userCity', 'profilePicture', 'createdAt', 'facebookId', 'googleId']

router.get('/', (req, res) => {
  let user

  if (req.user) {
    user = _.pick(req.user, userAttributes)
    user.auth_token = req.auth_token
  }

  res.send({
    status: 'ok',
    environment: process.env.NODE_ENV,
    version: appPackage.version,
    user
  })
})

module.exports = router
