import UserModel from '../../model/userModel.js';
import { setAuthCookie } from '../../utils/authCookies.js';
import { validateLoginFields } from '../../utils/validator.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const validationError = validateLoginFields({ email, password });
    if (validationError) {
      return res.status(400).json({
        success: false,
        data: null,
        message: validationError.message,
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, data: null, message: 'Invalid email or password' });
    }

    if (!(await user.correctPassword(password, user.password))) {
      return res
        .status(401)
        .json({ success: false, data: null, message: 'Invalid email or password' });
    }

    setAuthCookie(res, user._id);

    return res.status(200).json({
      success: true,
      data: {
        user_id: user._id,
        isAuthenticated: true,
        user_email: user.email,
      },
      message: 'Login successful',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message || 'Login failed, please try again',
    });
  }
};
