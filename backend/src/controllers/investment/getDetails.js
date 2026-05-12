import InvestmentModel from '../../model/investmentModel.js';
import UserModel from '../../model/userModel.js';
import { getGoldPrice } from '../../utils/getGoldPrice.js';

export const getDetails = async (req, res, next) => {
  try {
    const { user_id, customGoldSellingPrice } = req.query;

    if (!user_id) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const investments = await InvestmentModel.find({ userId: user_id })
      .sort({ date: -1, createdAt: -1 })
      .lean();

    const user = await UserModel.findById(user_id);

    const goldPrice = await getGoldPrice();
    if (!goldPrice.success)
      return res.status(500).json({ success: false, message: goldPrice.message });

    const round = (num) => Number(num.toFixed(2));

    if (!investments || investments.length === 0)
      return res.status(200).json({
        success: true,
        message: 'No investments found',
        data: {
          investments: [],
          totalInvestedAmount: user?.totalInvestedAmount,
          totalInvestedGoldWeight: user?.totalInvestedGoldWeight,
          totalProfitLoss: 0,
          currentGoldPriceWithGST: round(goldPrice.data.priceWithGST),
          currentGoldPriceWithoutGST: round(goldPrice.data.priceWithoutGST),
          currentGoldSellingPrice: round(goldPrice.data.sellingPrice),
        },
      });

    const currentSellingPrice = goldPrice.data.sellingPrice;

    let currentValue = 0;
    let profitLoss = 0;
    let percentage = 0;
    let isPositive = false;

    const updatedInvestments = investments.map((investment) => {
      if (
        customGoldSellingPrice &&
        !isNaN(customGoldSellingPrice) &&
        Number(customGoldSellingPrice) > 0
      ) {
        currentValue = investment?.isSell?.status
          ? investment?.isSell?.amount
          : round(Number(investment.weight) * Number(customGoldSellingPrice));
      } else {
        currentValue = investment?.isSell?.status
          ? investment?.isSell?.amount
          : round(Number(investment.weight) * Number(currentSellingPrice));
      }
      profitLoss = round(currentValue - Number(investment.investedValue));
      percentage = round(
        (Math.abs(currentValue - Number(investment.investedValue)) /
          Number(investment.investedValue)) *
          100,
      );
      isPositive = profitLoss >= 0;

      return {
        ...investment,
        currentValue,
        profitLoss,
        percentage,
        isPositive,
      };
    });

    const totalInvestmentAmount = round(user.totalInvestedAmount);

    const totalInvestedWeight = round(user.totalInvestedGoldWeight);

    const currentGoldPriceWithGST = round(goldPrice.data.priceWithGST);

    const currentGoldPriceWithoutGST = round(goldPrice.data.priceWithoutGST);

    const currentTotalInvestedAmount =
      customGoldSellingPrice && !isNaN(customGoldSellingPrice) && Number(customGoldSellingPrice) > 0
        ? round(totalInvestedWeight * Number(customGoldSellingPrice))
        : round(totalInvestedWeight * currentSellingPrice);

    const totalProfitLoss = round(currentTotalInvestedAmount - totalInvestmentAmount);

    const totalProfitLossPercentage = round(
      (Math.abs(currentTotalInvestedAmount - totalInvestmentAmount) / totalInvestmentAmount) * 100,
    );

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
        totalProfitLossPercentage,
        currentGoldSellingPrice: currentSellingPrice,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to get investment details, please try again.',
    });
  }
};
