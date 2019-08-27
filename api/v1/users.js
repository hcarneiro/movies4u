const express = require('express')
const router = express.Router()
const _ = require('lodash')
const authenticate = require('../../config/authenticate')
const database = require('../../config/database')
const userAttributes = require('../../config/user-attributes')

router.use(authenticate)

router.get('/', (req, res) => {
  if (req.user) {
    const user = req.user
    user.auth_token = req.auth_token

    res.send({
      user
    })
  }
})

router.put('/', (req, res) => {
  database.db.models.user.findOne({
    where: { id: req.user.id }
  })
    .then((user) => {
      [
        'firstName',
        'lastName',
        'email',
        'userBio',
        'userCity',
        'userCountry',
        'profilePicture',
        'profilePictureThumb',
        'preferences'
      ].forEach((param) => {
        if (typeof req.body[param] !== 'undefined') {
          user[param] = req.body[param]
        }
      })

      if (req.body.newPassword) {
        if (!req.body.password) {
          return Promise.reject(new Error('The current password is required in order to update your password.'))
        }

        if (!user.isValidPassword(req.body.password)) {
          return Promise.reject(new Error('The current password is not valid. Please try again.'))
        }

        user.setPassword(req.body.newPassword)
      }

      user.save()
      return user
    })
    .then((user) => {
      res.send({
        user: _.pick(user, userAttributes)
      })
    })
    .catch((err) => {
      res.status(400)

      // Better error from sequelize rejections when the email is duplicate
      if (Array.isArray(err.errors) && err.errors.length && err.errors[0].path === 'email') {
        return res.send({
          message: 'This email address is already in use in our system.'
        })
      }

      res.send({
        message: err.message || err.description || err
      })
    })
})

module.exports = router
