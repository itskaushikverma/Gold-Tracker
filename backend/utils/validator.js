import validator from 'validator';
import { round } from './roundToDecimal.js';

const SELLING_PRICE_PERFORMANCE_SCOPES = new Set(['my', 'smart', 'global']);
const PRICE_PERFORMANCE_TYPES = new Set(['sell', 'purchase']);

export const validatePurchaseFields = ({ date, weight, investedValue, goldRate }) => {
  if (!date) {
    return { success: false, data: null, message: 'Date is required' };
  }

  if (!weight) {
    return { success: false, data: null, message: 'Weight is required' };
  }

  if (!investedValue) {
    return { success: false, data: null, message: 'Invested amount is required' };
  }

  if (!goldRate) {
    return { success: false, data: null, message: 'Gold rate is required' };
  }

  if (!validator.isISO8601(String(date)) && !validator.isDate(String(date))) {
    return { success: false, data: null, message: 'Invalid date format' };
  }

  const purchaseDate = new Date(date);

  if (Number.isNaN(purchaseDate.getTime())) {
    return { success: false, data: null, message: 'Invalid date format' };
  }

  const now = new Date();
  const endOfTodayUtc = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999),
  );

  if (purchaseDate > endOfTodayUtc) {
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

  if (!validator.isFloat(String(goldRate), { gt: 0 })) {
    return {
      success: false,
      data: null,
      message: 'Gold rate must be greater than 0',
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

  const roundedGoldRate = round(goldRate);

  if (!roundedGoldRate) {
    return { success: false, data: null, message: 'Invalid gold rate' };
  }

  return { roundedWeight, roundedInvestedValue, roundedGoldRate };
};

export const validateSellFields = ({ investment_id, sellingPrice, goldRate }) => {
  if (!investment_id) {
    return { success: false, data: null, message: 'Investment ID is required' };
  }

  if (!sellingPrice) {
    return { success: false, data: null, message: 'Selling price is required' };
  }

  if (!goldRate) {
    return { success: false, data: null, message: 'Gold rate is required' };
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

  if (!validator.isFloat(String(goldRate), { gt: 0 })) {
    return {
      success: false,
      data: null,
      message: 'Gold rate must be greater than 0',
    };
  }

  const sellingPriceRounded = round(sellingPrice);

  if (!sellingPriceRounded) {
    return { success: false, data: null, message: 'Invalid selling price' };
  }

  const roundedGoldRate = round(goldRate);

  if (!roundedGoldRate) {
    return { success: false, data: null, message: 'Invalid gold rate' };
  }

  return { sellingPriceRounded, roundedGoldRate };
};

export const validateSetCustomPriceFields = ({ price, date, type }) => {
  if (price === undefined || price === null || price === '') {
    return {
      success: false,
      data: null,
      message: 'Price is required',
    };
  }

  if (!date) {
    return {
      success: false,
      data: null,
      message: 'Date is required',
    };
  }

  if (type === undefined || type === null || type === '') {
    return { success: false, data: null, message: 'Type is required', statusCode: 400 };
  }

  const normalizedType = String(type).trim().toLowerCase();

  if (!PRICE_PERFORMANCE_TYPES.has(normalizedType)) {
    return {
      success: false,
      data: null,
      message: 'Type is invalid',
    };
  }

  if (!validator.isISO8601(String(date)) && !validator.isDate(String(date))) {
    return { success: false, data: null, message: 'Invalid date format' };
  }

  const entryDate = new Date(date);

  if (Number.isNaN(entryDate.getTime())) {
    return { success: false, data: null, message: 'Invalid date format' };
  }

  const now = new Date();
  const endOfTodayUtc = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999),
  );

  if (entryDate > endOfTodayUtc) {
    return { success: false, data: null, message: 'Date cannot be in the future' };
  }

  if (!validator.isFloat(String(price), { gt: 0 })) {
    return {
      success: false,
      data: null,
      message: 'Selling price must be a number greater than 0',
    };
  }

  const roundedPrice = round(price);

  if (!roundedPrice) {
    return { success: false, data: null, message: 'Invalid selling price' };
  }

  return { success: true, roundedPrice, date: entryDate, type: normalizedType };
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

export const validateSellingPricePerformanceScope = ({ scope, type }) => {
  if (scope === undefined || scope === null || scope === '') {
    return { success: false, data: null, message: 'Invalid scope', statusCode: 400 };
  }

  const normalizedScope = String(scope).trim().toLowerCase();

  if (!SELLING_PRICE_PERFORMANCE_SCOPES.has(normalizedScope)) {
    return {
      success: false,
      data: null,
      message: 'Scope is invalid',
    };
  }

  const normalizedType =
    type === undefined || type === null || type === '' ? 'sell' : String(type).trim().toLowerCase();

  if (!PRICE_PERFORMANCE_TYPES.has(normalizedType)) {
    return {
      success: false,
      data: null,
      message: 'Type is invalid',
    };
  }

  return { success: true, scope: normalizedScope, type: normalizedType };
};
