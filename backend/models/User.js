const mongoose = require('mongoose');

const ROLES = ['USER', 'ADMIN'];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ROLES,
      default: 'USER',
    },
  },
  { timestamps: true }
);

module.exports = {
  User: mongoose.model('User', userSchema),
  ROLES,
};
