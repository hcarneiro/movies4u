const User = require('../../api/models/user')

module.exports.type = 'localPassport'

module.exports.validate = (req, res, serverData) => {
  return User.findOne({
    where: serverData,
    attributes: [
      'id',
      'email',
      'firstName',
      'lastName',
      'createdAt'
    ]
  })
}

module.exports.logout = (req) => {
  delete req.session.server.passports.localPassport
  delete req.session.accounts.localPassport

  return Promise.resolve()
}
