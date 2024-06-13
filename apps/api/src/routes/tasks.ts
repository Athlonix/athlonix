import { createRoute, z } from '@hono/zod-openapi';
import authMiddleware from '../middlewares/auth.js';
import { queryAllSchema } from '../utils/pagnination.js';
import { badRequestSchema, idParamValidator, notFoundSchema, serverErrorSchema } from '../validators/general.js';
import { queryAllTasks, taskSchema } from '../validators/tasks.js';

export const getAllActivityTasks = createRoute({
  method: 'get',
  path: '/activities/{id}/tasks',
  summary: 'Get all tasks of an activity',
  description: 'Get all tasks of an activity',
  request: {
    params: z.object({ id: z.coerce.number().min(1) }),
    query: queryAllTasks,
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
  tags: ['task'],
});

export const getAllTasks = createRoute({
  method: 'get',
  path: '/activities_exceptions/{id}/tasks',
  summary: 'Get all tasks of an activity occurence',
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
  tags: ['task'],
});

export const getOneTask = createRoute({
  method: 'get',
  path: '/tasks/{id}',
  summary: 'Get a task',
  description: 'Get a task',
  request: {
    params: z.object({ id: z.coerce.number().min(1) }),
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: taskSchema,
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['task'],
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
    400: badRequestSchema,
    404: notFoundSchema,
    500: serverErrorSchema,
  },
  tags: ['task'],
});

export const deleteTask = createRoute({
  method: 'delete',
  path: '/tasks/{id}',
  summary: 'Delete a task',
  description: 'Delete a task',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: z.object({ id: z.coerce.number().min(1) }),
  },
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
    404: notFoundSchema,
  },
  tags: ['task'],
});

export const updateTask = createRoute({
  method: 'patch',
  path: '/tasks/{id}',
  summary: 'Update a task',
  description: 'Update a task',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
    body: {
      content: {
        'application/json': {
          schema: taskSchema.omit({ id: true, created_at: true, id_activity_exception: true }).partial(),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: taskSchema,
        },
      },
    },
    500: serverErrorSchema,
    400: badRequestSchema,
    404: notFoundSchema,
  },
  tags: ['task'],
});
