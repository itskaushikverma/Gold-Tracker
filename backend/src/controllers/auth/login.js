import UserModel from '../../model/userModel.js';
import { filterObj } from '../../utils/filterObj.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const filteredBody = filterObj({ email, password }, 'email', 'password');

    const user = await UserModel.findOne({ email: filteredBody.email });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user_id: user._id,
        isAuthenticated: true,
        user_email: user.email,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || 'Login failed, please try again' });
  }
};
