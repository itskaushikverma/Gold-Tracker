import express from 'express';
import trimRequest from 'trim-request';
import { purchase, sell, getDetails, getPerformance } from '../controllers/investment/index.js';

const investmentRouter = express.Router();

investmentRouter.route('/purchase').post(trimRequest.all, purchase);

investmentRouter.route('/sell').post(trimRequest.all, sell);

investmentRouter.route('/getdetails').get(trimRequest.all, getDetails);

investmentRouter.route('/getPerformance').get(trimRequest.all, getPerformance);

export default investmentRouter;
