var express = require('express');
var router = express.Router();
var upload = require('../config/multer');

const comicController = require('../controllers/ComicController');

router.post('/create', upload.single("coverImage"), comicController.createComic);
router.get('/', comicController.getAllComics);

module.exports = router;
