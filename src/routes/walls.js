const express = require("express");

const router = express.Router();
const wallController = require("../controllers/wall");

router.get("/", wallController.findAll);
/* router.get('/:id', wallController.findOne); */
router.post("/", wallController.create);
/* router.delete('/:id', wallController.remove);
router.put('/:id', wallController.update); */

module.exports = router;
