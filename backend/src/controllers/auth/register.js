import validator from 'validator';
import jwt from 'jsonwebtoken';
import UserModel from '../../model/userModel.js';
import { filterObj } from '../../utils/filterObj.js';

export const register = async (req, res, next) => {
  try {
    const registerToken = req.cookies.registerToken;
    const { password, confirmPassword } = req.body;

    if (!registerToken)
      return res
        .status(400)
        .json({ success: false, message: 'Session expired, Please try registering again' });

    if (!password || !confirmPassword)
      return res.status(400).json({ success: false, message: 'All fields are required' });

    const decodedToken = await jwt.verify(registerToken, process.env.JWT_REGISTER_EMAIL_SECRET);

    const { email, firstName, lastName } = decodedToken.data;

    if (password !== confirmPassword)
      return res.status(400).json({ success: false, message: 'Passwords do not match' });

    if (!validator.isStrongPassword(password))
      return res.status(400).json({
        success: false,
        message:
          'Password must be 8 characters long, contain atleast one number, lowercase, uppercase letters and a symbol',
      });

    const filteredBody = filterObj(
      { email, firstName, lastName, password },
      'email',
      'firstName',
      'lastName',
      'password',
    );

    const existing_user = await UserModel.findOne({ email: email });

    if (existing_user)
      return res
        .status(409)
        .json({ success: false, message: 'Email is already registered. Please Login.' });

    const new_user = await UserModel.create(filteredBody);

    return res.status(200).json({
      success: true,
      message: 'Registration successful.',
      data: {
        user_id: new_user._id,
        isAuthenticated: true,
        user_email: new_user.email,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || 'Registration failed, Please try again.' });
  }
};
