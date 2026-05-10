import InvestmentModel from '../../model/investmentModel.js';
import UserModel from '../../model/userModel.js';

export const sell = async (req, res) => {
  try {
    const { user_id, investment_details } = req.body;

    if (
      !user_id ||
      !investment_details ||
      !Array.isArray(investment_details) ||
      investment_details.length === 0
    )
      return res
        .status(400)
        .json({ success: false, message: 'User ID and valid Investment Details are required' });

    const operations = investment_details.map((item) => ({
      updateOne: {
        filter: {
          _id: item._id,
          userId: user_id,
          'isSell.status': { $ne: true },
        },
        update: {
          $set: {
            isSell: {
              status: true,
              amount: item.currentValue,
            },
            updatedAt: new Date(),
          },
        },
      },
    }));

    if (operations.length === 0)
      return res.status(400).json({ success: false, message: 'No valid investments provided' });

    const result = await InvestmentModel.bulkWrite(operations);
    const modifiedCount = result.modifiedCount || result.nModified || 0;

    if (modifiedCount === 0)
      return res.status(404).json({ success: false, message: 'No investments updated' });

    const totalSoldWeight = investment_details.reduce((sum, item) => sum + Number(item.weight), 0);
    const totalSoldInvestedValue = investment_details.reduce(
      (sum, item) => sum + Number(item.investedValue),
      0,
    );

    const user = await UserModel.findById(user_id);
    if (user) {
      user.totalInvestedGoldWeight = Number(
        (user.totalInvestedGoldWeight - totalSoldWeight).toFixed(2),
      );
      user.totalInvestedAmount = Number(
        (user.totalInvestedAmount - totalSoldInvestedValue).toFixed(2),
      );
      await user.save();
    }

    return res
      .status(200)
      .json({ success: true, message: `Successfully sold ${modifiedCount} investment(s)` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Selling failed' });
  }
};
