import InvestmentModel from '../../model/investmentModel.js';
import { validatePurchaseFields } from '../../utils/validator.js';

export const purchase = async (req, res) => {
  try {
    const { date, weight, investedValue } = req.body;
    const user_id = req.user.id;

    const validationError = validatePurchaseFields({ date, weight, investedValue });
    if (validationError) {
      return res.status(400).json({
        success: false,
        data: null,
        message: validationError.message,
      });
    }

    const investment = await InvestmentModel.create({
      date,
      weight: Number(Number(weight).toFixed(2)),
      investedValue: Number(Number(investedValue).toFixed(2)),
      userId: user_id,
    });

    if (!investment)
      return res
        .status(400)
        .json({ success: false, data: null, message: 'Failed to record investment' });

    return res.status(201).json({
      success: true,
      data: null,
      message: 'Investment recorded successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message || 'Investment failed, please try again',
    });
  }
};
