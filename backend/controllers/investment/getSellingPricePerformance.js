import CustomSellingPriceModel from '../../model/customSellingPriceModel.js';
import { round } from '../../utils/roundToDecimal.js';

export const getSellingPricePerformance = async (req, res) => {
  try {
    const user_id = req.user.id;

    const customPrices = await CustomSellingPriceModel.find({ userId: user_id })
      .sort({ date: 1 })
      .lean();

    const performanceMap = new Map();

    for (const priceEntry of customPrices) {
      const dateStr = new Date(priceEntry.date).toISOString().split('T')[0];
      performanceMap.set(dateStr, {
        date: new Date(dateStr),
        value: round(priceEntry.sellingPrice),
      });
    }

    const performanceData = Array.from(performanceMap.values());

    performanceData.sort((a, b) => a.date - b.date);

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
          data: performanceData,
        },
      },
      message: 'Selling price performance data fetched successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message || 'Failed to fetch performance data.',
    });
  }
};
