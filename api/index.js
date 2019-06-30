const express = require('express')
const router = express.Router()
const appPackage = require('../package')

router.get('/', (req, res) => {
  let user

  if (req.user) {
    user = req.user.get({ plain: true })
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
