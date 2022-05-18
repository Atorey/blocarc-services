const express = require('express')

const router = express.Router()
const userController = require('../controllers/user')

router.get('/me', userController.findMe)
router.get('/:id', userController.findOne)

module.exports = router
