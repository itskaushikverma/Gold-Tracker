import jwt from 'jsonwebtoken';
import UserModel from '../../model/userModel.js';
import { clearRegisterCookie, setAuthCookie } from '../../utils/authCookies.js';
import { validateRegisterFields } from '../../utils/validator.js';

export const register = async (req, res) => {
  try {
    const registerToken = req.cookies.registerToken;
    const { password, confirmPassword } = req.body;

    if (!registerToken)
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Session expired, Please try registering again',
      });

    const validationError = validateRegisterFields({ password, confirmPassword });

    if (validationError) {
      return res.status(400).json({
        success: false,
        data: null,
        message: validationError.message,
      });
    }

    const decodedToken = jwt.verify(registerToken, process.env.JWT_SECRET);

    if (decodedToken.purpose !== 'REGISTER' || !decodedToken.data) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Session expired, Please try registering again',
      });
    }

    const { email, firstName, lastName } = decodedToken.data;

    const existing_user = await UserModel.findOne({ email });

    if (existing_user)
      return res.status(409).json({
        success: false,
        data: null,
        message: 'Email is already registered. Please Login.',
      });

    const new_user = await UserModel.create({ email, firstName, lastName, password });

    clearRegisterCookie(res);
    setAuthCookie(res, new_user._id);

    return res.status(200).json({
      success: true,
      data: {
        user_id: new_user._id,
        isAuthenticated: true,
        user_email: new_user.email,
      },
      message: 'Registration successful.',
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Session expired, Please try registering again',
      });
    }

    return res.status(500).json({
      success: false,
      data: null,
      message: error.message || 'Registration failed, Please try again.',
    });
  }
};
