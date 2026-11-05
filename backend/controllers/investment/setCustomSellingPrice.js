import CustomSellingPriceModel from '../../model/customSellingPriceModel.js';
import { validateSetCustomSellingPriceFields } from '../../utils/validator.js';

export const setCustomSellingPrice = async (req, res) => {
  try {
    const { sellingPrice, date } = req.body;
    const user_id = req.user.id;

    if (!user_id)
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Not authenticated',
      });

    const validated = validateSetCustomSellingPriceFields({ sellingPrice, date });

    if (validated?.success === false) {
      return res.status(400).json({
        success: false,
        data: null,
        message: validated.message,
      });
    }

    const entryDate = validated.date;
    const dayStart = new Date(
      Date.UTC(entryDate.getUTCFullYear(), entryDate.getUTCMonth(), entryDate.getUTCDate()),
    );
    const dayEnd = new Date(
      Date.UTC(entryDate.getUTCFullYear(), entryDate.getUTCMonth(), entryDate.getUTCDate() + 1),
    );

    const existing = await CustomSellingPriceModel.findOne({
      userId: user_id,
      date: { $gte: dayStart, $lt: dayEnd },
    }).sort({ createdAt: -1 });

    if (existing) {
      existing.sellingPrice = validated.sellingPriceRounded;
      existing.date = entryDate;
      await existing.save();

      return res.status(200).json({
        success: true,
        data: null,
        message: 'Custom selling price updated',
      });
    }

    await CustomSellingPriceModel.create({
      date: entryDate,
      sellingPrice: validated.sellingPriceRounded,
      userId: user_id,
    });

    return res.status(201).json({
      success: true,
      data: null,
      message: 'Custom selling price saved',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message || 'Failed to save custom selling price',
    });
  }
};
