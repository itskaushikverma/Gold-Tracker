import express from 'express';
import trimRequest from 'trim-request';
import { purchase, sell, getDetails, getPerformance, getSellingPricePerformance } from '../controllers/investment/index.js';

const investmentRouter = express.Router();

investmentRouter.route('/purchase').post(trimRequest.all, purchase);

investmentRouter.route('/sell').post(trimRequest.all, sell);

investmentRouter.route('/getdetails').get(trimRequest.all, getDetails);

investmentRouter.route('/getPerformance').get(trimRequest.all, getPerformance);

investmentRouter.route('/getSellingPricePerformance').get(trimRequest.all, getSellingPricePerformance);

export default investmentRouter;
