const path = require('path')
const _ = require('lodash')
const database = require('../../config/database')

const Models = {
  User: require(path.resolve(__dirname, './user.js')),
  List: require(path.resolve(__dirname, './list.js')),
  ListUser: require(path.resolve(__dirname, './listUser.js'))
}

Models.List.belongsToMany(Models.User, { through: Models.ListUser })
Models.User.belongsToMany(Models.List, { through: Models.ListUser })

// { force: true } - TO REMOVE ROW
database.db.sync()
  // .then(function () {
  //   console.log('Migration completed.');
  //   return Promise.resolve();
  // });
