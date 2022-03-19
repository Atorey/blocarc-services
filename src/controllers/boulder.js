const fs = require('fs');

const Boulder = require('../models/boulder.js');
const { error400, error403, error404, error500 } = require('../utils/errors')
const saveImage = require('../utils/uploadImage')

//TODO: Crear función que cambie el atributo 'mine' de boulder en el caso de que el creador coincida con el usuario logeado

const findAll = (req, res) => {
    Boulder.find()
        .then(result => {
            if (result && result.length > 0) {
                res.status(200)
                    .send({ boulders: result });
            }
            else {
                error404(res, 'Boulders not found');
            }
        }).catch((err) => {
            error500(res, err);
        });
};

const findOne = (req, res) => {
    Boulder.findById(req.params['id'])
        .then(result => {
            if (result) {
                res.status(200)
                    .send({ boulder: result });
            }
            else {
                error404(res, 'Boulder not found');
            }
        }).catch(() => {
            error404(res, 'Boulder not found');
        });
};

const create = async (req, res) => {
    const imageUrl = await saveImage(
        'boulders',
        req.body.image
    );
    const newBoulder = new Boulder({
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
    });

    newBoulder.save()
        .then(result => {
            res.status(200)
                .send({ boulder: result });
        }).catch(err => {
            fs.unlinkSync('./public/' + imageUrl);
            error400(res, err);
        })
};

const remove = (req, res) => {
    Boulder.findById(req.params['id'])
        .then(result => {
            if (result) {
                if (result.mine) {
                    Boulder.deleteOne({ _id: result.id })
                        .then(() => {
                            res.status(200).send()
                        }).catch(err => {
                            error500(res, err);
                        });
                }
                else {
                    error403(res, 'This is not your boulder');
                }
            }
            else {
                error404(res, 'Boulder not found');
            }
        }).catch(() => {
            error404(res, 'Boulder not found');
        });
};

const update = (req, res) => {
    Boulder.findById(req.params['id'])
        .then(async (result) => {
            if (!result) {
                error404(res, 'Boulder not found');
            }
            else if (result && !result.mine) {
                error403(res, 'This is not your boulder');
            }
            else {
                const imageUrl = await saveImage(
                    'boulders',
                    req.body.image
                );

                Boulder.findByIdAndUpdate(result.id, {
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
                            .send({ boulder: result });
                    }).catch((err) => {
                        error400(res, err);
                    })
            }
        }).catch(() => {
            error404(res, 'Boulder not found');
        });
}

const getComments = (req, res) => {
    Boulder.findById(req.params['id'])
        .then(result => {
            if (result) {
                res.status(200)
                    .send({ comments: result.comments });
            }
            else {
                error404(res, 'Boulder not found');
            }
        }).catch(() => {
            error404(res, 'Boulder not found');
        });
}

const postComment = (req, res) => {
    Boulder.findById(req.params['id'])
        .then(result => {
            if (result) {
                Boulder.findByIdAndUpdate(result.id, {
                    $push: {
                        comments: [{ "comment": req.body.comment }]
                    }
                }, { new: true })
                    .then(result => {
                        res.status(200)
                            .send(result.comments[result.comments.length - 1]);
                    }).catch((err) => {
                        error400(res, err);
                    })
            }
            else {
                error404(res, 'Boulder not found');
            }
        }).catch(() => {
            error404(res, 'Boulder not found');
        });
}

const deleteComment = (req, res) => {
    Boulder.findById(req.params['id'])
        .then(result => {
            if (!result) {
                error404(res, 'Boulder not found');
            }
            //TODO: añadir a la condición si el usuario actual no es el autor del comentario. Por ejemplo: result.mine || result.comment.user === loguedUser
            else if (!result.mine) {
                error403(res, 'You are not authorized to delete this comment');
            }
            else {
                if (result.comments.some(comment => comment.id === req.params['comment'])) {
                    Boulder.updateOne(result.id, {
                        $pull: {
                            comments: { _id: req.params['comment'] }
                        }
                    }, { new: true })
                        .then(() => {
                            res.status(200).send();
                        }).catch((err) => {
                            error400(res, err);
                        })
                }
                else {
                    error404(res, 'Comment not found');
                }
            }
        }).catch(() => {
            error404(res, 'Boulder not found');
        });
}

module.exports = {
    findAll,
    findOne,
    create,
    remove,
    update,
    getComments,
    postComment,
    deleteComment
}