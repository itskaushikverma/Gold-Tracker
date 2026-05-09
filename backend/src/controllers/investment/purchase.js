import InvestmentModel from '../../model/investmentModel.js';

export const purchase = async (req, res, next) => {
  try {
    const { date, weight, investedValue, user_id } = req.body;

    if (!date || !weight || !investedValue || !user_id) {
      return res
        .status(400)
        .json({ success: false, message: 'Date, weight, amount, and user_id are required' });
    }

    const investment = await InvestmentModel.create({
      date,
      weight,
      investedValue,
      userId: user_id,
    });

    if (!investment) {
      return res.status(400).json({ success: false, message: 'Failed to record investment' });
    }

    return res.status(201).json({
      success: true,
      message: 'Investment recorded successfully',
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || 'Investment failed, please try again' });
  }
};
