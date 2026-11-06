export const getMe = (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      user_email: req.user.email,
      user_name: `${req.user.firstName} ${req.user.lastName}`.trim(),
      user_avatar: req.user.avatar,
    },
    message: 'Authenticated',
  });
};
