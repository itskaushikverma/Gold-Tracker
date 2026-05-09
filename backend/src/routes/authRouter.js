import express from 'express';
import trimRequest from 'trim-request';
import { checkEmail, login, register } from '../controllers/auth/index.js';

const authRouter = express.Router();

authRouter.route('/register').post(trimRequest.all, register);

authRouter.route('/check-email').post(trimRequest.all, checkEmail);

authRouter.route('/login').post(trimRequest.all, login);

export default authRouter;
