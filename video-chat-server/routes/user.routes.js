import express from 'express';
import { getOnlineUsers, getProfile } from '../controllers/user.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.get('/profile', protectRoute, getProfile);
router.post('/list', protectRoute, getOnlineUsers);


export default router;
