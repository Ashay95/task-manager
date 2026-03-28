const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth.service');

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const { token, user } = await authService.register({ name, email, password });
  res.status(201).json({
    success: true,
    message: 'Registered successfully',
    data: { token, user },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { token, user } = await authService.login({ email, password });
  res.json({
    success: true,
    message: 'Login successful',
    data: { token, user },
  });
});

module.exports = {
  register,
  login,
};
