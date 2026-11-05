import CustomSellingPriceModel from '../../model/customSellingPriceModel.js';
import { generateSellingPriceChart } from '../../services/geminiChartService.js';

export const getSellingPricePerformanceAi = async (req, res) => {
  try {
    const user_id = req.user.id;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Not authenticated',
      });
    }

    const customPrices = await CustomSellingPriceModel.find({ userId: user_id })
      .sort({ date: 1, createdAt: 1 })
      .select('date sellingPrice createdAt')
      .lean();

    const latestByDate = new Map();

    for (const entry of customPrices) {
      const dateKey = new Date(entry.date).toISOString().split('T')[0];
      latestByDate.set(dateKey, {
        date: entry.date,
        sellingPrice: entry.sellingPrice,
      });
    }
    const uniqueCustomPrices = Array.from(latestByDate.values());

    if (uniqueCustomPrices.length === 0) {
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

    const chart = await generateSellingPriceChart(uniqueCustomPrices);

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
