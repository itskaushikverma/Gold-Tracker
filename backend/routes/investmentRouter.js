import express from 'express';
import trimRequest from 'trim-request';
import { protect } from '../middleware/protect.js';
import {
  purchase,
  sell,
  getDetails,
  getPerformance,
  getCustomPrice,
  setCustomPrice,
} from '../controllers/investment/index.js';

const investmentRouter = express.Router();

investmentRouter.use(protect);

investmentRouter.route('/purchase').post(trimRequest.all, purchase);

investmentRouter.route('/sell').post(trimRequest.all, sell);

investmentRouter.route('/getDetails').get(getDetails);

investmentRouter.route('/getPerformance').get(getPerformance);

investmentRouter.route('/customPrice').get(getCustomPrice).post(trimRequest.all, setCustomPrice);

export default investmentRouter;
