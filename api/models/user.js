const _ = require('lodash')
const Sequelize = require('sequelize')
const bcrypt = require('bcrypt')
const saltRounds = 10
const md5 = require('md5')
const casual = require('casual')
const database = require('../../config/database')

const User = database.db.define('user', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  auth_token: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: true
  },
  resetPasswordToken: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: true
  },
  resetPasswordTokenExpires: {
    type: Sequelize.DATE,
    allowNull: true
  },
  verificationToken: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: true
  },
  verificationTokenExpires: {
    type: Sequelize.DATE,
    allowNull: true
  },
  lastAuthenticatedAt: {
    type: Sequelize.DATE,
    allowNull: true
  },
  userBio: {
    type: Sequelize.TEXT
  },
  userCity: {
    type: Sequelize.STRING
  },
  userCountry: {
    type: Sequelize.STRING
  },
  profilePicture: {
    type: Sequelize.STRING
  },
  preferences: {
    type: Sequelize.JSONB,
    allowNull: true,
    defaultValue: {}
  }
}, {
  paranoid: true,
  getterMethods: {
    fullName() {
      return [this.firstName, this.lastName].join(' ').trim()
    }
  },
  setterMethods: {
    fullName(value) {
      const names = value.split(' ')

      this.setDataValue('firstname', names.slice(0, -1).join(' '))
      this.setDataValue('lastname', names.slice(-1).join(' '))
    }
  }
})

User.prototype.generateAuthToken = function () {
  // Generates something like "c763d6786d53e0e6fb772823e737b2d8-657-290-0938"
  this.auth_token = `${md5(this.id)}-${casual.phone}`
  return this.save()
}

User.prototype.invalidateAuthToken = function () {
  this.auth_token = null
  return this.save()
}

User.prototype.isValidPassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

User.prototype.setPassword = function (value) {
  const salt = bcrypt.genSaltSync(saltRounds)
  const newPassword = bcrypt.hashSync(value, salt)

  const minLength = 6
  if (value.length < minLength) {
    throw new Error(`Your password is too short. Minimum length accepted is ${minLength} characters.`)
  }

  const maxLength = 128
  if (value.length > maxLength) {
    throw new Error(`Your password is too long. Maxiumum length accepted is ${maxLength} characters.`)
  }

  this.password = newPassword
}

module.exports = User
