const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

function buildSwaggerSpec() {
  const options = {
    definition: {
      openapi: '3.0.3',
      info: {
        title: 'Task App REST API',
        version: '1.0.0',
        description:
          'JWT authentication, role-based access (USER / ADMIN), and task CRUD. ADMIN-only deletes.',
      },
      servers: [
        {
          url: 'http://localhost:5001/api/v1',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      tags: [
        { name: 'Auth', description: 'Registration and login' },
        { name: 'Tasks', description: 'Task CRUD (JWT required)' },
      ],
    },
    apis: [path.join(__dirname, '..', 'routes', '*.js')],
  };

  return swaggerJsdoc(options);
}

module.exports = { buildSwaggerSpec };
