import CustomSellingPriceModel from '../../model/customSellingPriceModel.js';
import { validateInvestmentQuery } from '../../utils/validator.js';

export const setCustomSellingPrice = async (req, res) => {
  try {
    const { sellingPrice } = req.body;

    if (sellingPrice === undefined || sellingPrice === null || sellingPrice === '') {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Custom gold selling price must be a number greater than 0',
      });
    }

    const validationError = validateInvestmentQuery({ customGoldSellingPrice: sellingPrice });
    if (validationError) {
      return res.status(400).json({
        success: false,
        data: null,
        message: validationError.message,
      });
    }

    await CustomSellingPriceModel.create({
      date: new Date(),
      sellingPrice: Number(sellingPrice),
      userId: req.user.id,
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
