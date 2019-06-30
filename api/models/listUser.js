const database = require('../../config/database')

const ListUser = database.db.define('listUser', {})

module.exports = ListUser
