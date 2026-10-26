import jwt from 'jsonwebtoken';
import UserModel from '../../model/userModel.js';
import { isDisposableEmail } from '../../utils/checkDispose.js';
import { validateCheckEmailFields } from '../../utils/validator.js';

export const checkEmail = async (req, res) => {
  try {
    const { email, firstName, lastName } = req.body;

    const validationError = validateCheckEmailFields({ firstName, lastName, email });
    if (validationError) {
      return res.status(400).json({
        success: validationError.success,
        data: validationError.data,
        message: validationError.message,
      });
    }

    const isDisposable = await isDisposableEmail(email);

    if (isDisposable === true) {
      return res
        .status(400)
        .json({ success: false, data: null, message: 'Disposable emails are not allowed' });
    }

    const existing_user = await UserModel.findOne({ email: email });

    if (existing_user) {
      return res.status(409).json({
        success: false,
        data: null,
        message: 'Email is already registered. Please Login.',
      });
    }

    const token = jwt.sign(
      { data: { email, firstName, lastName }, purpose: 'REGISTER' },
      process.env.JWT_SECRET,
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
      data: null,
      message: 'Email is available for registration.',
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, data: null, message: error.message || 'Server Error' });
  }
};
