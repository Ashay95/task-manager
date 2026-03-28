const { body } = require('express-validator');

const createTaskValidators = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('description').optional().trim().isLength({ max: 5000 }),
];

const updateTaskValidators = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty').isLength({ max: 200 }),
  body('description').optional().trim().isLength({ max: 5000 }),
];

module.exports = {
  createTaskValidators,
  updateTaskValidators,
};
