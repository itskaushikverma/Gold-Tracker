import InvestmentModel from '../../model/investmentModel.js';
import UserModel from '../../model/userModel.js';

export const sell = async (req, res, next) => {
  try {
    const { user_id, weight, date, price } = req.body;


    if (!date || !weight || !price || !user_id) {
      return res
        .status(400)
        .json({ success: false, message: 'Date, weight, amount, and user_id are required' });
    }

    const user = await UserModel.findById(user_id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.totalInvestedGoldWeight < Number(weight)) {
      return res.status(400).json({
        success: false,
        message: `Insufficient gold. You only have ${user.totalInvestedGoldWeight}mg available.`,
      });
    }

    await InvestmentModel.create(
      [
        {
          date,
          weight: -weight,
          investedValue: -price,
          userId: user_id,
          isSell: true,
        },
      ],
    );

    await UserModel.findByIdAndUpdate(
      user_id,
      {
        $inc: {
          totalInvestedGoldWeight: -Number(weight),
          totalInvestedAmount: -Number(price),
        },
      },
      { new: true },
    );


    return res.status(201).json({
      success: true,
      message: 'Sold successfully',
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Selling failed' });
  }
};
