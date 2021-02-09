const express = require('express');
const router = express.Router();

const grupaController = require('../controllers/grupaController');

router.post('/',grupaController.create);
router.get('/',grupaController.findAll);
router.get('/:id',grupaController.findById);
router.put('/:id',grupaController.update);
router.delete('/:id',grupaController.delete);

module.exports=router;