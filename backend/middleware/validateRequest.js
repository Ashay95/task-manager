const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

/**
 * Runs after express-validator chains; forwards first validation error as 400.
 */
function validateRequest(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const msg = result.array({ onlyFirstError: true })[0]?.msg || 'Invalid input';
    return next(new AppError(msg, 400));
  }
  next();
}

module.exports = { validateRequest };
