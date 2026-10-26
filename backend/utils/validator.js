import validator from 'validator';

const NAME_PATTERN = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
const MAX_WEIGHT_MG = 1000000;
const MAX_INVESTED_VALUE = 100000000;
const EARLIEST_PURCHASE_DATE = new Date('2000-01-01T00:00:00.000Z');

const isValidName = (name) => NAME_PATTERN.test(name);

export const validateCheckEmailFields = ({ firstName, lastName, email }) => {
  if (!firstName || !lastName || !email) {
    return { success: false, data: null, message: 'All fields are required' };
  }

  if (
    !validator.isLength(firstName, { min: 3, max: 16 }) ||
    !validator.isLength(lastName, { min: 3, max: 16 })
  ) {
    return {
      success: false,
      data: null,
      message: 'First Name and Last Name must be between 3 and 16 characters',
    };
  }

  if (!isValidName(firstName) || !isValidName(lastName)) {
    return {
      success: false,
      data: null,
      message:
        'First Name and Last Name can only contain letters, spaces, hyphens, and apostrophes',
    };
  }

  if (!validator.isEmail(email)) {
    return { success: false, data: null, message: 'Invalid Email' };
  }

  return null;
};

export const validateRegisterFields = ({ password, confirmPassword }) => {
  if (!password || !confirmPassword) {
    return { success: false, data: null, message: 'All fields are required' };
  }

  if (password !== confirmPassword) {
    return { success: false, data: null, message: 'Passwords do not match' };
  }

  if (!validator.isStrongPassword(password)) {
    return {
      success: false,
      data: null,
      message:
        'Password must be 8 characters long, contain atleast one number, lowercase, uppercase letters and a symbol',
    };
  }

  return null;
};

export const validateLoginFields = ({ email, password }) => {
  if (!email || !password) {
    return { success: false, data: null, message: 'Email and password are required' };
  }

  if (!validator.isEmail(email)) {
    return { success: false, data: null, message: 'Invalid Email' };
  }

  return null;
};

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

  if (purchaseDate < EARLIEST_PURCHASE_DATE) {
    return { success: false, data: null, message: 'Purchase date cannot be before 2000' };
  }

  if (!validator.isFloat(String(weight), { gt: 0, max: MAX_WEIGHT_MG })) {
    return {
      success: false,
      data: null,
      message: 'Weight must be greater than 0 and at most 1000000 mg',
    };
  }

  if (!validator.isFloat(String(investedValue), { gt: 0, max: MAX_INVESTED_VALUE })) {
    return {
      success: false,
      data: null,
      message: 'Invested amount must be greater than 0 and at most 100000000',
    };
  }

  return null;
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

  return null;
};

export const validateInvestmentQuery = ({ customGoldSellingPrice }) => {
  if (
    customGoldSellingPrice !== undefined &&
    customGoldSellingPrice !== null &&
    customGoldSellingPrice !== ''
  ) {
    if (!validator.isFloat(String(customGoldSellingPrice), { gt: 0 })) {
      return {
        success: false,
        data: null,
        message: 'Custom gold selling price must be a number greater than 0',
      };
    }
  }

  return null;
};
