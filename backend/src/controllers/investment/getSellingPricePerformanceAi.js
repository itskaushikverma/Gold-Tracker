import CustomSellingPriceModel from '../../model/customSellingPriceModal.js';
import { generateSellingPriceChart } from '../../services/geminiChartService.js';

export const getSellingPricePerformanceAi = async (req, res, next) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const customPrices = await CustomSellingPriceModel.find({ userId: user_id }).sort({ date: 1 }).lean();

    if (customPrices.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No custom selling price data found to generate performance.',
        data: {
          performance: {
            chartType: 'line',
            title: 'Selling Price Performance',
            xAxis: {
              type: 'time',
              label: 'Date',
            },
            yAxis: {
              label: 'Selling Price',
            },
            data: [],
          },
        },
      });
    }

    const chart = await generateSellingPriceChart(customPrices);

    return res.status(200).json({
      success: true,
      message: 'AI selling price performance data fetched successfully',
      data: {
        performance: chart,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch AI performance data.',
    });
  }
};
