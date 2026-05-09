import validator from 'validator';
import jwt from 'jsonwebtoken';
import UserModel from '../../model/userModel.js';
import { isDisposableEmail } from '../../utils/checkDispose.js';

export const checkEmail = async (req, res, next) => {
  try {
    const { email, firstName, lastName } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (
      !validator.isLength(firstName, { min: 3, max: 16 }) ||
      !validator.isLength(lastName, { min: 3, max: 16 })
    ) {
      return res.status(400).json({
        success: false,
        message: 'First Name and Last Name must be between 3 and 16 characters',
      });
    }

    if (!validator.isAlpha(firstName) || !validator.isAlpha(lastName)) {
      return res.status(400).json({
        success: false,
        message: 'First Name and Last Name can only contain alphabetic characters',
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid Email' });
    }

    const isDisposable = await isDisposableEmail(email);

    if (isDisposable) {
      return res
        .status(400)
        .json({ success: false, message: 'Disposable emails are not allowed ' });
    }

    const existing_user = await UserModel.findOne({ email: email });

    if (existing_user) {
      return res
        .status(409)
        .json({ success: false, message: 'Email is already registered. Please Login.' });
    }

    const token = jwt.sign(
      { data: { email, firstName, lastName }, purpose: 'REGISTER' },
      process.env.JWT_REGISTER_EMAIL_SECRET,
      {
        expiresIn: '5m',
      },
    );

    res.cookie('registerToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 5 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: 'Email is available for registration.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};
