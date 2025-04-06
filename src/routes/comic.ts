import { Router } from "express";
import comicController from "@/controllers/ComicController";
var { uploadComic: upload } = require('../config/multer');

const router = Router();

router.post('/create', upload.single("coverImage"), comicController.createComic);
router.get('/hot', comicController.getHotComics);
router.get('/detail/:slug', comicController.getComic);
router.get('/page/:page', comicController.getOnePageComic)
router.get('/comic-page', comicController.getAllComics);
router.get('/search', comicController.searchComics);
router.get('/', comicController.getComic);

export default router;
