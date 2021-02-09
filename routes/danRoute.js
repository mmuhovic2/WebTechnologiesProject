const express = require('express');
const router = express.Router();

const danController = require('../controllers/danController');

router.post('/', danController.create);
router.get('/' , danController.findAll);
router.get('/:id', danController.findById);
router.put('/:id', danController.update);
router.delete('/:id', danController.delete);

module.exports=router;