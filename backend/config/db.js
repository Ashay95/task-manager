const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * Connect to MongoDB with sensible defaults for production workloads.
 */
async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, {
    maxPoolSize: 10,
  });

  logger.info('MongoDB connected');

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error', { err: err.message });
  });
}

module.exports = { connectDatabase };
