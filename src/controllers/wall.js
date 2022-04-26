const fs = require('fs')

const Wall = require('../models/wall.js')
const { error400, error404, error500 } = require('../utils/errors')
const saveImage = require('../utils/uploadImage')

//TODO: Crear función que cambie el atributo 'mine' de wall en el caso de que el creador coincida con el usuario logeado
//TODO: Crear servicio GET /boulders?creator={id} para obetener los bloques de un creador

const findAll = (req, res) => {
  Wall.find()
    .then(result => {
      if (result && result.length > 0) {
        res.status(200).send({ walls: result })
      } else {
        error404(res, 'Wall not found')
      }
    })
    .catch(err => {
      error500(res, err)
    })
}

const create = async (req, res) => {
  const imageUrl = await saveImage('walls', req.body.image)
  const newWall = new Wall({
    name: req.body.name,
    section: req.body.section,
    image: imageUrl,
    coordHolds: req.body.coordHolds,
  })

  newWall
    .save()
    .then(result => {
      res.status(200).send({ wall: result })
    })
    .catch(err => {
      fs.unlinkSync('./public/' + imageUrl)
      error400(res, err)
    })
}

module.exports = {
  findAll,
  create,
}
