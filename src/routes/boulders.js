const express = require('express')

const router = express.Router()
const boulderController = require('../controllers/boulder')

router.get('/', boulderController.findAll)
router.get('/grades', boulderController.getGrades)
router.get('/achievements', boulderController.findAllAchievements)
router.get('/saved', boulderController.findAllBouldersMarks)
router.get('/like', boulderController.findAllLikes)
router.get('/:id', boulderController.findOne)
router.get('/:id/achievements', boulderController.getAchievements)

router.post('/', boulderController.create)
router.post('/:id/achievements', boulderController.postAchievement)
router.post('/:id/save', boulderController.postBoulderMark)
router.post('/:id/like', boulderController.postLike)

router.delete('/:id', boulderController.remove)
router.put('/:id', boulderController.update)

router.get('/:id/comments', boulderController.getComments)
router.post('/:id/comments', boulderController.postComment)
router.delete('/:id/comments/:comment', boulderController.deleteComment)

module.exports = router
