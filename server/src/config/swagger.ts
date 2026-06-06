import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import { env } from './env';

/**
 * Swagger / OpenAPI spec generated from JSDoc `@openapi` annotations found in
 * the route files of every module.
 */
const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Adaptive Personalised Marketing Agent API',
      version: '1.0.0',
      description:
        'REST API for the Adaptive Personalised Marketing Agent — users, brand, ' +
        'strategies, campaigns, campaign items and performance events.',
    },
    servers: [{ url: `http://localhost:${env.PORT}${env.API_PREFIX}`, description: 'Local' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
    path.join(__dirname, '..', 'modules', '**', '*.routes.{ts,js}'),
    path.join(__dirname, '..', 'modules', '**', '*.swagger.{ts,js}'),
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
