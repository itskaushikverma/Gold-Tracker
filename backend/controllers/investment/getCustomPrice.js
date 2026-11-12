import CustomPurchasePriceModel from '../../models/customPurchasePriceModel.js';
import CustomSellPriceModel from '../../models/customSellPriceModel.js';
import { generateCustomPriceChart } from '../../services/geminiChartService.js';
import { validateSellingPricePerformanceScope } from '../../utils/validator.js';

const resolveUserId = (scope, authenticatedUserId) => {
  if (scope === 'global') return process.env.GLOBAL_SELL_PRICE_OWNER_USER_ID;
  return authenticatedUserId;
};

const PRICE_MODELS = {
  sell: CustomSellPriceModel,
  purchase: CustomPurchasePriceModel,
};

export const getCustomPrice = async (req, res) => {
  try {
    const { scope: scopeQuery, type: typeQuery } = req.query;

    const validated = validateSellingPricePerformanceScope({
      scope: scopeQuery,
      type: typeQuery,
    });

    if (validated?.success === false) {
      return res.status(validated.statusCode || 400).json({
        success: false,
        data: validated.data,
        message: validated.message,
      });
    }

    const { scope, type } = validated;
    const userId = resolveUserId(scope, req.user.id);
    const Model = PRICE_MODELS[type];

    if (!Model) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Type is invalid',
      });
    }

    const rawData = await Model.find({ userId }).sort({ date: 1 }).select('date price').lean();

    if (rawData.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          performance: {
            chartType: 'line',
            title: 'Custom Price Performance',
            xAxis: {
              type: 'time',
              label: 'Date',
            },
            yAxis: {
              label: 'Price',
            },
            data: [],
          },
        },
        message: 'No custom price data found to generate Graph.',
      });
    }

    const formattedData = rawData.map((item) => ({
      date: new Date(item.date).getTime(),
      value: Number(item.price),
    }));

    if (scope === 'my' || scope === 'global') {
      return res.status(200).json({
        success: true,
        data: {
          performance: {
            chartType: 'line',
            title: 'Custom Price Performance',
            xAxis: {
              type: 'time',
              label: 'Date',
            },
            yAxis: {
              label: 'Price',
            },
            data: formattedData,
          },
        },
        message: 'Custom price data fetched successfully',
      });
    }

    if (scope === 'smart') {
      const chart = await generateCustomPriceChart(formattedData);
      console.log(chart);
      return res.status(200).json({
        success: true,
        data: {
          performance: chart,
        },
        message: 'Smart custom price data fetched successfully',
      });
    }

    return res.status(400).json({
      success: false,
      data: null,
      message: 'Invalid Input',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};
