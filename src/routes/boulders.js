const express = require('express')

const router = express.Router()
const boulderController = require('../controllers/boulder')

router.get('/', boulderController.findAll)
router.get('/achievements', boulderController.findAllAchievements)
router.get('/grades', boulderController.getGrades)
router.get('/:id', boulderController.findOne)
router.post('/', boulderController.create)
router.delete('/:id', boulderController.remove)
router.put('/:id', boulderController.update)

router.get('/:id/achievements', boulderController.getAchievements)
router.post('/:id/achievements', boulderController.postAchievement)

router.get('/:id/comments', boulderController.getComments)
router.post('/:id/comments', boulderController.postComment)
router.delete('/:id/comments/:comment', boulderController.deleteComment)

module.exports = router
