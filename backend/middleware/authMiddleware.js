const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const { User } = require('../models/User');

/**
 * Verifies JWT from Authorization: Bearer <token> and attaches req.user (id, role, email).
 */
async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return next(new AppError('Authentication required', 401));
    }

    const token = header.slice(7).trim();
    if (!token) {
      return next(new AppError('Authentication required', 401));
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return next(new AppError('Server misconfiguration', 500));
    }

    let payload;
    try {
      payload = jwt.verify(token, secret);
    } catch {
      return next(new AppError('Invalid or expired token', 401));
    }

    const user = await User.findById(payload.sub).select('email role name');
    if (!user) {
      return next(new AppError('User no longer exists', 401));
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    };
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { authMiddleware };
