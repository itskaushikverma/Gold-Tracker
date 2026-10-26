import InvestmentModel from '../../model/investmentModel.js';
import { round } from '../../utils/roundToDecimal.js';
import { validateSellFields } from '../../utils/validator.js';

export const sell = async (req, res) => {
  try {
    const { investment_id, sellingPrice } = req.body;
    const user_id = req.user.id;

    const validationError = validateSellFields({ investment_id, sellingPrice });
    if (validationError) {
      return res.status(400).json({
        success: false,
        data: null,
        message: validationError.message,
      });
    }

    const investment = await InvestmentModel.findOne({ _id: investment_id, userId: user_id });

    if (!investment)
      return res.status(404).json({ success: false, data: null, message: 'Investment not found' });

    const result = await InvestmentModel.updateOne(
      { _id: investment_id, userId: user_id, 'isSell.status': false },
      {
        $set: {
          'isSell.status': true,
          'isSell.amount': round(Number(sellingPrice)),
        },
      },
    );

    if (result.matchedCount === 0) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Investment not found or already sold',
      });
    }

    return res.status(200).json({
      success: true,
      data: null,
      message: `Successfully sold investment with Weight ${investment.weight}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message || 'Selling failed',
    });
  }
};
