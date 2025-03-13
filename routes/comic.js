var express = require('express');
var router = express.Router();
var { uploadComic: upload } = require('../config/multer');

const comicController = require('../controllers/ComicController');

router.post('/create', upload.single("coverImage"), comicController.createComic);
router.get('/hot', comicController.getHotComics);
router.get('/detail/:slug', comicController.getComic);
router.get('/page/:page', comicController.getOnePageComic)
router.get('/comic-page', comicController.getAllComics);
router.get('/', comicController.getComic);

module.exports = router;
