import InvestmentModel from '../../models/investmentModel.js';
import { validatePurchaseFields } from '../../utils/validator.js';

export const purchase = async (req, res) => {
  try {
    const { date, weight, investedValue, goldRate } = req.body;

    const user_id = req.user.id;

    const validated = validatePurchaseFields({ date, weight, investedValue, goldRate });

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
      goldRate: {
        purchase: validated.roundedGoldRate,
      },
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
