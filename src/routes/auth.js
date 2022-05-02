const express = require('express')

const router = express.Router()
const authController = require('../controllers/auth')

router.post('/login', authController.login)
/* router.post('/facebook', authController.facebook) */
/* router.post('/google', authController.google) */
router.post('/register', authController.register)
router.get('/validate', authController.validate)

module.exports = router
