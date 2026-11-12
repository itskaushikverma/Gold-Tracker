import CustomSellPriceModel from '../../models/customSellPriceModel.js';
import InvestmentModel from '../../models/investmentModel.js';
import { getGoldPrice } from '../../utils/getGoldPrice.js';
import { round } from '../../utils/roundToDecimal.js';
import { validateGetDetailsFields } from '../../utils/validator.js';

export const getPerformance = async (req, res) => {
  try {
    const { sellPriceOverride: sellPriceOverrideString } = req.query;
    const user_id = req.user.id;

    const validated = validateGetDetailsFields({ sellPriceOverrideString });

    if (validated?.success === false) return res.status(400).json(validated);

    const sellPriceOverride = validated.sellPriceOverrideString;

    const investments = await InvestmentModel.find({ userId: user_id, 'isSell.status': false })
      .sort({ date: 1 })
      .lean()
      .select('date investedValue weight');

    if (investments.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          performance: [],
        },
        message: 'No investments found',
      });
    }

    let goldPrice = null;
    let overrideSellingPrice = null;
    let pricePerMg = null;

    if (sellPriceOverride) {
      overrideSellingPrice = await CustomSellPriceModel.findOne({ userId: user_id })
        .sort({ date: -1 })
        .select('price');
    } else {
      goldPrice = await getGoldPrice();
      if (goldPrice && !goldPrice.success)
        return res.status(500).json({ success: false, data: null, message: goldPrice.message });
    }

    pricePerMg = sellPriceOverride ? overrideSellingPrice?.price : goldPrice?.data?.sellingPrice;

    let cumulativeInvested = 0;
    let cumulativeCurrentValue = 0;

    const performance = investments
      .map((investment) => {
        cumulativeInvested += Number(investment.investedValue);
        cumulativeCurrentValue += Number(investment.weight) * Number(pricePerMg);
        return {
          date: new Date(investment.date).getTime(),
          invested: round(cumulativeInvested),
          value: round(cumulativeCurrentValue),
        };
      })
      .sort((a, b) => a.date - b.date);

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
