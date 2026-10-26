import InvestmentModel from '../../model/investmentModel.js';
import { getGoldPrice } from '../../utils/getGoldPrice.js';
import { round } from '../../utils/roundToDecimal.js';
import { validateInvestmentQuery } from '../../utils/validator.js';

export const getPerformance = async (req, res) => {
  try {
    const { customGoldSellingPrice } = req.query;
    const user_id = req.user.id;

    const validationError = validateInvestmentQuery({ customGoldSellingPrice });
    if (validationError) {
      return res.status(400).json({
        success: false,
        data: null,
        message: validationError.message,
      });
    }

    const investments = await InvestmentModel.find({ userId: user_id, 'isSell.status': false })
      .sort({ date: 1 })
      .lean();

    if (!investments || investments.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          performance: [],
        },
        message: 'No investments found',
      });
    }

    const goldPrice = await getGoldPrice();

    if (!goldPrice.success) {
      return res.status(500).json({ success: false, data: null, message: goldPrice.message });
    }

    const currentPrice = goldPrice.data.priceWithGST;

    let cumulativeInvested = 0;
    let cumulativeCurrentValue = 0;

    const performance = investments.map((investment) => {
      cumulativeInvested += investment.investedValue;
      cumulativeCurrentValue +=
        customGoldSellingPrice &&
        !isNaN(customGoldSellingPrice) &&
        Number(customGoldSellingPrice) > 0
          ? investment.weight * customGoldSellingPrice
          : investment.weight * currentPrice;

      return {
        date: investment.date,
        invested: round(cumulativeInvested),
        value: round(cumulativeCurrentValue),
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        performance,
      },
      message: 'Performance data fetched successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message || 'Failed to fetch performance data.',
    });
  }
};
