import CustomSellingPriceModel from '../../model/customSellingPriceModal.js';
import { round } from '../../utils/roundToDecimal.js';

export const getSellingPricePerformance = async (req, res, next) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const customPrices = await CustomSellingPriceModel.find({ userId: user_id }).sort({ date: 1 }).lean();

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
      message: 'Selling price performance data fetched successfully',
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
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch performance data.',
    });
  }
};
