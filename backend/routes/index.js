import { Router } from 'express';
import authRouter from './authRouter.js';
import investmentRouter from './investmentRouter.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/investment', investmentRouter);

export default router;
