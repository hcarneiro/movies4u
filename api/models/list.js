const Sequelize = require('sequelize')
const database = require('../../config/database')

const List = database.db.define('list', {
  title: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.TEXT
  },
  categories: {
    type: Sequelize.JSONB,
    defaultValue: []
  },
  thumbnail: {
    type: Sequelize.STRING
  },
  movies: {
    type: Sequelize.JSONB,
    defaultValue: []
  },
  public: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  creatorId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  paranoid: true
})

module.exports = List
