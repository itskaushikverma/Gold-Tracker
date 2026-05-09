import InvestmentModel from '../../model/investmentModel.js';
import { getGoldPrice } from '../../utils/getGoldPrice.js';

export const getDetails = async (req, res, next) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const investments = await InvestmentModel.find({ userId: user_id })
      .sort({ createdAt: -1 })
      .lean();

    const goldPrice = await getGoldPrice();

    const round = (num) => Number(num.toFixed(2));

    if (!investments || investments.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No investments found',
        data: {
          investments: [],
          totalInvestmentAmount: 0,
          totalWeight: 0,
          totalPrice: 0,
          totalProfitLoss: 0,
          currentGoldPriceWithGST: round(goldPrice.data.priceWithGST),
          currentGoldPriceWithoutGST: round(goldPrice.data.priceWithoutGST),
        },
      });
    }

    if (!goldPrice.success) {
      return res.status(500).json({ success: false, message: goldPrice.message });
    }

    const currentPrice = goldPrice.data.priceWithGST;

    const updatedInvestments = investments.map((investment) => {
      return {
        ...investment,
        currentValue: round(investment.weight * currentPrice),
      };
    });

    const totalInvestmentAmount = round(
      updatedInvestments.reduce((total, inv) => total + (inv.investedValue || 0), 0),
    );

    const totalInvestedWeight = round(
      updatedInvestments.reduce((total, inv) => total + (inv.weight || 0), 0),
    );

    const currentGoldPriceWithGST = round(goldPrice.data.priceWithGST);

    const currentGoldPriceWithoutGST = round(goldPrice.data.priceWithoutGST);

    const currentTotalInvestedAmount = round(currentGoldPriceWithGST * totalInvestedWeight);

    const totalProfitLoss = round(currentTotalInvestedAmount - totalInvestmentAmount);

    return res.status(200).json({
      success: true,
      message: 'Investment details',
      data: {
        investments: updatedInvestments,
        totalInvestmentAmount,
        totalInvestedWeight,
        currentGoldPriceWithGST,
        currentGoldPriceWithoutGST,
        currentTotalInvestedAmount,
        totalProfitLoss,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to get investment details, please try again.',
    });
  }
};
