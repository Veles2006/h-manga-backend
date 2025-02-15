var express = require('express');
var router = express.Router();

const siteController = require('../controllers/SiteController');

router.get('/api/users', siteController.users);

module.exports = router;