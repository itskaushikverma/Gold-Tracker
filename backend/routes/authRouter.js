import express from 'express';
import trimRequest from 'trim-request';
import { googleAuth, logout, getMe } from '../controllers/auth/index.js';
import { protect } from '../middleware/protect.js';

const authRouter = express.Router();
authRouter.route('/me').get(protect, getMe);
authRouter.route('/logout').post(logout);
authRouter.route('/').post(trimRequest.all, googleAuth);

export default authRouter;
