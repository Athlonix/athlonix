import { createRoute, z } from '@hono/zod-openapi';
import { serverErrorSchema } from '../validators/general.js';

export const healthCheck = createRoute({
  method: 'get',
  path: '/health',
  summary: 'Health check',
  description: 'Health check',
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'text/plain': {
          schema: { type: 'string' },
        },
      },
    },
  },
  500: serverErrorSchema,
  tags: ['health'],
});

export const dbHealthCheck = createRoute({
  method: 'get',
  path: '/health/db',
  summary: 'Database health check',
  description: 'Database health check',
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'text/plain': {
          schema: { type: 'string' },
        },
      },
    },
  },
  500: serverErrorSchema,
  tags: ['health'],
});
