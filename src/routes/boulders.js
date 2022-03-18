const express = require('express');

const router = express.Router();
const boulderController = require('../controllers/boulder');

router.get('/', boulderController.findAll);
router.get('/:id', boulderController.findOne);
router.post('/', boulderController.uploadImage, boulderController.create);
router.delete('/:id', boulderController.remove);
router.put('/:id', boulderController.update);

module.exports = router;