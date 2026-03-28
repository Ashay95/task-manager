const AppError = require('../utils/AppError');

/**
 * Restricts route to users whose role is in the allowed list.
 * Use after authMiddleware so req.user is set.
 */
function roleMiddleware(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403));
    }
    next();
  };
}

module.exports = { roleMiddleware };
