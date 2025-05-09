import express from 'express';
import { signup, login, logout, checkAuth } from '../controllers/auth.controller.js';
import { protectRoute } from "../middleware/protectRoute.js";
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout); // Можно использовать POST, если требуется
router.get("/check", protectRoute, checkAuth);
export default router;
