import { clearAuthCookie } from '../../utils/authCookies.js';

export const logout = (req, res) => {
  clearAuthCookie(res);
  return res.status(200).json({ success: true, data: null, message: 'Logged out' });
};
