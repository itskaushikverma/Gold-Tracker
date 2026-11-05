import InvestmentModel from '../../model/investmentModel.js';
import { validateSellFields } from '../../utils/validator.js';

export const sell = async (req, res) => {
  try {
    const { investment_id, sellingPrice } = req.body;
    const user_id = req.user.id;

    if (!user_id)
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Unauthorized: User ID is required',
      });

    const validated = validateSellFields({ investment_id, sellingPrice });

    if (validated?.success === false) {
      return res.status(400).json({
        success: false,
        data: null,
        message: validated.message,
      });
    }

    const investment = await InvestmentModel.findOneAndUpdate(
      { _id: investment_id, userId: user_id, 'isSell.status': false },
      {
        $set: {
          'isSell.status': true,
          'isSell.amount': validated.sellingPriceRounded,
        },
      },
      { new: true },
    );

    if (!investment)
      return res.status(404).json({ success: false, data: null, message: 'Investment not found' });

    return res.status(200).json({
      success: true,
      data: null,
      message: `Successfully sold ${investment.weight} mg`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};
