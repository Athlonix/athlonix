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
        'application/json': {
          schema: z.string(),
        },
      },
    },
  },
  500: serverErrorSchema,
  tags: ['health'],
});
