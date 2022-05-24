const jwt = require('jsonwebtoken')

const User = require('../models/user.js')

const { error404 } = require('../utils/errors')

//TODO: Crear función que cambie el atributo 'mine' de boulder en el caso de que el creador coincida con el usuario logeado
//TODO: Crear servicio GET /boulders?creator={id} para obetener los bloques de un creador

const findMe = (req, res) => {
  const userLoged = jwt.decode(req.headers['authorization'].substring(7)).login
  User.findOne({ email: userLoged })
    .then(result => {
      if (result) {
        result.me = true
        res.status(200).send({ user: result })
      } else {
        error404(res, 'User not found')
      }
    })
    .catch(() => {
      error404(res, 'User not found')
    })
}

const findOne = (req, res) => {
  User.findById(req.params['id'])
    .then(result => {
      if (result) {
        result.me = false
        res.status(200).send({ user: result })
      } else {
        error404(res, 'User not found')
      }
    })
    .catch(() => {
      error404(res, 'User not found')
    })
}

module.exports = {
  findMe,
  findOne,
}
