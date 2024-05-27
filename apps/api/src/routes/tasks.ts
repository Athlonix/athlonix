import { createRoute, z } from '@hono/zod-openapi';
import authMiddleware from '../middlewares/auth.js';
import { queryAllSchema } from '../utils/pagnination.js';
import { badRequestSchema, notFoundSchema, serverErrorSchema } from '../validators/general.js';
import { taskSchema } from '../validators/tasks.js';

export const getAllTasks = createRoute({
  method: 'get',
  path: '/activities_exceptions/{id}/tasks',
  summary: 'Get all activity occurence tasks',
  description: 'Get all activity occurence tasks',
  request: {
    params: z.object({ id: z.coerce.number().min(1) }),
    query: queryAllSchema,
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: z.object({
            data: z.array(taskSchema),
            count: z.number(),
          }),
        },
      },
    },
    500: serverErrorSchema,
  },
  tags: ['tasks'],
});

export const createTask = createRoute({
  method: 'post',
  path: '/activities_exceptions/{id}/tasks',
  summary: 'Create a task for an activity occurence',
  description: 'Create a task for an occurence',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: z.object({ id: z.coerce.number().min(1) }),
    body: {
      content: {
        'application/json': {
          schema: taskSchema.omit({ id: true, created_at: true, id_activity_exception: true }),
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
    404: notFoundSchema,
    500: serverErrorSchema,
  },
  tags: ['tasks'],
});
