import UserModel from '../../models/userModel.js';

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select('email firstName lastName avatar');

    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Not authenticated',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user_email: user.email,
        user_name: `${user.firstName} ${user.lastName}`.trim(),
        user_avatar: user.avatar,
      },
      message: 'Authenticated',
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      data: null,
      message: error.message || 'Not authenticated',
    });
  }
};
