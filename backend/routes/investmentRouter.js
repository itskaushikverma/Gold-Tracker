import express from 'express';
import trimRequest from 'trim-request';
import { protect } from '../middleware/protect.js';
import {
  purchase,
  sell,
  getDetails,
  getPerformance,
  getSellingPricePerformance,
  getSellingPricePerformanceAi,
  setCustomSellingPrice,
} from '../controllers/investment/index.js';

const investmentRouter = express.Router();

investmentRouter.use(protect);

investmentRouter.route('/purchase').post(trimRequest.all, purchase);

investmentRouter.route('/sell').post(trimRequest.all, sell);

investmentRouter.route('/setCustomSellingPrice').post(trimRequest.all, setCustomSellingPrice);

investmentRouter.route('/getdetails').get(trimRequest.all, getDetails);

investmentRouter.route('/getPerformance').get(trimRequest.all, getPerformance);

investmentRouter
  .route('/getSellingPricePerformance')
  .get(trimRequest.all, getSellingPricePerformance);

investmentRouter
  .route('/getSellingPricePerformanceAi')
  .get(trimRequest.all, getSellingPricePerformanceAi);

export default investmentRouter;
