const express = require('express')

const router = express.Router()
const boulderController = require('../controllers/boulder')

router.get('/', boulderController.findAll)
router.get('/grades', boulderController.getGrades)
router.get('/achieved', boulderController.findAllBouldersAchieved)
router.get('/saved', boulderController.findAllBouldersMarks)
router.get('/like', boulderController.findAllLikes)
router.get('/:id', boulderController.findOne)
router.get('/:id/achievements', boulderController.getAchievements)

router.post('/', boulderController.create)
router.post('/:id/achievements', boulderController.postAchievement)
router.post('/:id/save', boulderController.postBoulderMark)
router.post('/:id/like', boulderController.postLike)

router.put('/:id', boulderController.update)

router.delete('/:id/like', boulderController.removeLike)
router.delete('/:id/achievement', boulderController.removeAchievement)
router.delete('/:id/save', boulderController.removeBoulderMark)
router.delete('/:id', boulderController.remove)

router.get('/:id/comments', boulderController.getComments)
router.post('/:id/comments', boulderController.postComment)
router.delete('/:id/comments/:comment', boulderController.deleteComment)

module.exports = router
