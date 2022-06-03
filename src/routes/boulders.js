const express = require('express')
const router = express.Router()
const boulderController = require('../controllers/boulder')
const { protectRoute } = require('../utils/token')

router.get('/', protectRoute, boulderController.findAll)
router.get('/grades', protectRoute, boulderController.getGrades)
router.get('/achieved', protectRoute, boulderController.findAllBouldersAchieved)
router.get('/saved', protectRoute, boulderController.findAllBouldersMarks)
router.get('/like', protectRoute, boulderController.findAllLikes)
router.get('/:id', protectRoute, boulderController.findOne)
router.get('/:id/achievements', protectRoute, boulderController.getAchievements)

router.post('/', protectRoute, boulderController.create)
router.post('/:id/achievements', protectRoute, boulderController.postAchievement)
router.post('/:id/save', protectRoute, boulderController.postBoulderMark)
router.post('/:id/like', protectRoute, boulderController.postLike)

router.put('/:id', protectRoute, boulderController.update)

router.delete('/:id/like', protectRoute, boulderController.removeLike)
router.delete('/:id/achievement', protectRoute, boulderController.removeAchievement)
router.delete('/:id/save', protectRoute, boulderController.removeBoulderMark)
router.delete('/:id', protectRoute, boulderController.remove)

module.exports = router
