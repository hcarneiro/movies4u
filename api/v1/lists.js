const express = require('express')
const router = express.Router()
const _ = require('lodash')
const authenticate = require('../../config/authenticate')
const database = require('../../config/database')
const userAttributes = require('../../config/user-attributes')
const attributes = ['id', 'title', 'description', 'thumbnail', 'categories', 'movies', 'public', 'creatorId', 'createdAt', 'updatedAt']

router.get('/all', (req, res) => {
  database.db.models.list.findAll({
    where: {
      public: true
    },
    order: [
      ['createdAt', 'DESC']
    ]
  })
    .then((lists) => {
      res.send(lists)
    })
    .catch((err) => {
      res.status(400).send(err)
    })
})

router.get('/', authenticate, (req, res) => {
  database.db.models.user.findOne({
    where: { id: req.user.id }
  })
    .then((user) => {
      return user.getLists({
        attributes,
        include: [{
          model: database.db.models.user,
          attributes: userAttributes
        }],
        order: [
          ['createdAt', 'DESC']
        ]
      })
    })
    .then((lists) => {
      res.send(lists)
    })
    .catch((error) => {
      res.status(400).send(error)
    })
})

router.get('/:id', (req, res) => {
  database.db.models.list.findOne({
    attributes,
    where: {
      id: req.params.id
    },
    include: [{
      model: database.db.models.user,
      attributes: ['id', 'firstName', 'lastName', 'email']
    }]
  })
    .then((list) => {
      if (list.public) {
        return res.send(list)
      }

      const foundUser = _.find(list.users, { id: req.user.id })
      if (foundUser) {
        return res.send(list)
      }

      res.status(400).send({
        message: "You don't have permission to see this list"
      })
    })
    .catch((error) => {
      res.status(400).send(error)
    })
})

router.put('/:id', authenticate, (req, res) => {
  database.db.models.list.findOne({
    where: {
      id: req.params.id
    },
    include: [{
      model: database.db.models.user,
      attributes: ['id', 'firstName', 'lastName', 'email']
    }]
  })
    .then((list) => {
      const foundUser = _.find(list.users, { id: req.user.id })
      if (!foundUser) {
        return Promise.reject(new Error("You don't have permission to see this list"))
      }

      [
        'title',
        'description',
        'thumbnail',
        'public',
        'movies',
        'creatorId'
      ].forEach(function (param) {
        if (typeof req.body[param] !== 'undefined') {
          list[param] = req.body[param]
        }
      })

      return list.save()
    })
    .then((list) => {
      return res.send(list)
    })
    .catch((error) => {
      res.status(400).send(error)
    })
})

router.put('/:id/add-movie', authenticate, (req, res) => {
  database.db.models.list.findOne({
    attributes,
    where: {
      id: req.params.id
    },
    include: [{
      model: database.db.models.user,
      attributes: ['id', 'firstName', 'lastName', 'email']
    }]
  })
    .then((list) => {
      const foundUser = _.find(list.users, { id: req.user.id })
      if (!foundUser) {
        return Promise.reject(new Error("You don't have permission to see this list"))
      }

      req.body.categories.forEach((category) => {
        list.categories.push(category)
      })
      const categories = _.uniqBy(list.categories, 'id')
      const movies = list.movies
      const movie = req.body.item
      movie.type = req.body.type
      movies.push(movie)

      return list.update({
        categories,
        movies
      })
    })
    .then((list) => {
      return res.send(list)
    })
    .catch((error) => {
      res.status(400).send(error)
    })
})

router.post('/', authenticate, (req, res) => {
  let listResponse

  database.db.models.list.create(req.body)
    .then((list) => {
      listResponse = list
      return database.db.models.user.findOne({
        where: { id: req.user.id }
      })
    })
    .then((user) => {
      return listResponse.addUser(user)
    })
    .then(() => {
      return database.db.models.list.findOne({
        attributes,
        where: {
          id: listResponse.id
        },
        include: [{
          model: database.db.models.user,
          attributes: ['id', 'firstName', 'lastName', 'email']
        }]
      })
    })
    .then((list) => {
      res.send(list)
    })
    .catch((error) => {
      res.status(400).send(error)
    })
})

router.delete('/:id', authenticate, (req, res) => {
  database.db.models.list.findOne({
    where: {
      id: req.params.id
    }
  })
    .then((list) => {
      return list.destroy()
    })
    .then(() => {
      res.send()
    })
    .catch((error) => {
      res.status(400).send(error)
    })
})

module.exports = router
