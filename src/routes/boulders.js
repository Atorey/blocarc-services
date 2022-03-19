const express = require('express');

const router = express.Router();
const boulderController = require('../controllers/boulder');

router.get('/', boulderController.findAll);
router.get('/:id', boulderController.findOne);
router.post('/', boulderController.create);
router.delete('/:id', boulderController.remove);
router.put('/:id', boulderController.update);

router.get('/:id/comments', boulderController.getComments);
router.get('/:id/comments', boulderController.postComment);

module.exports = router;