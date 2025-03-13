var express = require('express');
var router = express.Router();
var { uploadChapter: upload } = require('../config/multer');

const chapterController = require('../controllers/ChapterController');

router.post('/create/:slug', upload.array("images", 100), chapterController.createChapter);
router.get('/:slug', chapterController.getChapters);

module.exports = router;