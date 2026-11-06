import { Router } from 'express';
import authRouter from './authRouter.js';
import investmentRouter from './investmentRouter.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/investment', investmentRouter);
router.get('/health', (req, res) => {
  return res.status(200).json({ status: 'ok', timestamp: new Date() });
});

export default router;
