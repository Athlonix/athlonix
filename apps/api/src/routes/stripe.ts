import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import authMiddleware from '../middlewares/auth.js';
import { badRequestSchema, notFoundSchema, serverErrorSchema } from '../validators/general.js';

export const webhook = createRoute({
  method: 'post',
  path: '/stripe/webhook',
  summary: 'Stripe webhook',
  description: 'Stripe webhook',
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    500: serverErrorSchema,
    400: badRequestSchema,
  },
  tags: ['stripe'],
});
