const User = require('../models/user.js')
const { error400, error401, error500 } = require('../utils/errors')
const Token = require('../utils/token')
const sha256 = require('crypto-js/sha256')
const jwt = require('jsonwebtoken')

const login = (req, res) => {
  User.find({
    email: req.body.email,
    password: sha256(req.body.password).toString(),
  })
    .then(result => {
      if (result && result.length > 0) {
        res.send({ accessToken: Token.generate(result[0].email) })
      } else {
        error401(res, 'Email or password incorrect')
      }
    })
    .catch(err => {
      error500(res, err)
    })
}

const google = (req, res) => {
  User.findOne({ username: req.body.username })
    .then(user => {
      if (user) {
        res.send({ accessToken: Token.generate(user.email) })
      } else {
        error401(res, 'Email or password incorrect')
      }
    })
    .catch(err => {
      error500(res, err)
    })
}

const register = (req, res) => {
  let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ //Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial
  if (regex.test(req.body.password)) {
    const newUser = new User({
      email: req.body.email,
      username: req.body.username,
      password: sha256(req.body.password),
      avatar: 'img/users/default-avatar.jpg',
    })

    newUser
      .save()
      .then(result => {
        res.status(200).send({ email: result.email })
      })
      .catch(err => {
        error400(res, err)
      })
  } else {
    error400(res, { message: 'Invalid password' })
  }
}

const secret = 'secret'
const validate = (req, res) => {
  let token = req.headers['authorization']
  if (token) {
    token = token.substring(7)
    let result
    try {
      result = jwt.verify(token, secret)
    } catch (e) {
      console.error('Token could not be validated')
    }
    if (result) {
      res.status(204).send()
    } else {
      error401(res, 'Not Authorized')
    }
  } else {
    error401(res, 'Not Authorized')
  }
}

module.exports = {
  login,
  /* facebook, */
  google,
  register,
  validate,
}
