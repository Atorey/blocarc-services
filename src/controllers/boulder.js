const Boulder = require('../models/boulder.js');

const error400 = (res, err) => res.status(400).send({ statusCode: '400', message: err.message, error: 'Bad Request' })
const error404 = (res, message) => res.status(404).send({ statusCode: '404', message: message, error: 'Not found' });
const error500 = (res, err) => res.status(500).send({ statusCode: '500', message: err.message, error: 'Internal Server Error' });
const error403 = (res, message) => res.status(403).send({ statusCode: '403', message: message, error: "Forbidden" });

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
        }).catch((err) => {
            error404(res, 'Boulder not found');
        });
};

const create = (req, res) => {
    let newBoulder = new Boulder({
        name: req.body.name,
        grade: req.body.grade,
        wall: req.body.wall,
        section: req.body.section,
        share: req.body.share,
        image: req.body.image,
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
            error400(res, err);
        })
};

const remove = (req, res) => {
    Boulder.findById(req.params['id'])
        .then(result => {
            if (result) {
                if (result.mine === true) {
                    Boulder.findByIdAndRemove(req.params['id'])
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
    Boulder.findByIdAndUpdate(req.params['id'], {
        $set: {

        }
    })
};

module.exports = {
    findAll,
    findOne,
    create,
    remove,
    update
}