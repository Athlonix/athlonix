import { createRoute } from '@hono/zod-openapi';

export const healthCheck = createRoute({
  method: 'get',
  path: '/health',
  summary: 'Health check',
  description: 'Health check',
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: { type: 'string' },
        },
      },
    },
  },
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
        'application/json': {
          schema: { type: 'string' },
        },
      },
    },
  },
  tags: ['health'],
});
