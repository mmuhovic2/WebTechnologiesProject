const express = require('express');
const router = express.Router();

const predmetController = require('../controllers/predmetController');

router.post('/',predmetController.create);
router.get('/',predmetController.findAll);
router.get('/:id',predmetController.findById);
router.put('/:id',predmetController.update);
router.delete('/:id',predmetController.delete);

module.exports=router;