import InvestmentModel from '../../model/investmentModel.js';
import { validatePurchaseFields } from '../../utils/validator.js';

export const purchase = async (req, res) => {
  try {
    const { date, weight, investedValue } = req.body;

    const user_id = req.user.id;

    if (!user_id)
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Not authenticated',
      });

    const validated = validatePurchaseFields({ date, weight, investedValue });

    if (validated?.success === false) {
      return res.status(400).json({
        success: false,
        data: null,
        message: validated.message,
      });
    }

    const investment = await InvestmentModel.create({
      date,
      weight: validated.roundedWeight,
      investedValue: validated.roundedInvestedValue,
      userId: user_id,
    });

    return res.status(201).json({
      success: true,
      data: null,
      message: `Successfully recorded ${investment.weight} mg`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message || 'Failed to record purchase',
    });
  }
};
