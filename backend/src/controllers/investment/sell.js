import InvestmentModel from '../../model/investmentModel.js';

export const sell = async (req, res, next) => {
  try {
    const { user_id, investment_ids } = req.body;

    if (
      !user_id ||
      !investment_ids ||
      !Array.isArray(investment_ids) ||
      investment_ids.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'user_id and a valid array of investment_ids are required',
      });
    }

    const result = await InvestmentModel.deleteMany({
      _id: { $in: investment_ids },
      userId: user_id,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'No investments found or you are not authorized to sell them',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Successfully sold ${result.deletedCount} investment(s)`,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || 'Selling failed, please try again' });
  }
};
