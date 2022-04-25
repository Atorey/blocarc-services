const fs = require("fs");

const Wall = require("../models/wall.js");
const { error400, error403, error404, error500 } = require("../utils/errors");
const saveImage = require("../utils/uploadImage");

//TODO: Crear función que cambie el atributo 'mine' de wall en el caso de que el creador coincida con el usuario logeado
//TODO: Crear servicio GET /boulders?creator={id} para obetener los bloques de un creador

const findAll = (req, res) => {
  Wall.find()
    .then((result) => {
      if (result && result.length > 0) {
        res.status(200).send({ walls: result });
      } else {
        error404(res, "Wall not found");
      }
    })
    .catch((err) => {
      error500(res, err);
    });
};

const findOne = (req, res) => {
  /* Wall.findById(req.params['id'])
        .then(result => {
            if (result) {
                res.status(200)
                    .send({ wall: result });
            }
            else {
                error404(res, 'wall not found');
            }
        }).catch(() => {
            error404(res, 'wall not found');
        }); */
};

const create = async (req, res) => {
  const imageUrl = await saveImage("walls", req.body.image);
  const newWall = new Wall({
    name: req.body.name,
    section: req.body.section,
    image: imageUrl,
    coordHolds: req.body.coordHolds,
  });

  newWall
    .save()
    .then((result) => {
      res.status(200).send({ wall: result });
    })
    .catch((err) => {
      fs.unlinkSync("./public/" + imageUrl);
      error400(res, err);
    });
};

const remove = (req, res) => {
  /* wall.findById(req.params['id'])
        .then(result => {
            if (result) {
                if (result.mine) {
                    wall.deleteOne({ _id: result.id })
                        .then(() => {
                            res.status(200).send()
                        }).catch(err => {
                            error500(res, err);
                        });
                }
                else {
                    error403(res, 'This is not your wall');
                }
            }
            else {
                error404(res, 'wall not found');
            }
        }).catch(() => {
            error404(res, 'wall not found');
        }); */
};

const update = (req, res) => {
  /* wall.findById(req.params['id'])
        .then(async (result) => {
            if (!result) {
                error404(res, 'wall not found');
            }
            else if (result && !result.mine) {
                error403(res, 'This is not your wall');
            }
            else {
                const imageUrl = await saveImage(
                    'boulders',
                    req.body.image
                );

                wall.findByIdAndUpdate(result.id, {
                    $set: {
                        name: req.body.name,
                        grade: req.body.grade,
                        wall: req.body.wall,
                        section: req.body.section,
                        share: req.body.share,
                        image: imageUrl,
                        coordHolds: req.body.coordHolds,
                        creationDate: req.body.creationDate,
                        creator: req.body.creator,
                        mine: req.body.mine
                    }
                }, { new: true })
                    .then(result => {
                        res.status(200)
                            .send({ wall: result });
                    }).catch((err) => {
                        error400(res, err);
                    })
            }
        }).catch(() => {
            error404(res, 'wall not found');
        }); */
};

module.exports = {
  findAll,
  findOne,
  create,
  remove,
  update,
};
