var express = require('express');
var router = express.Router();

const comicController = require('../controllers/ComicController');

router.post('/create', comicController.createComic);
router.get('/', comicController.getAllComics);

module.exports = router;
