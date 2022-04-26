const express = require('express')

const router = express.Router()
const wallController = require('../controllers/wall')
const { protectRoute } = require('../utils/token')

router.get('/', protectRoute(), wallController.findAll)
/* router.get('/:id', wallController.findOne); */
router.post('/', protectRoute(), wallController.create)
/* router.delete('/:id', wallController.remove);
router.put('/:id', wallController.update); */

module.exports = router
