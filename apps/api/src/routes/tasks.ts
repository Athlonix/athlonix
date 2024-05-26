import { createRoute, z } from '@hono/zod-openapi';
import authMiddleware from '../middlewares/auth.js';
import { badRequestSchema, serverErrorSchema } from '../validators/general.js';
import { taskSchema } from '../validators/tasks.js';

export const createTask = createRoute({
  method: 'post',
  path: '/activities/{id_activity}/tasks',
  summary: 'Create a task for an activity',
  description: 'Create a task for an activity',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: z.object({ id_activity: z.coerce.number().min(1) }),
    body: {
      content: {
        'application/json': {
          schema: taskSchema.omit({ id: true, created_at: true }),
        },
      },
    },
  },

  responses: {
    201: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: taskSchema,
        },
      },
    },
    400: badRequestSchema,
    500: serverErrorSchema,
  },
  tags: ['tasks'],
});
