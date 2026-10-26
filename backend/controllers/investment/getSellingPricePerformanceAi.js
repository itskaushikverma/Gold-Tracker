import CustomSellingPriceModel from '../../model/customSellingPriceModel.js';
import { generateSellingPriceChart } from '../../services/geminiChartService.js';

export const getSellingPricePerformanceAi = async (req, res) => {
  try {
    const user_id = req.user.id;

    const customPrices = await CustomSellingPriceModel.find({ userId: user_id })
      .sort({ date: 1 })
      .lean();

    if (customPrices.length === 0) {
      return res.status(200).json({
        success: true,
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
        message: 'No custom selling price data found to generate performance.',
      });
    }

    const chart = await generateSellingPriceChart(customPrices);

    return res.status(200).json({
      success: true,
      data: {
        performance: chart,
      },
      message: 'AI selling price performance data fetched successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message || 'Failed to fetch AI performance data.',
    });
  }
};
