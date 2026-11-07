import CustomSellingPriceModel from '../../../models/customSellingPriceModel.js';

export const getManualSellingPricePerformance = async (req, res, { userId, successMessage }) => {
  try {
    const customPrices = await CustomSellingPriceModel.find({ userId })
      .sort({ date: 1, createdAt: 1 })
      .select('date sellingPrice')
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

    const performanceData = customPrices
      .map((price) => ({
        date: new Date(price.date).getTime(),
        value: price.sellingPrice,
      }))
      .sort((a, b) => a.date - b.date);

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
      message: successMessage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message || 'Failed to fetch selling price performance data.',
    });
  }
};
