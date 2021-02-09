const express = require('express');
const router = express.Router();

const aktivnostController = require('../controllers/aktivnostController');

router.post('/',aktivnostController.create);
router.get('/',aktivnostController.findAll);
router.get('/:id',aktivnostController.findById);
router.put('/:id',aktivnostController.update);
router.delete('/:id',aktivnostController.delete);

module.exports=router;