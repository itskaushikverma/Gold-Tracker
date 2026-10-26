import jwt from 'jsonwebtoken';
import UserModel from '../model/userModel.js';

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Not authenticated',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.purpose !== 'AUTH' || !decoded.id) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Not authenticated',
      });
    }

    const user = await UserModel.findById(decoded.id).select('_id email');

    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Not authenticated',
      });
    }

    req.user = { id: user._id.toString(), email: user.email };
    next();
  } catch {
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Not authenticated',
    });
  }
};
