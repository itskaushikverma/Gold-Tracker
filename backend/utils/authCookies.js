import jwt from 'jsonwebtoken';

const isProduction = () => process.env.NODE_ENV === 'production';

const cookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: isProduction(),
  sameSite: isProduction() ? 'none' : 'lax',
  maxAge,
});

export const setAuthCookie = (res, userId) => {
  const token = jwt.sign({ id: String(userId), purpose: 'AUTH' }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('authToken', token, cookieOptions(7 * 24 * 60 * 60 * 1000));
};

const baseCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction(),
  sameSite: isProduction() ? 'none' : 'lax',
});

export const clearRegisterCookie = (res) => {
  res.clearCookie('registerToken', baseCookieOptions());
};

export const clearAuthCookie = (res) => {
  res.clearCookie('authToken', baseCookieOptions());
};
