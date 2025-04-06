import { Router } from "express";
import siteController from "@/controllers/SiteController";

const router = Router();

router.get('/api/users', siteController.users);

export default router;