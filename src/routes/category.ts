import { Router } from "express";
import categoryController from '@/controllers/CategoryController';

const router = Router();

router.post('/create', categoryController.createCategory);
router.get('/', categoryController.getAllCategories);

export default router;