const express = require('express')

const router = express.Router()
const userController = require('../controllers/user')

router.get('/me', userController.findMe)
router.get('/timer', userController.getTimer)
router.get('/pull-ups', userController.getPullUps)
router.get('/goal', userController.getGoal)
router.get('/achievements', userController.getAchievements)
router.get('/last-achieved', userController.findLastAchieved)
router.get('/:id', userController.findOne)

router.put('/timer', userController.postTimer)
router.put('/pull-ups', userController.postPullUps)
router.put('/goal', userController.postGoal)

module.exports = router
