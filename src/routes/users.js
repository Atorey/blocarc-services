const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const { protectRoute } = require('../utils/token')

router.get('/me', protectRoute, userController.findMe)
router.get('/timer', protectRoute, userController.getTimer)
router.get('/pull-ups', protectRoute, userController.getPullUps)
router.get('/goal', protectRoute, userController.getGoal)
router.get('/achievements', protectRoute, userController.getAchievements)
router.get('/last-achieved', protectRoute, userController.findLastAchieved)
router.get('/:id', protectRoute, userController.findOne)

router.put('/timer', protectRoute, userController.postTimer)
router.put('/pull-ups', protectRoute, userController.postPullUps)
router.put('/goal', protectRoute, userController.postGoal)

module.exports = router
