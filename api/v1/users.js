const express = require('express')
const router = express.Router()
const authenticate = require('../../config/authenticate')
const database = require('../../config/database')
const userAttributes = require('../../config/user-attributes')
const _ = require('lodash')

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

router.delete('/:id', (req, res) => {
  if (typeof req.params.id === 'undefined') {
    res.status(400).send({
      message: 'Could not delete this account. Please try again.'
    })
  }

  database.db.models.user.findOne({
    where: {
      id: req.params.id
    }
  })
    .then((user) => {
      return user.destroy()
    })
    .then(() => {
      res.send()
    })
    .catch((err) => {
      res.status(400).send(err)
    })
})

module.exports = router
