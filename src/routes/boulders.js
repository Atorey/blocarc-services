const express = require('express');

let Boulder = require(__dirname + '/../models/boulder.js');

let router = express.Router();

//TODO: Crear función que cambie el atributo 'mine' de boulder en el caso de que el creador coincida con el usuario logeado

router.get('/', (req, res) => {
    Boulder.find()
        .then(result => {
            if (result && result.length > 0) {
                res.status(200)
                    .send({ boulders: result });
            }
            else {
                res.status(404)
                    .send({ statusCode: '404', message: 'Boulders not found', error: 'Not found' });
            }
        }).catch((err) => {
            res.status(500)
                .send({ statusCode: '500', message: err.message, error: 'Internal Server Error' });
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
                res.status(404)
                    .send({ statusCode: '404', message: 'Boulder not found', error: 'Not found' })
            }
        }).catch((err) => {
            res.status(500)
                .send({ statusCode: '500', message: err.message, error: 'Internal Server Error' });
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
                .send({boulder: result});
        }).catch(err => {
            res.status(400)
                .send({statusCode: '400', message: err.message, error: 'Bad Request'})
        })
});

//TODO: Añadir un error 403 si se intenta borrar un evento que no es nuestro
router.delete('/:id', (req, res) => {
    Boulder.findByIdAndRemove(req.params['id'])
        .then(result => {
            res.status(200).send();
        }).catch(err => {
            res.status(400)
                .send({statusCode: '400'})
        })
})

module.exports = router;