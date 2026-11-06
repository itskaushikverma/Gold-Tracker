import { OAuth2Client } from 'google-auth-library';
import UserModel from '../../models/userModel.js';
import { setAuthCookie } from '../../utils/authCookies.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const splitName = (fullName = '') => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: 'User', lastName: 'Google' };
  if (parts.length === 1) return { firstName: parts[0], lastName: 'User' };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
};

export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential || typeof credential !== 'string') {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Google credential is required',
      });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({
        success: false,
        data: null,
        message: 'Google authentication is not configured',
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.sub || !payload?.email) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Invalid Google token',
      });
    }

    if (payload.email_verified === false) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Google email is not verified',
      });
    }

    const googleId = payload.sub;
    const email = payload.email.toLowerCase();
    const { firstName, lastName } = splitName(payload.name);
    const avatar = payload.picture || null;

    let user = await UserModel.findOne({ googleId });

    if (user) {
      let dirty = false;

      if (user.email !== email) {
        user.email = email;
        dirty = true;
      }

      if (avatar && user.avatar !== avatar) {
        user.avatar = avatar;
        dirty = true;
      }

      if (dirty) await user.save();
    } else {
      user = await UserModel.create({
        googleId,
        email,
        firstName,
        lastName,
        avatar,
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
      message: 'Google authentication successful',
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      data: null,
      message: error.message || 'Google authentication failed',
    });
  }
};
