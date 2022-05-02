const express = require('express')

const router = express.Router()
const boulderController = require('../controllers/boulder')

router.get('/', boulderController.findAll)
router.get('/grades', boulderController.getGrades)
router.get('/:id', boulderController.findOne)
router.post('/', boulderController.create)
router.delete('/:id', boulderController.remove)
router.put('/:id', boulderController.update)

router.get('/:id/comments', boulderController.getComments)
router.post('/:id/comments', boulderController.postComment)
router.delete('/:id/comments/:comment', boulderController.deleteComment)

module.exports = router
