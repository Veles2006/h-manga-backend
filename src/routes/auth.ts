import { Router } from "express";
import { register, sendConfirmationCode, verifyCode } from "@/controllers/AuthController";

const router = Router();

router.post('/register', register);
router.post('/send-confirmation-code', sendConfirmationCode);
router.post('/verify-code', verifyCode);

export default router;