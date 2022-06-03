const express = require('express')
const router = express.Router()
const wallController = require('../controllers/wall')
const { protectRoute } = require('../utils/token')

router.get('/', protectRoute, wallController.findAll)
router.post('/', protectRoute, wallController.create)

module.exports = router
