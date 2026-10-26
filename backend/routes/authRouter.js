import express from 'express';
import trimRequest from 'trim-request';
import { checkEmail, login, logout, register } from '../controllers/auth/index.js';

const authRouter = express.Router();

authRouter.route('/check-email').post(trimRequest.all, checkEmail);

authRouter.route('/register').post(trimRequest.all, register);

authRouter.route('/login').post(trimRequest.all, login);

authRouter.route('/logout').post(logout);

export default authRouter;
