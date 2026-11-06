import jwt from 'jsonwebtoken';

const isProduction = () => process.env.NODE_ENV === 'production';

const baseCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction(),
  sameSite: isProduction() ? 'none' : 'lax',
});

export const setAuthCookie = (res, userId) => {
  const token = jwt.sign({ id: String(userId), purpose: 'AUTH' }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  res.cookie('authToken', token, {
    ...baseCookieOptions(),
    maxAge: 24 * 60 * 60 * 1000,
  });
};

export const clearAuthCookie = (res) => {
  res.clearCookie('authToken', baseCookieOptions());
};
