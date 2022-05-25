const express = require('express')

const router = express.Router()
const userController = require('../controllers/user')

router.get('/me', userController.findMe)
router.get('/timer', userController.getTimer)
router.get('/:id', userController.findOne)

router.put('/timer', userController.postTimer)

module.exports = router
