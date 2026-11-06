import validator from 'validator';
import { round } from './roundToDecimal.js';

export const validatePurchaseFields = ({ date, weight, investedValue }) => {
  if (!date || !weight || !investedValue) {
    return {
      success: false,
      data: null,
      message: 'Date, weight, and amount are required',
    };
  }

  if (!validator.isISO8601(String(date)) && !validator.isDate(String(date))) {
    return { success: false, data: null, message: 'Invalid date format' };
  }

  const purchaseDate = new Date(date);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  if (Number.isNaN(purchaseDate.getTime())) {
    return { success: false, data: null, message: 'Invalid date format' };
  }

  if (purchaseDate > endOfToday) {
    return { success: false, data: null, message: 'Purchase date cannot be in the future' };
  }

  if (!validator.isFloat(String(weight), { gt: 0 })) {
    return {
      success: false,
      data: null,
      message: 'Weight must be greater than 0',
    };
  }

  if (!validator.isFloat(String(investedValue), { gt: 0 })) {
    return {
      success: false,
      data: null,
      message: 'Invested amount must be greater than 0',
    };
  }

  const roundedInvestedValue = round(investedValue);

  if (!roundedInvestedValue) {
    return { success: false, data: null, message: 'Invalid invested value' };
  }

  const roundedWeight = round(weight);

  if (!roundedWeight) {
    return { success: false, data: null, message: 'Invalid weight' };
  }

  return { roundedWeight, roundedInvestedValue };
};

export const validateSellFields = ({ investment_id, sellingPrice }) => {
  if (!investment_id || !sellingPrice) {
    return {
      success: false,
      data: null,
      message: 'Investment ID and Selling Price are required',
    };
  }

  if (!validator.isMongoId(String(investment_id))) {
    return { success: false, data: null, message: 'Invalid investment_id' };
  }

  if (!validator.isFloat(String(sellingPrice), { gt: 0 })) {
    return {
      success: false,
      data: null,
      message: 'Selling price must be a number greater than 0',
    };
  }

  const sellingPriceRounded = round(sellingPrice);

  if (!sellingPriceRounded) {
    return { success: false, data: null, message: 'Invalid selling price' };
  }

  return { sellingPriceRounded };
};

export const validateSetCustomSellingPriceFields = ({ sellingPrice, date }) => {
  if (sellingPrice === undefined || sellingPrice === null || sellingPrice === '') {
    return {
      success: false,
      data: null,
      message: 'Selling price is required',
    };
  }

  if (!date) {
    return {
      success: false,
      data: null,
      message: 'Date is required',
    };
  }

  if (!validator.isISO8601(String(date)) && !validator.isDate(String(date))) {
    return { success: false, data: null, message: 'Invalid date format' };
  }

  const entryDate = new Date(date);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  if (Number.isNaN(entryDate.getTime())) {
    return { success: false, data: null, message: 'Invalid date format' };
  }

  if (entryDate > endOfToday) {
    return { success: false, data: null, message: 'Date cannot be in the future' };
  }

  if (!validator.isFloat(String(sellingPrice), { gt: 0 })) {
    return {
      success: false,
      data: null,
      message: 'Selling price must be a number greater than 0',
    };
  }

  const sellingPriceRounded = round(sellingPrice);

  if (!sellingPriceRounded) {
    return { success: false, data: null, message: 'Invalid selling price' };
  }

  return { sellingPriceRounded, date: entryDate };
};

export const validateGetDetailsFields = ({ sellPriceOverrideString }) => {
  if (
    sellPriceOverrideString === undefined ||
    sellPriceOverrideString === null ||
    sellPriceOverrideString === ''
  ) {
    return {
      success: false,
      data: null,
      message: 'sellPriceOverride is required',
    };
  }

  if (!validator.isBoolean(String(sellPriceOverrideString))) {
    return {
      success: false,
      data: null,
      message: 'sellPriceOverride must be a boolean',
    };
  }

  return {
    sellPriceOverrideString: String(sellPriceOverrideString) === 'true',
  };
};
