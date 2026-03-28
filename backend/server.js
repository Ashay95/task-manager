require('dotenv').config();

const http = require('http');
const app = require('./app');
const { connectDatabase } = require('./config/db');
const logger = require('./utils/logger');

const port = Number(process.env.PORT) || 5000;

async function start() {
  try {
    await connectDatabase();
    const server = http.createServer(app);
    server.listen(port, () => {
      logger.info(`Server listening on port ${port}`, {
        env: process.env.NODE_ENV || 'development',
      });
    });
  } catch (err) {
    logger.error('Failed to start server', { err: err.message, stack: err.stack });
    process.exit(1);
  }
}

start();
