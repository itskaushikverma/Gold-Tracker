import CustomPurchasePriceModel from '../../models/customPurchasePriceModel.js';
import CustomSellPriceModel from '../../models/customSellPriceModel.js';
import InvestmentModel from '../../models/investmentModel.js';
import { getGoldPrice } from '../../utils/getGoldPrice.js';
import { round } from '../../utils/roundToDecimal.js';
import { validateGetDetailsFields } from '../../utils/validator.js';

export const getDetails = async (req, res) => {
  try {
    const { sellPriceOverride: sellPriceOverrideString } = req.query;
    const user_id = req.user.id;

    const validated = validateGetDetailsFields({ sellPriceOverrideString });

    if (validated?.success === false) return res.status(400).json(validated);

    const sellPriceOverride = validated.sellPriceOverrideString;

    const investments = await InvestmentModel.find({ userId: user_id })
      .sort({ date: -1, createdAt: -1 })
      .lean()
      .select('date weight investedValue goldRate isSell');

    const goldPrice = await getGoldPrice();

    if (!goldPrice.success)
      return res.status(500).json({ success: false, data: null, message: goldPrice.message });

    const [overrideSellingPriceDoc, overridePurchasePriceDoc] = await Promise.all([
      CustomSellPriceModel.findOne({ userId: user_id }).sort({ date: -1 }).select('price').lean(),
      CustomPurchasePriceModel.findOne({ userId: user_id })
        .sort({ date: -1 })
        .select('price')
        .lean(),
    ]);

    const data = {
      totalProfitLoss: 0,
      totalInvestedAmount: 0,
      totalPurchasedGoldWeight: 0,
      currentInvestmentValue: 0,
      currentGoldPriceWithGST: goldPrice.data.priceWithGST,
      currentGoldPriceWithoutGST: goldPrice.data.priceWithoutGST,
      currentGoldSellingPrice: goldPrice.data.sellingPrice,
      overrideSellingPrice: overrideSellingPriceDoc?.price || 0,
      overridePurchasePrice: overridePurchasePriceDoc?.price || 0,
      isPositive: null,
    };

    if (!investments.length)
      return res.status(200).json({
        success: true,
        data: {
          investments: [],
          ...data,
        },
        message: 'No investments found',
      });

    const pricePerMg = sellPriceOverride ? data.overrideSellingPrice : data.currentGoldSellingPrice;

    const enrichedInvestments = investments.map((investment) => {
      const isSold = investment?.isSell?.status;
      const currentValue = isSold
        ? investment?.isSell?.amount
        : round(Number(investment.weight) * Number(pricePerMg));
      const profitLoss = round(currentValue - Number(investment.investedValue));
      const percentage = round((Math.abs(profitLoss) / Number(investment.investedValue)) * 100);
      const isPositive = profitLoss >= 0;

      if (!isSold) {
        data.totalInvestedAmount += round(investment.investedValue);
        data.totalPurchasedGoldWeight += round(investment.weight);
      }

      return {
        ...investment,
        currentValue,
        profitLoss,
        percentage,
        isPositive,
      };
    });

    data.totalInvestedAmount = round(data.totalInvestedAmount);
    data.totalPurchasedGoldWeight = round(data.totalPurchasedGoldWeight);
    data.currentInvestmentValue = round(data.totalPurchasedGoldWeight * pricePerMg);
    data.totalProfitLoss = round(data.currentInvestmentValue - data.totalInvestedAmount);
    data.isPositive = data.totalProfitLoss >= 0;
    data.totalProfitLossPercentage = data.totalInvestedAmount
      ? round((Math.abs(data.totalProfitLoss) / data.totalInvestedAmount) * 100)
      : 0;

    return res.status(200).json({
      success: true,
      data: {
        investments: enrichedInvestments,
        ...data,
      },
      message: 'Investment details',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message || 'Failed to get investment details, please try again.',
    });
  }
};
