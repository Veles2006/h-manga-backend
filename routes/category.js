var express = require('express');
var router = express.Router();

const categoryController = require('../controllers/CategoryController');

router.post('/create', categoryController.createCategory);
router.get('/', categoryController.getAllCategories);

module.exports = router;