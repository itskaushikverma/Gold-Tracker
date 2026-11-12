import CustomPurchasePriceModel from '../../models/customPurchasePriceModel.js';
import CustomSellPriceModel from '../../models/customSellPriceModel.js';
import { validateSetCustomPriceFields } from '../../utils/validator.js';

export const setCustomPrice = async (req, res) => {
  try {
    const { priceBody, dateBody, typeBody } = req.body;
    const user_id = req.user.id;

    const validated = validateSetCustomPriceFields({
      price: priceBody,
      date: dateBody,
      type: typeBody,
    });

    if (validated?.success === false) {
      return res.status(400).json({
        success: validated.success,
        data: null,
        message: validated.message,
      });
    }

    const { roundedPrice, date, type } = validated;

    const model = type === 'sell' ? CustomSellPriceModel : CustomPurchasePriceModel;

    const dayStart = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
    );
    const dayEnd = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1),
    );

    const existing = await model
      .findOne({
        userId: user_id,
        date: { $gte: dayStart, $lt: dayEnd },
      })
      .sort({ createdAt: -1 });

    if (existing) {
      existing.price = roundedPrice;
      existing.date = date;
      await existing.save();

      return res.status(200).json({
        success: true,
        data: null,
        message: 'Custom price updated',
      });
    }

    await model.create({
      date,
      price: roundedPrice,
      userId: user_id,
    });

    return res.status(201).json({
      success: true,
      data: null,
      message: 'Custom price saved',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};
