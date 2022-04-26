const express = require('express')

const router = express.Router()
const boulderController = require('../controllers/boulder')
const { protectRoute } = require('../utils/token')

router.get('/', protectRoute(), boulderController.findAll)
router.get('/grades', protectRoute(), boulderController.getGrades)
router.get('/:id', protectRoute(), boulderController.findOne)
router.post('/', protectRoute(), boulderController.create)
router.delete('/:id', protectRoute(), boulderController.remove)
router.put('/:id', protectRoute(), boulderController.update)

router.get('/:id/comments', protectRoute(), boulderController.getComments)
router.post('/:id/comments', protectRoute(), boulderController.postComment)
router.delete('/:id/comments/:comment', protectRoute(), boulderController.deleteComment)

module.exports = router
