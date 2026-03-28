const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const swaggerUi = require('swagger-ui-express');

const logger = require('./utils/logger');
const { errorHandler } = require('./middleware/errorHandler');
const apiV1 = require('./routes');
const { buildSwaggerSpec } = require('./config/swagger');

const app = express();

// Security headers
app.use(helmet());

// CORS: allow configured frontend origin in production
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  })
);

// Request logging (HTTP access log)
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// Body parsing with size limit
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Mitigate NoSQL injection payloads in req.body
app.use(mongoSanitize());

// API v1
app.use('/api/v1', apiV1);

// Interactive API docs
const swaggerSpec = buildSwaggerSpec();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

// Root helper
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Task API',
    docs: '/api-docs',
    api: '/api/v1',
  });
});

// 404
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use(errorHandler);

module.exports = app;
