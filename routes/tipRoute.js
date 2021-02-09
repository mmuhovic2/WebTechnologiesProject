const express = require('express');
const router = express.Router();

const tipController = require('../controllers/tipController');

router.post('/',tipController.create);
router.get('/',tipController.findAll);
router.get('/:id',tipController.findById);
router.put('/:id',tipController.update);
router.delete('/:id',tipController.delete);

module.exports=router;