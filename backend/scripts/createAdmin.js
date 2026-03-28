/**
 * One-off script: create an ADMIN user (run from backend directory).
 * Usage: node scripts/createAdmin.js "Admin Name" admin@example.com YourPassword123
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { User } = require('../models/User');

const SALT_ROUNDS = 12;

async function main() {
  const [, , name, email, password] = process.argv;
  if (!name || !email || !password) {
    console.error('Usage: node scripts/createAdmin.js "<name>" <email> <password>');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI);
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const emailNorm = email.toLowerCase();
  await User.findOneAndUpdate(
    { email: emailNorm },
    { $set: { name, email: emailNorm, password: hash, role: 'ADMIN' } },
    { upsert: true, new: true, runValidators: true }
  );
  console.log('Admin user ready:', email.toLowerCase());
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
