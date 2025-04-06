import { Router } from 'express';
import chapterController from '@/controllers/ChapterController';
var { uploadChapter: upload } = require('../config/multer');

const router = Router();

router.post('/create/:slug', upload.array("images", 100), chapterController.createChapter);
router.get('/:slug/:chapter', chapterController.getChapter);
router.get('/:slug', chapterController.getChapters);

export default router;