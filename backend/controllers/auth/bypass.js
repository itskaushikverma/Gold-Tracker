import validator from 'validator';
import UserModel from '../../models/userModel.js';
import { setAuthCookie } from '../../utils/authCookies.js';

export const bypassAuth = async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Not found',
      });
    }

    const userId = process.env.AUTH_BYPASS_USER_ID?.trim();

    if (!userId) {
      return res.status(503).json({
        success: false,
        data: null,
        message: 'Auth bypass is not configured. Set AUTH_BYPASS_USER_ID in backend/.env',
      });
    }

    if (!validator.isMongoId(userId)) {
      return res.status(500).json({
        success: false,
        data: null,
        message: 'AUTH_BYPASS_USER_ID must be a valid MongoDB ObjectId',
      });
    }

    const user = await UserModel.findById(userId).select('email firstName lastName avatar');

    if (!user) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Bypass user not found. Check AUTH_BYPASS_USER_ID',
      });
    }

    setAuthCookie(res, user._id);

    return res.status(200).json({
      success: true,
      data: {
        user_email: user.email,
        user_name: `${user.firstName} ${user.lastName}`.trim(),
        user_avatar: user.avatar,
      },
      message: 'Auth bypass successful',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message || 'Auth bypass failed',
    });
  }
};
