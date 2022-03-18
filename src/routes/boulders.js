const express = require('express');

let Boulder = require(__dirname + '/../models/boulder.js');

let router = express.Router();

let error400 = (res, err) => res.status(400).send({ statusCode: '400', message: err.message, error: 'Bad Request' })
let error404 = (res, message) => res.status(404).send({ statusCode: '404', message: message, error: 'Not found' });
let error500 = (res, err) => res.status(500).send({ statusCode: '500', message: err.message, error: 'Internal Server Error' });
let error403 = (res, message) => res.status(403).send({ statusCode: '403', message: message, error: "Forbidden" });

//TODO: Crear función que cambie el atributo 'mine' de boulder en el caso de que el creador coincida con el usuario logeado

router.get('/', (req, res) => {
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
});

router.get('/:id', (req, res) => {
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
});

router.post('/', (req, res) => {
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
});

router.delete('/:id', (req, res) => {
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
});

router.put('')

module.exports = router;